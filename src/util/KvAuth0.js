import { sub } from 'date-fns';
import * as Sentry from '@sentry/vue'; // could be async import
import syncDate from './syncDate';
import logFormatter from './logFormatter';

export const KIVA_ID_KEY = 'https://www.kiva.org/kiva_id';
export const LAST_LOGIN_KEY = 'https://www.kiva.org/last_login';
export const USED_MFA_KEY = 'https://www.kiva.org/used_mfa';
const FAKE_AUTH_NAME = 'kvfa';
const ALLOWED_FAKE_AUTH_DOMAINS = [
	'login.dev.kiva.org',
	'login.stage.kiva.org',
];
const SYNC_NAME = 'kvls';
const LOGOUT_VALUE = 'o';
const COOKIE_OPTIONS = { path: '/', secure: true };

// These symbols are unique, and therefore are private to this scope.
// For more details, see https://medium.com/@davidrhyswhite/private-members-in-es6-db1ccd6128a5
const initWebAuth = Symbol('initWebAuth');
const errorCallbacks = Symbol('errorCallbacks');
const handleUnknownError = Symbol('handleUnknownError');
const mfaTokenPromise = Symbol('mfaTokenPromise');
const sessionPromise = Symbol('sessionPromise');
const setAuthData = Symbol('setAuthData');
const setMfaAuthData = Symbol('setMfaAuthData');
const parseMfaHash = Symbol('parseMfaHash');
const noteLoggedIn = Symbol('noteLoggedIn');
const noteLoggedOut = Symbol('noteLoggedOut');
const clearNotedLoginState = Symbol('clearNotedLoginState');

function getErrorString(err) {
	return `${err.error || err.code || err.name}: ${err.error_description || err.description}`;
}

function isAuth0Hash(hash) {
	if (hash.indexOf('error') === -1
		&& hash.indexOf('access_token') === -1
		&& hash.indexOf('id_token') === -1
		&& hash.indexOf('refresh_token') === -1) {
		return false;
	}
	return true;
}

async function storeRedirectState() {
	const { default: store2 } = await import('store2');

	const { pathname, search } = window.location;
	store2.session('auth0.redirect', `${pathname}${search}`);

	const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	store2.session('auth0.state', state);

	return state;
}

// Class to handle interacting with auth0 in the browser
export default class KvAuth0 {
	constructor({
		accessToken = '',
		audience,
		checkFakeAuth = false,
		clientID,
		cookieStore,
		domain,
		mfaAudience,
		redirectUri,
		scope,
		user = null,
	}) {
		this[errorCallbacks] = [];
		this.enabled = true;
		this.user = user;
		this.accessToken = accessToken;
		this.accessTokenExpired = false;
		this.isServer = typeof window === 'undefined';
		this.checkFakeAuth = !!checkFakeAuth;
		this.cookieStore = cookieStore;

		// properties for WebAuth clients
		this.audience = audience;
		this.mfaAudience = mfaAudience;
		this.clientID = clientID;
		this.domain = domain;
		this.redirectUri = redirectUri;
		this.scope = scope;

		if (this.fakeAuthAllowed()) {
			// Set user from fake auth cookie if available
			const idTokenPayload = this.getFakeIdTokenPayload();
			if (idTokenPayload) {
				this[setAuthData]({ idTokenPayload });
				this[noteLoggedIn]();
			}
		}
	}

	// Setup Auth0 WebAuth client for authentication
	[initWebAuth]() {
		if (this.webAuth || this.isServer) {
			return Promise.resolve();
		}
		return import('auth0-js').then(({ default: auth0js }) => {
			this.webAuth = new auth0js.WebAuth({
				clientID: this.clientID,
				domain: this.domain,
				redirectUri: this.redirectUri,
			});
		});
	}

	[setAuthData]({ idTokenPayload, accessToken, expiresIn } = {}) {
		this.user = idTokenPayload || null;
		this.accessToken = accessToken || '';

		if (expiresIn > 0) {
			this.accessTokenExpired = false;
			setTimeout(() => {
				// set null auth data to remove expired token
				this[setAuthData]();
				this.accessTokenExpired = true;
			}, Number(expiresIn) * 1000);
		}
	}

	[setMfaAuthData]({ accessToken, expiresIn } = {}) {
		// save access token as this.mfaManagementToken
		this.mfaManagementToken = accessToken;
		// mfa management token expiration handling
		if (expiresIn > 0) {
			setTimeout(() => {
				this.mfaManagementToken = '';
			}, Number(expiresIn) * 1000);
		}
	}

	/* eslint-disable no-underscore-dangle */

	// Return the kiva id for the current user (or undefined)
	getKivaId() {
		return this.user?.[KIVA_ID_KEY] || this.user?._json?.[KIVA_ID_KEY];
	}

	// Return the last login timestamp for the current user (or 0)
	getLastLogin() {
		return this.user?.[LAST_LOGIN_KEY] || this.user?._json?.[LAST_LOGIN_KEY] || 0;
	}

	isMfaAuthenticated() {
		return this.user?.[USED_MFA_KEY] || this.user?._json?.[USED_MFA_KEY] || false;
	}

	/* eslint-enable no-underscore-dangle */

	// Return true iff fake auth should be checked and fake auth is allowed for the current domain
	fakeAuthAllowed() {
		return this.checkFakeAuth && ALLOWED_FAKE_AUTH_DOMAINS.includes(this.domain);
	}

	getFakeAuthCookieValue() {
		if (!this.fakeAuthAllowed()) return;

		const cookieValue = this.cookieStore.get(FAKE_AUTH_NAME) ?? '';

		const cookieParts = cookieValue.split(':');
		const userId = parseInt(cookieParts[0], 10);

		if (userId) {
			const scopes = (cookieParts[1] ?? '').split('/').filter(x => x);

			return { userId, scopes };
		}
	}

	getFakeIdTokenPayload() {
		const { userId, scopes } = this.getFakeAuthCookieValue() ?? {};

		if (userId) {
			try {
				let lastLogin;
				const now = new Date();
				if (scopes.includes('recent')) {
					// current time
					lastLogin = now.getTime();
				} else if (scopes.includes('active')) {
					// current time - 5:01
					lastLogin = sub(now, { minutes: 5, seconds: 1 }).getTime();
				} else {
					// current time - 1:00:01
					lastLogin = sub(now, { hours: 1, seconds: 1 }).getTime();
				}

				return {
					[KIVA_ID_KEY]: userId,
					[LAST_LOGIN_KEY]: lastLogin,
					[USED_MFA_KEY]: scopes.includes('mfa'),
					scopes,
				};
			} catch (e) {
				console.error(e);
				Sentry.captureException(e);
			}
		}
	}

	getSyncCookieValue() {
		return this.cookieStore.get(SYNC_NAME);
	}

	isNotedLoggedIn() {
		const syncValue = this.getSyncCookieValue();
		return syncValue && syncValue !== LOGOUT_VALUE;
	}

	isNotedLoggedOut() {
		return this.getSyncCookieValue() === LOGOUT_VALUE;
	}

	isNotedUserSessionUser() {
		return String(this.getKivaId()) === String(this.getSyncCookieValue());
	}

	[noteLoggedIn]() {
		this.cookieStore.set(SYNC_NAME, this.getKivaId(), COOKIE_OPTIONS);
	}

	[noteLoggedOut]() {
		this.cookieStore.set(SYNC_NAME, LOGOUT_VALUE, COOKIE_OPTIONS);
	}

	[clearNotedLoginState]() {
		this.cookieStore.remove(SYNC_NAME, COOKIE_OPTIONS);
	}

	// Parse the hash from the URL to get the MFA management token
	[parseMfaHash]() {
		return new Promise((resolve, reject) => {
			const { hash } = window.location;
			if (isAuth0Hash(hash)) {
				this.webAuth.parseHash({
					hash,
					responseType: 'token',
				}, (err, result) => {
					if (err) {
						reject(err);
					} else {
						this[setMfaAuthData](result);
						resolve();
					}
				});
			} else {
				resolve();
			}
		});
	}

	// Silently fetch an access token for the MFA api to manage MFA factors
	getMfaManagementToken() {
		// only try this if in the browser
		if (this.isServer) {
			return Promise.reject(new Error('getMfaManagementToken called in server mode'));
		}

		// Ensure only one mfa token request at a time
		if (this[mfaTokenPromise]) return this[mfaTokenPromise];

		// Check for user before trying for token
		if (!this.user) {
			return Promise.reject(new Error('api.authenticationRequired'));
		}

		// Resolve with management token if we already have one
		if (this.mfaManagementToken) {
			return Promise.resolve(this.mfaManagementToken);
		}

		// Fetch a new mfa management token
		this[mfaTokenPromise] = new Promise((resolve, reject) => {
			// Initialize the web auth client
			this[initWebAuth]()
				// Parse the hash if it exists
				.then(() => this[parseMfaHash]())
				.then(() => {
					if (this.mfaManagementToken) {
						resolve(this.mfaManagementToken);
					} else {
						// If we still don't have a token, try to get one
						// Ensure browser clock is correct before fetching the token
						syncDate().then(() => {
							// Store the current URL in session storage to redirect back to it after MFA
							return storeRedirectState();
						}).then(state => {
							this.webAuth.authorize({
								state,
								audience: this.mfaAudience,
								responseType: 'token',
								scope: 'enroll read:authenticators remove:authenticators',
							});
						});
					}
				})
				.catch(reject);
		});

		// Once the promise completes, stop tracking it
		this[mfaTokenPromise].finally(() => {
			this[mfaTokenPromise] = null;
		});

		return this[mfaTokenPromise];
	}

	// Silently check for a logged in session with auth0 using hidden iframes
	checkSession({ skipIfUserExists = false } = {}) {
		// only try this if in the browser
		if (this.isServer) {
			return Promise.reject(new Error('checkSession called in server mode'));
		}

		if (skipIfUserExists && this.user) {
			return Promise.resolve();
		}

		// Ensure that we only check the session once at a time
		if (this[sessionPromise]) return this[sessionPromise];

		// Check for an existing session
		this[sessionPromise] = new Promise(resolve => {
			// Ensure browser clock is correct before checking session
			syncDate().then(() => this[initWebAuth]()).then(() => {
				this.webAuth.checkSession({
					audience: this.audience,
					responseType: 'token id_token',
					scope: this.scope,
				}, (err, result) => {
					if (err) {
						this[setAuthData]();
						if (err.error === 'login_required'
							|| err.error === 'unauthorized'
							|| err.error === 'access_denied'
						) {
							// User is not logged in, so continue without authentication
							this[noteLoggedOut]();
							resolve();
						} else if (err.error === 'consent_required' || err.error === 'interaction_required') {
							// These errors require interaction beyond what can be provided by webauth,
							// so resolve without authentication for now. Other possibility is to redirect
							// to login to complete authentication.
							Sentry.withScope(scope => {
								scope.setLevel('warning');
								Sentry.captureMessage(`Auth session not started: ${getErrorString(err)}`);
							});
							resolve();
						} else {
							// Everything else, actually throw an error
							Sentry.withScope(scope => {
								scope.setTag('auth_method', 'check session');
								Sentry.captureMessage(getErrorString(err));
							});
							this[clearNotedLoginState]();
							this[handleUnknownError](err);
							resolve();
						}
					} else {
						// Successful authentication
						this[setAuthData](result);
						this[noteLoggedIn]();
						resolve();
					}
				});
			});
		});

		// Once the promise completes, stop tracking it
		this[sessionPromise].finally(() => {
			this[sessionPromise] = null;
		});

		return this[sessionPromise];
	}

	// Receive a callback to be called in case of an unknown error
	onError(callback) {
		this[errorCallbacks].push(callback);
	}

	// Call error callbacks with error information
	[handleUnknownError](error) {
		logFormatter(error, 'error');
		this[errorCallbacks].map(callback => callback({
			error,
			errorString: getErrorString(error),
			eventId: Sentry.lastEventId(),
			user: this.user,
		}));
	}
}

// Provide a mock class for testing and disabling auth0 usage
export const MockKvAuth0 = {
	enabled: false,
	user: {},
	accessToken: '',
	getKivaId: () => undefined,
	getLastLogin: () => 0,
	getMfaEnrollToken: () => Promise.resolve({}),
	fakeAuthAllowed: () => false,
	getFakeAuthCookieValue: () => undefined,
	getFakeIdTokenPayload: () => undefined,
	getSyncCookieValue: () => null,
	isNotedLoggedIn: () => false,
	isNotedLoggedOut: () => false,
	isNotedUserSessionUser: () => true,
	checkSession: () => Promise.resolve({}),
	popupLogin: () => Promise.resolve({}),
	popupCallback: () => Promise.resolve({}),
	onError: () => { },
};

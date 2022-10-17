import sub from 'date-fns/sub';
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
const initMfaWebAuth = Symbol('initMfaWebAuth');
const errorCallbacks = Symbol('errorCallbacks');
const handleUnknownError = Symbol('handleUnknownError');
const mfaTokenPromise = Symbol('mfaTokenPromise');
const sessionPromise = Symbol('sessionPromise');
const setAuthData = Symbol('setAuthData');
const noteLoggedIn = Symbol('noteLoggedIn');
const noteLoggedOut = Symbol('noteLoggedOut');
const clearNotedLoginState = Symbol('clearNotedLoginState');

function getErrorString(err) {
	return `${err.error || err.code || err.name}: ${err.error_description || err.description}`;
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
				audience: this.audience,
				clientID: this.clientID,
				domain: this.domain,
				redirectUri: this.redirectUri,
				responseType: 'token id_token',
				scope: this.scope,
			});
		});
	}

	// Setup Auth0 WebAuth client for MFA management
	[initMfaWebAuth]() {
		if (this.mfaWebAuth || this.isServer) {
			return Promise.resolve();
		}
		return import('auth0-js').then(({ default: auth0js }) => {
			this.mfaWebAuth = new auth0js.WebAuth({
				audience: this.mfaAudience,
				clientID: this.clientID,
				domain: this.domain,
				redirectUri: this.redirectUri,
				responseType: 'token',
				scope: 'enroll read:authenticators remove:authenticators',
			});
		});
	}

	[setAuthData]({ idTokenPayload, accessToken, expiresIn } = {}) {
		this.user = idTokenPayload || null;
		this.accessToken = accessToken || '';

		if (expiresIn > 0) {
			setTimeout(() => {
				// set null auth data to remove expired token
				this[setAuthData]();
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
		if (!this.checkFakeAuth) return;

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

		this[mfaTokenPromise] = new Promise((resolve, reject) => {
			// Ensure browser clock is correct before fetching the token
			syncDate().then(() => this[initMfaWebAuth]()).then(() => {
				this.mfaWebAuth.checkSession({}, (err, result) => {
					if (err) {
						reject(err);
					} else {
						const { accessToken, expiresIn } = result;
						// save access token as this.mfaEnrollToken
						this.mfaManagementToken = accessToken;
						// mfa management token expiration handling
						if (expiresIn > 0) {
							setTimeout(() => {
								this.mfaManagementToken = '';
							}, Number(expiresIn) * 1000);
						}
						// resolve with the mfa management token
						resolve(this.mfaManagementToken);
					}
				});
			});
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
				this.webAuth.checkSession({}, (err, result) => {
					if (err) {
						this[setAuthData]();
						if (err.error === 'login_required' || err.error === 'unauthorized') {
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
	onError: () => {},
};

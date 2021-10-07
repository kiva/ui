import { differenceInMilliseconds } from 'date-fns';
import _get from 'lodash/get';
import _over from 'lodash/over';
import * as Sentry from '@sentry/vue';
import syncDate from './syncDate';
import logFormatter from './logFormatter';

const isServer = typeof window === 'undefined';
// only require auth0-js if we are not in a server environment
const auth0js = !isServer ? require('auth0-js') : null;

const SYNC_NAME = 'kvls';
const LOGOUT_VALUE = 'o';
const COOKIE_OPTIONS = { path: '/', secure: true };

// These symbols are unique, and therefore are private to this scope.
// For more details, see https://medium.com/@davidrhyswhite/private-members-in-es6-db1ccd6128a5
const errorCallbacks = Symbol('errorCallbacks');
const handleUnknownError = Symbol('handleUnknownError');
const loginPromise = Symbol('loginPromise');
const mfaTokenPromise = Symbol('mfaTokenPromise');
const popupAuthorize = Symbol('authorize');
const popupWindow = Symbol('popupWindow');
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
		this.isServer = isServer;
		this.cookieStore = cookieStore;
		if (!this.isServer) {
			// Setup Auth0 WebAuth client for authentication
			this.webAuth = new auth0js.WebAuth({
				audience,
				clientID,
				domain,
				redirectUri,
				responseType: 'token id_token',
				scope,
			});
			// Setup Auth0 WebAuth client for MFA management
			this.mfaWebAuth = new auth0js.WebAuth({
				audience: mfaAudience,
				clientID,
				domain,
				redirectUri,
				responseType: 'token',
				scope: 'enroll read:authenticators remove:authenticators',
			});
		}
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

	// Private method to handle popup authorization which can be called
	// recursively to deal with authorization errors
	[popupAuthorize](options, resolve) {
		const startTime = new Date();
		this[popupWindow] = this.webAuth.popup.authorize({
			popupOptions: {
				width: 480,
				height: 940,
			},
			...options
		}, (err, result) => {
			if (err) {
				// Handle unauthorized error by reattempting authentication with prompted login
				if (err.code === 'unauthorized') {
					return this[popupAuthorize]({
						...options,
						prompt: 'login',
					}, resolve);
				}
				// Otherwise log meaningful errors (ignores user closed popup error which does not have a code)
				if (err.code || err.name) {
					Sentry.withScope(scope => {
						scope.setTag('auth_method', 'popup authorize');
						Sentry.captureMessage(getErrorString(err));
					});
					this[handleUnknownError](err);
				} else if (differenceInMilliseconds(new Date(), startTime) < 100) {
					Sentry.captureMessage('Login window closed quickly. Popups may be blocked.');
				}
				// Popup login failed for some reason, so resolve without a result
				resolve();
			} else {
				// Successful authentication
				this[setAuthData](result);
				this.cookieStore.set('kvls', this.getKivaId(), { path: '/', secure: true });
				resolve(result);
			}
		});
	}

	// Return the kiva id for the current user (or undefined)
	getKivaId() {
		const kivaIdKey = 'https://www.kiva.org/kiva_id';
		return _get(this, `user["${kivaIdKey}"]`)
			|| _get(this, `user._json["${kivaIdKey}"]`);
	}

	// Return the last login timestamp for the current user (or 0)
	getLastLogin() {
		const lastLoginKey = 'https://www.kiva.org/last_login';
		return _get(this, `user["${lastLoginKey}"]`)
			|| _get(this, `user._json["${lastLoginKey}"]`)
			|| 0;
	}

	isMfaAuthenticated() {
		const usedMfaKey = 'https://www.kiva.org/used_mfa';
		return _get(this, `user["${usedMfaKey}"]`)
			|| _get(this, `user._json["${usedMfaKey}"]`)
			|| false;
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
			syncDate().then(() => {
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
			syncDate().then(() => {
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

	// Open a popup window to the login page
	popupLogin(authorizeOptions) {
		// only try this if in the browser
		if (this.isServer) {
			return Promise.reject(new Error('popupLogin called in server mode'));
		}

		// re-focus on the popup if it's already open
		if (this[popupWindow]) this[popupWindow].focus();

		// Ensure we only ask to login once at a time
		if (this[loginPromise]) return this[loginPromise];

		// Open up popup window to login
		this[loginPromise] = new Promise(resolve => {
			this[popupAuthorize](authorizeOptions, resolve);
		});

		// Once the promise completes, stop tracking it
		this[loginPromise].finally(() => {
			this[loginPromise] = null;
		});

		return this[loginPromise];
	}

	// Handle the auth0 callback in the popup frame
	popupCallback(options) {
		// only try this if in the browser
		if (this.isServer) {
			return Promise.reject(new Error('popupCallback called in server mode'));
		}
		this[popupWindow] = null;
		// Ensure browser clock is correct before verifying token
		return syncDate().then(() => {
			return this.webAuth.popup.callback(options);
		});
	}

	// Receive a callback to be called in case of an unknown error
	onError(callback) {
		this[errorCallbacks].push(callback);
	}

	// Call error callbacks with error information
	[handleUnknownError](error) {
		logFormatter(error, 'error');
		_over(this[errorCallbacks])({
			error,
			errorString: getErrorString(error),
			eventId: Sentry.lastEventId(),
			user: this.user,
		});
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
	getSyncCookieValue: () => null,
	isNotedLoggedIn: () => false,
	isNotedLoggedOut: () => false,
	isNotedUserSessionUser: () => true,
	checkSession: () => Promise.resolve({}),
	popupLogin: () => Promise.resolve({}),
	popupCallback: () => Promise.resolve({}),
	onError: () => {},
};

import { WebAuth } from 'auth0-js';
import { differenceInMilliseconds } from 'date-fns';
import _get from 'lodash/get';
import _over from 'lodash/over';
import Raven from 'raven-js';
import cookieStore from './cookieStore';

// These symbols are unique, and therefore are private to this scope.
// For more details, see https://medium.com/@davidrhyswhite/private-members-in-es6-db1ccd6128a5
const errorCallbacks = Symbol('errorCallbacks');
const handleUnknownError = Symbol('handleUnknownError');
const loginPromise = Symbol('loginPromise');
const popupAuthorize = Symbol('authorize');
const popupWindow = Symbol('popupWindow');
const sessionPromise = Symbol('sessionPromise');
const setAuthData = Symbol('setAuthData');

function getErrorString(err) {
	return `${err.error || err.code || err.name}: ${err.error_description || err.description}`;
}

// Class to handle interacting with auth0 in the browser
export default class KvAuth0 {
	constructor({
		accessToken = '',
		audience,
		clientID,
		domain,
		redirectUri,
		scope,
		user = null,
	}) {
		this[errorCallbacks] = [];
		this.enabled = true;
		this.user = user;
		this.accessToken = accessToken;
		this.isServer = typeof window === 'undefined';

		if (!this.isServer) {
			this.webAuth = new WebAuth({
				audience,
				clientID,
				domain,
				redirectUri,
				responseType: 'token id_token',
				scope,
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
					Raven.captureMessage(getErrorString(err), {
						tags: { auth_method: 'popup authorize' }
					});
					this[handleUnknownError](err);
				} else if (differenceInMilliseconds(new Date(), startTime) < 100) {
					Raven.captureMessage('Login window closed quickly. Popups may be blocked.');
				}
				// Popup login failed for some reason, so resolve without a result
				resolve();
			} else {
				// Successful authentication
				cookieStore.set('kvls', 'i', { path: '/', secure: true });
				this[setAuthData](result);
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

	// Silently check for a logged in session with auth0 using hidden iframes
	checkSession() {
		// only try this if in the browser
		if (this.isServer) {
			return Promise.reject(new Error('checkSession called in server mode'));
		}

		// Ensure that we only check the session once at a time
		if (this[sessionPromise]) return this[sessionPromise];

		// Check for an existing session
		this[sessionPromise] = new Promise(resolve => {
			this.webAuth.checkSession({}, (err, result) => {
				if (err) {
					this[setAuthData]();
					if (err.error === 'login_required' || err.error === 'unauthorized') {
						// User is not logged in, so continue without authentication
						resolve();
					} else if (err.error === 'consent_required' || err.error === 'interaction_required') {
						// These errors require interaction beyond what can be provided by webauth,
						// so resolve without authentication for now. Other possibility is to redirect
						// to login to complete authentication.
						Raven.captureMessage(`Auth session not started: ${getErrorString(err)}`, {
							level: 'warning',
						});
						resolve();
					} else {
						// Everything else, actually throw an error
						Raven.captureMessage(getErrorString(err), {
							tags: { auth_method: 'check session' }
						});
						this[handleUnknownError](err);
						resolve();
					}
				} else {
					// Successful authentication
					this[setAuthData](result);
					resolve();
				}
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
		return this.webAuth.popup.callback(options);
	}

	// Receive a callback to be called in case of an unknown error
	onError(callback) {
		this[errorCallbacks].push(callback);
	}

	// Call error callbacks with error information
	[handleUnknownError](error) {
		console.error(error);
		_over(this[errorCallbacks])({
			error,
			errorString: getErrorString(error),
			eventId: Raven.lastEventId(),
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
	checkSession: () => Promise.resolve({}),
	popupLogin: () => Promise.resolve({}),
	popupCallback: () => Promise.resolve({}),
	onError: () => {},
};

import cookieStore from './cookieStore';

// These symbols are unique, and therefore are private to this scope.
// For more details, see https://medium.com/@davidrhyswhite/private-members-in-es6-db1ccd6128a5
const loginPromise = Symbol('loginPromise');
const sessionPromise = Symbol('sessionPromise');
const setAuthData = Symbol('setAuthData');

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
		this.enabled = true;
		this.user = user;
		this.accessToken = accessToken;
		this.isServer = typeof window === 'undefined';

		if (!this.isServer) {
			// delay loading of webauth until we've confirmed we're in the browser,
			// as it complains about not having window
			this.webAuth = import('auth0-js').then(({ WebAuth }) => {
				return new WebAuth({
					audience,
					clientID,
					domain,
					redirectUri,
					responseType: 'token id_token',
					scope,
				});
			});
		}
	}

	[setAuthData]({ idTokenPayload, accessToken } = {}) {
		this.user = idTokenPayload || null;
		this.accessToken = accessToken || '';
		// handle expiration?
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
		this[sessionPromise] = this.webAuth.then(webAuth => new Promise((resolve, reject) => {
			webAuth.checkSession({}, (err, result) => {
				if (err) {
					this[setAuthData]();
					if (err.error === 'login_required') {
						// User is not logged in, so continue without authentication
						cookieStore.set('kvls', 'o', { secure: true });
						resolve();
					} else if (err.error === 'consent_required' || err.error === 'interaction_required') {
						// These errors require interaction beyond what can be provided by webauth,
						// so resolve without authentication for now. Other possibility is to redirect
						// to login to complete authentication.
						console.warn(`Auth session not started (${err.error_description})`);
						resolve();
					} else {
						// Everything else, actually throw an error
						reject(err);
					}
				} else {
					// Successful authentication
					this[setAuthData](result);
					resolve();
				}
			});
		}));

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

		// Ensure we only ask to login once at a time
		if (this[loginPromise]) return this[loginPromise];

		// Open up popup window to login
		this[loginPromise] = this.webAuth.then(webAuth => new Promise((resolve, reject) => {
			webAuth.popup.authorize({
				popupOptions: {
					width: 480,
					height: 740,
				},
				...authorizeOptions
			}, (err, result) => {
				if (err) {
					this[setAuthData]();
					reject(err);
				} else {
					// Successful authentication
					cookieStore.set('kvls', 'i', { secure: true });
					this[setAuthData](result);
					resolve(result);
				}
			});
		}));

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
		return this.webAuth.then(webAuth => webAuth.popup.callback(options));
	}
}

// Provide a mock class for testing and disabling auth0 usage
export const MockKvAuth0 = {
	enabled: false,
	user: {},
	accessToken: '',
	checkSession: () => Promise.resolve({}),
	popupLogin: () => Promise.resolve({}),
	popupCallback: () => Promise.resolve({}),
};

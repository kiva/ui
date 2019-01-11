// These symbols are unique, and therefore are private to this scope.
// For more details, see https://medium.com/@davidrhyswhite/private-members-in-es6-db1ccd6128a5
const assertBrowser = Symbol('assertBrowser');
const authCallback = Symbol('authCallback');
const loginPromise = Symbol('loginPromise');
const sessionPromise = Symbol('sessionPromise');

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

	// Default handler for the authentication result
	[authCallback](err, result) {
		return new Promise((resolve, reject) => {
			if (err) {
				switch (err.error) {
					case 'login_required':
					case 'consent_required':
					case 'interaction_required':
						// These errors require interaction beyond what can be provided by webauth,
						// so resolve quietly without authentication
						this.user = null;
						this.accessToken = '';
						console.log(`Auth session not started (${err.error_description})`);
						resolve();
						break;
					default:
						// Everything else, actually throw an error
						console.error(err);
						reject(err);
				}
			} else {
				// Successful authentication
				this.user = result.idTokenPayload;
				this.accessToken = result.accessToken;
				// handle expiration?
				resolve(result);
			}
		});
	}

	// Throw an error if this gets called while not in a browser
	[assertBrowser]() {
		if (this.isServer) return Promise.reject(new Error('Client auth called in server mode'));
	}

	// Silently check for a logged in session with auth0 using hidden iframes
	checkSession() {
		this[assertBrowser]();

		// Ensure that we only check the session once at a time
		if (this[sessionPromise]) return this[sessionPromise];

		this[sessionPromise] = this.webAuth.then(webAuth => new Promise((resolve, reject) => {
			webAuth.checkSession({}, (err, result) => {
				this[authCallback](err, result).then(resolve).catch(reject);
			});
		}));

		this[sessionPromise].finally(() => {
			this[sessionPromise] = null;
		});

		return this[sessionPromise];
	}

	// Open a popup window to the login page
	popupLogin() {
		this[assertBrowser]();

		// Ensure we only ask to login once at a time
		if (this[loginPromise]) return this[loginPromise];

		this[loginPromise] = this.webAuth.then(webAuth => new Promise((resolve, reject) => {
			webAuth.popup.authorize({
				popupOptions: {
					width: 480,
					height: 740,
				},
			}, (err, result) => {
				this[authCallback](err, result).then(resolve).catch(reject);
			});
		}));

		this[loginPromise].finally(() => {
			this[loginPromise] = null;
		});

		return this[loginPromise];
	}

	// Handle the auth0 callback in the popup frame
	popupCallback() {
		this[assertBrowser]();
		return this.webAuth.then(webAuth => webAuth.popup.callback());
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

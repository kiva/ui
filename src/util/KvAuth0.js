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

	authCallback(err, result) {
		return new Promise((resolve, reject) => {
			if (err) {
				switch (err.error) {
					case 'login_required':
					case 'consent_required':
					case 'interaction_required':
						this.user = null;
						this.accessToken = '';
						console.log(`Auth session not started (${err.error_description})`);
						resolve();
						break;
					default:
						console.error(err);
						reject(err);
				}
			} else {
				this.user = result.idTokenPayload;
				this.accessToken = result.accessToken;
				// handle expiration?
				resolve(result);
			}
		});
	}

	checkSession() {
		if (this.isServer) return Promise.reject(new Error('Client auth called in server mode'));
		return this.webAuth.then(webAuth => new Promise((resolve, reject) => {
			webAuth.checkSession({}, (err, result) => {
				this.authCallback(err, result).then(resolve).catch(reject);
			});
		}));
	}

	popupLogin() {
		if (this.isServer) return Promise.reject(new Error('Client auth called in server mode'));
		return this.webAuth.then(webAuth => new Promise((resolve, reject) => {
			webAuth.popup.authorize({
				popupOptions: {
					width: 480,
					height: 740,
				},
			}, (err, result) => {
				this.authCallback(err, result).then(resolve).catch(reject);
			});
		}));
	}

	popupCallback() {
		if (this.isServer) return Promise.reject(new Error('Client auth called in server mode'));
		return this.webAuth.then(webAuth => webAuth.popup.callback());
	}
}

export const MockKvAuth0 = {
	enabled: false,
	user: {},
	accessToken: '',
	checkSession: () => Promise.resolve({}),
	popupLogin: () => Promise.resolve({}),
	popupCallback: () => Promise.resolve({}),
};

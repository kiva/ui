export default class KvAuth0 {
	constructor({
		accessToken = '',
		clientID,
		domain,
		user = {},
	}) {
		this.user = user;
		this.accessToken = accessToken;
		this.isServer = typeof window === 'undefined';

		if (!this.isServer) {
			this.webAuth = import('auth0-js').then(({ WebAuth }) => {
				return new WebAuth({
					audience: 'https://api.dev.kivaws.org/graphql',
					clientID,
					domain,
					redirectUri: `${window.location.origin}/process-browser-auth`,
					responseType: 'token id_token',
					scope: 'https://www.kiva.org/last_login ' +
						'https://www.kiva.org/kiva_id ' +
						'https://www.kiva.org/context.connectionStrategy ' +
						'openid email profile',
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
						this.user = {};
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

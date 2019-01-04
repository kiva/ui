import { setContext } from 'apollo-link-context';
import { WebAuth } from 'auth0-js';

function getAuthContext({ headers, ...context }, user, token) {
	return {
		...context,
		user,
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : undefined,
		}
	};
}

export default options => {
	let token;
	let user;
	let fetching = 0;

	return setContext((operation, previousContext) => {
		if (options.user || user || fetching > 0) {
			user = options.user || user;
			token = options.token || token;
			console.log('Using cached auth info');
			return getAuthContext(previousContext, user, token);
		}

		return new Promise((resolve, reject) => {
			try {
				fetching += 1;
				const webAuth = new WebAuth({
					domain: options.domain,
					clientID: options.clientID,
				});
				webAuth.checkSession({
					redirectUri: `${window.location.origin}/process-browser-auth`,
					responseType: 'token id_token',
				}, (err, result) => {
					fetching -= 1;
					if (err) {
						switch (err.error) {
							case 'login_required':
							case 'consent_required':
							case 'interaction_required':
								user = {};
								console.log(`Auth session not started (${err.error_description})`);
								resolve(getAuthContext(previousContext, user));
								break;
							default:
								console.error(err);
								reject(err);
						}
					} else {
						console.log(result);
						token = result.accessToken;
						user = result.idTokenPayload;
						resolve(getAuthContext(previousContext, user, token));
					}
				});
			} catch (e) {
				console.error(e);
			}
		});
	});
};

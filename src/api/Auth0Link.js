import { setContext } from '@apollo/client/link/context/index';

// Add the user info to the context and add the access token to the authorization header
function getAuthContext(context, user, token) {
	context.user = user;
	if (token) {
		context.headers = {
			...context.headers,
			authorization: `Bearer ${token}`
		};
	}
	return context;
}

export default ({ kvAuth0 }) => {
	return setContext((operation, previousContext) => {
		// If auth0 is not enabled, don't add anything to the context
		if (!kvAuth0.enabled) return getAuthContext(previousContext);

		// If using fake authentication, just add fake auth headers to the context
		try {
			const fakeAuthInfo = kvAuth0.getFakeAuthCookieValue();
			if (fakeAuthInfo && kvAuth0.fakeAuthAllowed()) {
				return {
					...previousContext,
					headers: {
						...previousContext.headers,
						'x-fa-user-id': fakeAuthInfo.userId,
						'x-fa-scopes': fakeAuthInfo.scopes.join(' '),
						'x-fa-app-id': kvAuth0.clientID || 'org.kiva.www',
					}
				};
			}
		} catch (e) {
			console.error(e);
		}

		// If we already have user info, and we don't need to check login, just add that to the context
		if (kvAuth0.getKivaId() && !kvAuth0.getSyncCookieValue()) {
			return getAuthContext(previousContext, kvAuth0.user, kvAuth0.accessToken);
		}

		// If user is supposed to be logged out, don't add anything to the context
		if (kvAuth0.isNotedLoggedOut()) {
			return getAuthContext(previousContext);
		}

		// If the user's kiva id matches the id stored in the login sync cookie, add the user to the context
		if (kvAuth0.getKivaId() && kvAuth0.isNotedUserSessionUser()) {
			return getAuthContext(previousContext, kvAuth0.user, kvAuth0.accessToken);
		}

		// Return previousContext if on a server process before checkSession block
		if (kvAuth0.isServer) return getAuthContext(previousContext);

		// Return previousContext if on a denied page
		const deniedPathList = [
			'/error',
			'/register/social',
		];
		if (deniedPathList.indexOf(window.location.pathname) > -1) {
			return getAuthContext(previousContext);
		}

		// Otherwise, check to see if the user has a session on Auth0 and then add that info to the context
		return new Promise((resolve, reject) => {
			kvAuth0.checkSession().then(() => {
				resolve(getAuthContext(previousContext, kvAuth0.user, kvAuth0.accessToken));
			}).catch(reject);
		});
	});
};

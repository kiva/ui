import { setContext } from 'apollo-link-context';
import _set from 'lodash/set';
import cookieStore from '@/util/cookieStore';

// Add the user info to the context and add the access token to the authorization header
function getAuthContext(context, user, token) {
	_set(context, 'user', user);
	if (token) {
		_set(context, 'headers.authorization', `Bearer ${token}`);
	}
	return context;
}

export default kvAuth0 => {
	return setContext((operation, previousContext) => {
		// If auth0 is not enabled, don't add anything to the context
		if (!kvAuth0.enabled) return getAuthContext(previousContext);

		const loginSyncValue = cookieStore.get('kvls');

		// If we already have user info, and we don't need to check login, just add that to the context
		if (kvAuth0.user && !loginSyncValue) {
			return getAuthContext(previousContext, kvAuth0.user, kvAuth0.accessToken);
		}

		// If user is supposed to be logged out, don't add anything to the context
		if (kvAuth0.user && loginSyncValue === 'o') {
			return getAuthContext(previousContext);
		}

		// If the user's kiva id matches the id stored in the login sync cookie, add the user to the context
		if (kvAuth0.user && String(kvAuth0.getKivaId()) === String(loginSyncValue)) {
			return getAuthContext(previousContext, kvAuth0.user, kvAuth0.accessToken);
		}

		// Otherwise, check to see if the user has a session on Auth0 and then add that info to the context
		return new Promise((resolve, reject) => {
			kvAuth0.checkSession().then(() => {
				resolve(getAuthContext(previousContext, kvAuth0.user, kvAuth0.accessToken));
			}).catch(reject);
		});
	});
};

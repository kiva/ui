import { setContext } from 'apollo-link-context';
import _set from 'lodash/set';

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

		// If we already have user info, just add that to the context
		if (kvAuth0.user) {
			return getAuthContext(previousContext, kvAuth0.user, kvAuth0.accessToken);
		}

		// Check to see if the user is authenticated and then add that info to the context
		return new Promise((resolve, reject) => {
			kvAuth0.checkSession().then(() => {
				resolve(getAuthContext(previousContext, kvAuth0.user, kvAuth0.accessToken));
			}).catch(reject);
		});
	});
};

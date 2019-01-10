import { setContext } from 'apollo-link-context';
import _set from 'lodash/set';

function getAuthContext(context, user, token) {
	_set(context, 'user', user);
	if (token) {
		_set(context, 'headers.authorization', `Bearer ${token}`);
	}
	return context;
}

export default kvAuth0 => {
	let fetching = 0;

	return setContext((operation, previousContext) => {
		if (kvAuth0.user || fetching > 0) {
			return getAuthContext(previousContext, kvAuth0.user, kvAuth0.accessToken);
		}

		return new Promise((resolve, reject) => {
			fetching += 1;
			kvAuth0.checkSession().then(() => {
				fetching -= 1;
				resolve(getAuthContext(previousContext, kvAuth0.user, kvAuth0.accessToken));
			}).catch(e => {
				fetching -= 1;
				reject(e);
			});
		});
	});
};

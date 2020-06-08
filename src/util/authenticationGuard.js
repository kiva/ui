import _get from 'lodash/get';
import authenticationQuery from '@/graphql/query/authenticationQuery.graphql';

// eslint-disable-next-line import/prefer-default-export
export function authenticationGuard({ route, apolloClient, kvAuth0 }) {
	return new Promise((resolve, reject) => {
		// Authentication
		if (route.matched.some(matchedRoute => matchedRoute.meta.activeLoginRequired)) {
			// Route requires active login
			return apolloClient.query({
				query: authenticationQuery
			}).then(({ errors, data }) => {
				console.log('data', data);
				const lastLogin = _get(data, 'my.lastLoginTimestamp', 0);
				const duration = 1000 * (parseInt(_get(data, 'general.activeLoginDuration.value'), 10) || 3600);
				if (errors) {
					const arrayOfErrorCodes = errors.map(error => error.code);
					console.log(arrayOfErrorCodes);
					throw new Error('api.authenticationRequired');
				}
				if (kvAuth0.getKivaId() && Date.now() > lastLogin + duration) {
					throw new Error('activeLoginRequired');
				}
				resolve();
			}).catch(e => {
				console.log('catch block', e.message);
				if (e.message.indexOf('activeLoginRequired') > -1) {
					// Force a login when active login is required
					reject({
						path: '/ui-login',
						query: { force: true, doneUrl: route.path }
					});
				}

				if (e.message.indexOf('api.authenticationRequired') > -1) {
					// Redirect to login upon authentication error
					reject({
						path: '/ui-login',
						query: { doneUrl: route.path }
					});
				}
				// Log other errors
				console.error(e);
				// catch all redirect to login
				reject({
					path: '/ui-login',
					query: { doneUrl: route.path }
				});
			});
			// eslint-disable-next-line brace-style
		} if (route.matched.some(matchedRoute => matchedRoute.meta.authenticationRequired)) {
			// Route requires authentication
			return apolloClient.query({
				query: authenticationQuery
			}).then(() => {
				resolve();
			}).catch(e => {
				if (e.message.indexOf('api.authenticationRequired') > -1) {
					// Redirect to login upon authentication error
					reject({
						path: '/ui-login',
						query: { doneUrl: route.path }
					});
				} else {
					// Log other errors
					console.error(e);
					// catch all redirect to login
					reject({
						path: '/ui-login',
						query: { doneUrl: route.path }
					});
				}
			});
		}
		// Route does not require login or active login
		resolve();
	});
}

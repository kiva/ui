import _get from 'lodash/get';
import * as Sentry from '@sentry/browser';
import authenticationQuery from '@/graphql/query/authenticationQuery.graphql';

const isServer = typeof window === 'undefined';

const processErrors = (error, route) => {
	if (error.message.indexOf('activeLoginRequired') > -1) {
		// Force a login when active login is required
		return {
			path: '/ui-login',
			query: { force: true, doneUrl: route.path }
		};
	}

	if (error.message.indexOf('api.authenticationRequired') > -1) {
		// Redirect to login upon authentication error
		return {
			path: '/ui-login',
			query: { doneUrl: route.path }
		};
	}
	// Log other errors to Sentry
	if (!isServer) {
		Sentry.withScope(scope => {
			scope.setTag('authentication_guard', 'unknown error');
			Sentry.captureMessage(error);
		});
	}
	// catch all redirect to login
	return {
		path: '/ui-login',
		query: { doneUrl: route.path }
	};
};

// Given a route definition meta property, authenticationGuard will determine
// if a user has the right kind of login required to visit the route
// and return a resolved promise if the user has the right permissions
// to visit route or a rejection with the appropriate redirect params
// The two possible meta properties are activeLoginRequired, and authenticationRequired
// activeLoginRequired takes priority since it implies authenticationRequired
// eslint-disable-next-line import/prefer-default-export
export function authenticationGuard({ route, apolloClient, kvAuth0 }) {
	return new Promise((resolve, reject) => {
		// Route requires active login
		if (route.matched.some(matchedRoute => matchedRoute.meta.activeLoginRequired)) {
			return apolloClient.query({
				query: authenticationQuery
			}).then(({ data }) => {
				if (!data.my) {
					throw new Error('api.authenticationRequired');
				}
				const lastLogin = _get(data, 'my.lastLoginTimestamp', 0);
				const duration = 1000 * (parseInt(_get(data, 'general.activeLoginDuration.value'), 10) || 3600);
				if (kvAuth0.getKivaId() && Date.now() > lastLogin + duration) {
					throw new Error('activeLoginRequired');
				}
				resolve();
			}).catch(e => {
				reject(processErrors(e, route));
			});
		}
		// Route requires authentication
		if (route.matched.some(matchedRoute => matchedRoute.meta.authenticationRequired)) {
			return apolloClient.query({
				query: authenticationQuery
			}).then(({ data }) => {
				if (!data.my) {
					throw new Error('api.authenticationRequired');
				}
				resolve();
			}).catch(e => {
				reject(processErrors(e, route));
			});
		}
		// Route does not require login or active login
		resolve();
	});
}

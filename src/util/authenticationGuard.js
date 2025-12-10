import * as Sentry from '@sentry/vue';
import authenticationQuery from '#src/graphql/query/authenticationQuery.graphql';
import logFormatter from './logFormatter';

const isServer = typeof window === 'undefined';

// Return true if user logged in recently enough and false otherwise
export function checkLastLoginTime(data, durationKey, defaultDuration) {
	const lastLogin = data?.my?.lastLoginTimestamp ?? 0;
	const durationKeyValue = data?.general?.[durationKey]?.value;
	const duration = 1000 * (parseInt(durationKeyValue, 10) || defaultDuration);

	if (Date.now() > lastLogin + duration) {
		return false;
	}
	return true;
}

const processErrors = (error, route) => {
	const doneUrl = route.fullPath || '';
	if (error.message.indexOf('activeLoginRequired') > -1 || error.message.indexOf('recentLoginRequired') > -1) {
		// Force a login when active/recent login is required
		return {
			path: '/ui-login',
			query: { force: true, doneUrl }
		};
	}

	if (error.message.indexOf('api.authenticationRequired') > -1) {
		// Redirect to login upon authentication error
		return {
			path: '/ui-login',
			query: { doneUrl }
		};
	}

	if (error.message.indexOf('verificationRequired') > -1) {
		const lastMatchedRoute = route.matched[route.matched.length - 1];
		// Redirect to email verification page
		return {
			path: '/start-verification',
			query: {
				doneUrl,
				process: lastMatchedRoute.meta.process || '',
			}
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
		query: { doneUrl }
	};
};

// Given a route definition meta property, authenticationGuard will determine
// if a user has the right kind of login required to visit the route
// and return a resolved promise if the user has the right permissions
// to visit route or a rejection with the appropriate redirect params
// The two possible meta properties are activeLoginRequired, and authenticationRequired
// activeLoginRequired takes priority over authenticationRequired since it implies authenticationRequired
// and recentLoginRequired takes priority over activeLoginRequired since it implies activeLoginRequired

export function authenticationGuard({ route, apolloClient, kvAuth0 }) {
	// Skip authentication checks if Auth0 usage is not enabled
	if (!kvAuth0.enabled) {
		return Promise.resolve();
	}
	return new Promise((resolve, reject) => {
		const activeRequired = route.matched.some(matchedRoute => matchedRoute.meta.activeLoginRequired);
		const authRequired = route.matched.some(matchedRoute => matchedRoute.meta.authenticationRequired);
		const mfaRequired = route.matched.some(matchedRoute => matchedRoute.meta.mfaRequired);
		const recentRequired = route.matched.some(matchedRoute => matchedRoute.meta.recentLoginRequired);

		// Route requires some sort of authentication
		if (activeRequired || authRequired || mfaRequired || recentRequired) {
			apolloClient.query({
				query: authenticationQuery,
				fetchPolicy: 'network-only',
			}).then(({ data }) => {
				if (!data.my) {
					throw new Error('api.authenticationRequired');
				}
				// Check if the user ID from the GraphQL response matches the Auth0 session user ID
				const graphqlUserId = data.my.id;
				const auth0UserId = kvAuth0.getKivaId();
				const auth0UserIdIsValid = auth0UserId || !kvAuth0.accessTokenExpired;
				if (graphqlUserId && auth0UserIdIsValid && String(graphqlUserId) !== String(auth0UserId)) {
					// eslint-disable-next-line max-len
					const errorMessage = `User ID mismatch: GraphQL user ID (${graphqlUserId}) does not match Auth0 user ID (${auth0UserId})`;
					logFormatter(errorMessage, 'error', { authentication_guard: 'user_id_mismatch' });
					if (!isServer) {
						Sentry.withScope(scope => {
							scope.setTag('authentication_guard', 'user_id_mismatch');
							Sentry.captureMessage(errorMessage);
						});
					}
				}
				// Route requires active login
				if (activeRequired && !checkLastLoginTime(data, 'activeLoginDuration', 3600)) {
					throw new Error('activeLoginRequired');
				}
				// Route requires recent login
				if (recentRequired && !checkLastLoginTime(data, 'recentLoginDuration', 300)) {
					throw new Error('recentLoginRequired');
				}
				// Route requires multi factor authentication or email verification
				if (mfaRequired && !kvAuth0.isMfaAuthenticated() && !data?.my?.emailVerifiedRecently) {
					throw new Error('verificationRequired');
				}
				resolve();
			}).catch(e => {
				reject(processErrors(e, route));
			});
		} else {
			// Route does not require any authentication
			resolve();
		}
	});
}

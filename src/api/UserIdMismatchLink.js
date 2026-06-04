import * as Sentry from '@sentry/vue';
import { ApolloLink } from '@apollo/client/core/index';
import logFormatter from '#src/util/logFormatter';

const isServer = typeof window === 'undefined';

// Afterware link that detects user-id mismatches on any operation whose
// response includes `my.id`, comparing it to the authenticated Auth0 identity.
export default ({ kvAuth0 }) => {
	return new ApolloLink((operation, forward) => forward(operation).map(response => {
		try {
			const graphqlUserId = response?.data?.my?.id;
			// Nothing to compare against unless the response carries a user id
			if (graphqlUserId) {
				const auth0UserId = kvAuth0?.getKivaId();
				// Skip anonymous users and expired tokens
				const auth0UserIdIsValid = auth0UserId || !kvAuth0?.accessTokenExpired;
				if (auth0UserIdIsValid && String(graphqlUserId) !== String(auth0UserId)) {
					const { operationName } = operation;
					// eslint-disable-next-line max-len
					const errorMessage = `User ID mismatch: GraphQL user ID (${graphqlUserId}) does not match Auth0 user ID (${auth0UserId})`;
					logFormatter(errorMessage, 'error', {
						operationName,
						graphqlUserId,
						auth0UserId,
						// Deprecated tag, retained so existing alerts keep firing
						authentication_guard: 'user_id_mismatch',
						// New, source-agnostic tag
						data_integrity: 'user_id_mismatch',
					});
					if (!isServer) {
						Sentry.withScope(scope => {
							scope.setTag('authentication_guard', 'user_id_mismatch');
							scope.setTag('data_integrity', 'user_id_mismatch');
							scope.setContext('user_id_mismatch', { operationName, graphqlUserId, auth0UserId });
							Sentry.captureMessage(errorMessage);
						});
					}
				}
			}
		} catch (e) {
			// Catch everything and return the response unmodified, to avoid
			// breaking the app in case of unexpected errors in the link logic
		}
		return response;
	}));
};

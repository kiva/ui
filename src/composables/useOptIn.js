import logReadQueryError from '#src/util/logReadQueryError';
import { gql } from 'graphql-tag';

// eslint-disable-next-line no-unused-vars
export default (apollo, _cookieStore) => {
	/**
	 * Whether a communication settings mutation applied.
	 *
	 * Both mutations return a nullable Boolean, so only an explicit true confirms that the
	 * settings were applied. False, null, a missing payload, or GraphQL errors are failures.
	 *
	 * @param {Boolean|null|undefined} result The mutation's payload
	 * @param {Array} errors
	 * @returns {Boolean} Whether the settings applied
	 */
	const applied = (result, errors) => !errors?.length && result === true;

	const updateCommunicationSettings = async (lenderNews, loanUpdates, globalUnsubscribed) => {
		try {
			const { data, errors } = await apollo.mutate({
				mutation: gql`
					mutation updateCommunicationSettings(
						$lenderNews: Boolean
						$loanUpdates: Boolean
						$globalUnsubscribed: Boolean
					) {
						my {
							updateCommunicationSettings(
								communicationSettings: {
									lenderNews: $lenderNews
									loanUpdates: $loanUpdates
									globalUnsubscribed: $globalUnsubscribed
								}
							)
						}
					}
				`,
				variables: {
					lenderNews,
					loanUpdates,
					globalUnsubscribed,
				},
			});
			return applied(data?.my?.updateCommunicationSettings, errors);
		} catch (error) {
			logReadQueryError(error, 'OptInModule updateCommunicationSettings');
			return false;
		}
	};

	const updateVisitorEmailOptIn = async (lenderNews, loanUpdates, globalUnsubscribed, visitorId) => {
		try {
			const { data, errors } = await apollo.mutate({
				mutation: gql`
				mutation updateVisitorCommunicationSettings(
					$lenderNews: Boolean,
					$loanUpdates: Boolean,
					$globalUnsubscribed: Boolean,
					$visitorId: String!
				) {
					visitorEmailOptIn {
						updateCommunicationSettings(
							communicationSettings: {
								lenderNews: $lenderNews
								loanUpdates: $loanUpdates
								globalUnsubscribed: $globalUnsubscribed
							},
							visitorId: $visitorId
						)
					}
				}
			`,
				variables: {
					lenderNews,
					loanUpdates,
					globalUnsubscribed,
					visitorId,
				},
			});
			return applied(data?.visitorEmailOptIn?.updateCommunicationSettings, errors);
		} catch (error) {
			logReadQueryError(error, 'OptInModule updateVisitorCommunicationSettings');
			return false;
		}
	};

	return {
		updateCommunicationSettings,
		updateVisitorEmailOptIn,
	};
};

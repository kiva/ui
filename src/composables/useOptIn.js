import logReadQueryError from '#src/util/logReadQueryError';
import { META_EVENTS, trackMetaEvent } from '@kiva/kv-analytics';
import { gql } from 'graphql-tag';

// eslint-disable-next-line no-unused-vars
export default (apollo, _cookieStore) => {
	/**
	 * Whether a communication settings mutation applied, reporting the sign-up when it did.
	 *
	 * Both mutations return a nullable Boolean, so only an explicit true confirms that the
	 * settings were applied. False, null, a missing payload, or GraphQL errors are failures.
	 *
	 * Opt-outs and unsubscribes run through the same mutations, so the values are checked
	 * rather than assuming any successful call here is a sign-up.
	 *
	 * @param {Boolean|null|undefined} result The mutation's payload
	 * @param {Array} errors
	 * @param {Boolean} lenderNews
	 * @param {Boolean} globalUnsubscribed
	 * @returns {Boolean} Whether the settings applied
	 */
	const reportOutcome = (result, errors, lenderNews, globalUnsubscribed) => {
		const updated = !errors?.length && result === true;
		if (updated && lenderNews === true && !globalUnsubscribed) {
			trackMetaEvent(META_EVENTS.EMAIL_SIGN_UP);
		}
		return updated;
	};

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
			return reportOutcome(
				data?.my?.updateCommunicationSettings,
				errors,
				lenderNews,
				globalUnsubscribed,
			);
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
			return reportOutcome(
				data?.visitorEmailOptIn?.updateCommunicationSettings,
				errors,
				lenderNews,
				globalUnsubscribed,
			);
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

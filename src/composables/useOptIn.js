import logReadQueryError from '#src/util/logReadQueryError';
import { META_EVENTS, trackMetaEvent } from '#src/util/metaEvents';
import { gql } from 'graphql-tag';

// eslint-disable-next-line no-unused-vars
export default (apollo, _cookieStore) => {
	/**
	 * Opt-outs and unsubscribes run through the same mutations as opt-ins, so the values
	 * are checked rather than assuming any call here is a sign-up.
	 *
	 * @param {Boolean} lenderNews
	 * @param {Boolean} globalUnsubscribed
	 */
	const trackEmailSignUp = (lenderNews, globalUnsubscribed) => {
		if (lenderNews === true && !globalUnsubscribed) {
			trackMetaEvent(META_EVENTS.EMAIL_SIGN_UP);
		}
	};

	/**
	 * Whether a communication settings mutation applied.
	 *
	 * Both mutations return a nullable Boolean, so only an explicit true confirms that the
	 * settings were applied. False, null, a missing payload, or GraphQL errors are failures.
	 *
	 * @param {Boolean|null|undefined} result The mutation's payload
	 * @param {Array} errors
	 * @returns {Boolean}
	 */
	const settingsApplied = (result, errors) => !errors?.length && result === true;

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
			const updated = settingsApplied(data?.my?.updateCommunicationSettings, errors);
			if (updated) {
				trackEmailSignUp(lenderNews, globalUnsubscribed);
			}
			return updated;
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
			const updated = settingsApplied(data?.visitorEmailOptIn?.updateCommunicationSettings, errors);
			if (updated) {
				trackEmailSignUp(lenderNews, globalUnsubscribed);
			}
			return updated;
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

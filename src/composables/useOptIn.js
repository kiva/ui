import logReadQueryError from '#src/util/logReadQueryError';
import { gql } from 'graphql-tag';

export default apollo => {
	const updateCommunicationSettings = async (lenderNews, loanUpdates, globalUnsubscribed) => {
		try {
			await apollo.mutate({
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
			return true;
		} catch (error) {
			logReadQueryError(error, 'OptInModule updateCommunicationSettings');
			return false;
		}
	};

	const updateVisitorEmailOptIn = async (lenderNews, loanUpdates, globalUnsubscribed, visitorId) => {
		try {
			await apollo.mutate({
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
		} catch (error) {
			logReadQueryError(error, 'OptInModule updateVisitorCommunicationSettings');
		}
	};

	return {
		updateCommunicationSettings,
		updateVisitorEmailOptIn,
	};
};

import logReadQueryError from '#src/util/logReadQueryError';
import { gql } from 'graphql-tag';

export const MAIL_UPDATES_OPT_COOKIE_NAME = 'kvemailopt';

export default (apollo, cookieStore) => {
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

	const userHasMailUpdatesOptOut = () => {
		let mailsUpdatesOptOut = false;
		const value = cookieStore.get(MAIL_UPDATES_OPT_COOKIE_NAME)?.trim();
		if (/(\b|&)true(\b|&)/.test(value)) {
			mailsUpdatesOptOut = true;
		}

		return mailsUpdatesOptOut;
	};

	const setMailUpdatesOptOutCookie = (optedOut, loanId = null) => {
		let newValue = '';
		const currentValue = cookieStore.get(MAIL_UPDATES_OPT_COOKIE_NAME)?.trim() || '';
		if (optedOut) {
			newValue = `true${loanId ? `|${loanId}` : ''}`;
		} else {
			newValue = currentValue.replace(/&?true(?:\|[^&]*)?/g, '');
			newValue = newValue.replace(/^&+/, '').replace(/&+/g, '&');
		}
		cookieStore.set(
			MAIL_UPDATES_OPT_COOKIE_NAME,
			newValue,
			{ expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) }
		);
	};

	return {
		setMailUpdatesOptOutCookie,
		updateCommunicationSettings,
		updateVisitorEmailOptIn,
		userHasMailUpdatesOptOut,
	};
};

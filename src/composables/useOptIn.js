import CookieStore from '#src/util/cookieStore';
import logReadQueryError from '#src/util/logReadQueryError';
import { gql } from 'graphql-tag';

export default apollo => {
	const cookieStore = new CookieStore();
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
		const value = cookieStore.get('kvgdpr')?.trim();
		if (/(\b|&)mails_opted_out=true(\b|&)/.test(value)) {
			mailsUpdatesOptOut = true;
		}

		return mailsUpdatesOptOut;
	};

	const setMailUpdatesOptOutCookie = (optedOut, loanId = null) => {
		let newValue = '';
		const currentValue = cookieStore.get('kvgdpr')?.trim() || '';
		if (optedOut) {
			newValue = `${currentValue !== '' ? '&' : ''}mails_opted_out=true${loanId ? `|${loanId}` : ''}`;
		} else {
			// Remove pattern &mails_opted_out=true|${LOAN_ID} from currentValue
			// pattern could be: &mails_opted_out=true|123, mails_opted_out=true|123,
			// 	&mails_opted_out=true o mails_opted_out=true
			newValue = currentValue.replace(/&?mails_opted_out=true(?:\|[^&]*)?/g, '');
			// remove '&' duplicates or at the start or at the end
			newValue = newValue.replace(/^&+/, '').replace(/&+/g, '&');
		}
		cookieStore.set(
			'kvgdpr',
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

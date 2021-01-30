import trackTransactionMutation from '@/graphql/mutation/shop/trackTransaction.graphql';
import parseGACookie from '@/util/parseGACookie';
import parseSPCookie from '@/util/parseSPCookie';

export default function trackTransactionEvent(transactionId, apolloClient, cookies) {
	if (!transactionId) {
		// exit if missing transaction id
		return false;
	}

	// get tracking data from google analytics cookie
	const {
		campaign,
		campaignContent,
		gclid,
		medium,
		source,
	} = parseGACookie(cookies);

	// get tracking data from snowplow cookie
	const { snowplowUserId, snowplowSessionId } = parseSPCookie(cookies);

	// track the transaction event
	apolloClient.mutate({
		mutation: trackTransactionMutation,
		variables: {
			campaign,
			campaignContent,
			medium,
			snowplowSessionId,
			snowplowUserId,
			source: gclid ? 'google-cpc' : source,
			transactionId,
		},
	})
		// return statuc
		.then(() => true)
		.catch(() => false);
}

<script>
import trackTransactionMutation from '@/graphql/mutation/shop/trackTransaction.graphql';
import parseGACookie from '@/util/parseGACookie';
import parseSPCookie from '@/util/parseSPCookie';

export default {
	render(h) {
		return h('div');
	},
	inject: ['apollo'],
	apollo: {
		preFetch({ route }, client) {
			return new Promise((resolve, reject) => {
				if (typeof window !== 'undefined') {
					// force server load if currently on a browser client
					window.location = route.fullPath;
				} else {
					const transactionId = route.query.kiva_transaction_id;
					if (!transactionId) {
						// redirect to thanks page if no transaction id was provided
						reject({ path: '/checkout/thanks' });
					} else {
						// get tracking data from google analytics cookie
						const {
							campaign,
							campaignContent,
							gclid,
							medium,
							source,
						} = parseGACookie();

						// get tracking data from snowplow cookie
						const { snowplowUserId, snowplowSessionId } = parseSPCookie();

						// build route for thanks page redirect
						const successRoute = {
							path: '/checkout/thanks',
							query: { kiva_transaction_id: transactionId },
						};

						// track the transaction event
						client.mutate({
							mutation: trackTransactionMutation,
							variables: {
								campaign,
								campaignContent,
								medium,
								snowplowSessionId,
								snowplowUserId,
								source: gclid || route.query.gclid ? 'google-cpc' : source,
								transactionId,
							},
						})
							// whether it succeeded or failed, redirect to the thanks page with the transaction id
							.then(() => reject(successRoute))
							.catch(() => reject(successRoute));
					}
				}
			});
		},
	},
};
</script>

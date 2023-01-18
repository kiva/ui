<script>
import numeral from 'numeral';
import trackTransactionMutation from '@/graphql/mutation/shop/trackTransaction.graphql';
import parseGACookie from '@/util/parseGACookie';
import parseSPCookie from '@/util/parseSPCookie';

export default {
	name: 'PostPurchase',
	render(h) {
		return h('div');
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		preFetch(config, client, { cookieStore, route }) {
			return new Promise((resolve, reject) => {
				if (typeof window !== 'undefined') {
					// force server load if currently on a browser client
					window.location = route.fullPath;
				} else {
					const transactionId = numeral(route.query.kiva_transaction_id).value();
					if (!transactionId) {
						// redirect to thanks page if no transaction id was provided
						// currently resolves to portfolio via ThanksView getCheckoutId method
						reject({ path: '/thanks' });
					} else {
						// get tracking data from google analytics cookie
						const {
							campaign,
							campaignContent,
							gclid,
							medium,
							source,
						} = parseGACookie(cookieStore);

						// get tracking data from snowplow cookie
						const { snowplowUserId, snowplowSessionId } = parseSPCookie(cookieStore);

						const successPath = '/thanks';

						// build route for thanks page redirect
						const successRoute = {
							path: successPath,
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
								visitorId: cookieStore.get('uiv') || null
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

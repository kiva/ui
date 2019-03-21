import _get from 'lodash/get';
import basketAddInterstitial from '@/graphql/query/basketAddInterstitialClient.graphql';
import updateAddToBasketInterstitial from '@/graphql/mutation/updateAddToBasketInterstitial.graphql';

export default {
	inject: ['apollo'],
	data() {
		return {
			basketInterstitialState: {}
		};
	},
	computed: {
		basketInterstitialActive() {
			return this.basketInterstitialState.active || false;
		}
	},
	methods: {
		// update basket insterstitial state with visible + loanId properties
		triggerAddToBasketInterstitial(loanId) {
			if (this.basketInterstitialActive) {
				this.apollo.mutate({
					mutation: updateAddToBasketInterstitial,
					variables: {
						active: this.basketInterstitialActive,
						visible: true,
						loanId: loanId || 0
					}
				});
			}
		}
	},
	mounted() {
		// determine if add to basket interstitial is active
		this.apollo.watchQuery({ query: basketAddInterstitial }).subscribe({
			next: ({ data }) => {
				this.basketInterstitialState = _get(data, 'basketAddInterstitial');
			},
		});
	},
};

import _get from 'lodash/get';
import basketAddInterstitial from '#src/graphql/query/basketAddInterstitialClient.graphql';
import updateAddToBasketInterstitial from '#src/graphql/mutation/updateAddToBasketInterstitial.graphql';
import checkInjections from '#src/util/injectionCheck';

const injections = ['apollo'];

export default {
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
				checkInjections(this, injections);

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
		checkInjections(this, injections);

		// determine if add to basket interstitial is active
		this.apollo.watchQuery({ query: basketAddInterstitial }).subscribe({
			next: ({ data }) => {
				const interstitialState = _get(data, 'basketAddInterstitial');

				this.basketInterstitialState = {
					...this.basketInterstitialState,
					active: interstitialState.active,
					visible: interstitialState.visible,
					loanId: interstitialState.loanId,
				};
			},
		});
	},
};

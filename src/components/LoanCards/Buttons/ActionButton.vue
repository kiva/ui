<template>
	<component
		:is="currentButtonState"
		:disable-redirects="disableRedirects"
		:loan-id="loanId"
		:loan="loan"
		:minimal-checkout-button="minimalCheckoutButton"
		@add-to-basket="handleAddToBasketEvent"
	/>
</template>

<script>
import gql from 'graphql-tag';
import store2 from 'store2';
import _includes from 'lodash/includes';
import _get from 'lodash/get';
import addToBasketInsterstitial from '@/plugins/add-to-basket-show-interstitial';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import Lend25Button from './Lend25Button';
import LendIncrementButton from './LendIncrementButton';
import CheckoutNowButton from './CheckoutNowButton';
import LendAgainButton from './LendAgainButton';
import LoanFundedText from './LoanFundedText';
import LoanSelectedText from './LoanSelectedText';
import LoanExpiredText from './LoanExpiredText';

const freeCreditBasketCountQuery = gql`query hasFreeCreditsAndBasketCount($basketId: String) {
	shop (basketId: $basketId) {
		id
		nonTrivialItemCount
		basket {
			id
			hasFreeCredits
		}
	}
}`;

export default {
	mixins: [
		addToBasketInsterstitial
	],
	inject: ['apollo'],
	props: {
		disableRedirects: {
			type: Boolean,
			default: false,
		},
		loan: {
			type: Object,
			default: () => {}
		},
		loanId: {
			type: Number,
			default: null
		},
		itemsInBasket: {
			type: Array,
			default: () => []
		},
		isLentTo: {
			type: Boolean,
			default: false
		},
		isFunded: {
			type: Boolean,
			default: false
		},
		isSelectedByAnother: {
			type: Boolean,
			default: false
		},
		isExpired: {
			type: Boolean,
			default: false,
		},
		isSimpleLendButton: {
			type: Boolean,
			default: false
		},
		minimalCheckoutButton: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			addToBasketRedirectExperimentShown: false,
			userPrefContinueBrowsing: false,
		};
	},
	computed: {
		currentButtonState() {
			if (this.isFunded) {
				return LoanFundedText;
			}
			if (this.isExpired) {
				return LoanExpiredText;
			}
			if (_includes(this.itemsInBasket, this.loanId)) {
				return CheckoutNowButton;
			}
			if (this.isLentTo) {
				return LendAgainButton;
			}
			if (this.isSelectedByAnother) {
				return LoanSelectedText;
			}

			return this.isSimpleLendButton ? Lend25Button : LendIncrementButton;
		},
	},
	mounted() {
		this.userPrefContinueBrowsing = store2('userPrefContinueBrowsing') === true; // read from localstorage
	},
	methods: {
		handleAddToBasketEvent(payload) {
			this.$emit('add-to-basket', payload);

			if (payload.success) {
				// A user is eligible to be part of the experiment to redirect if:
				// - If they added first loan to basket
				// - If they do not have promo credits
				// - If they have not clicked on "continue browsing" on the checkout page

				// User hasn't opted out by clicking "continue browsing"
				if (!this.userPrefContinueBrowsing) {
					// Make query for hasFreeCredits & basketCount
					this.apollo.query({
						query: freeCreditBasketCountQuery,
					}).then(response => {
						const hasFreeCredits = _get(response, 'data.shop.basket.hasFreeCredits', false);
						// Only reliable way to check basketCount.
						// When handleAddToBasketEvent is triggered, itemsInBasket may not be accurate
						const basketCount = _get(response, 'data.shop.nonTrivialItemCount', 0);

						if (!hasFreeCredits) {
							// User is eligible for experiment, track event
							this.$kvTrackEvent(
								'Lending',
								'EXP-GROW-127-Jul2020',
								this.addToBasketRedirectExperimentShown === true ? 'b' : 'a'
							);
						}

						// User is eligible and in experiment group and 1 item in basket
						if (!hasFreeCredits && this.addToBasketRedirectExperimentShown && basketCount === 1) {
							// User is part of shown group
							this.$router.push({
								path: '/basket',
							});
							return;
						}

						// User is part of control group or has free credits
						// Users with free credits go to legacy basket.
						this.triggerAddToBasketInterstitial(payload.loanId);
					}).catch(() => {
						// In case something happens
						this.triggerAddToBasketInterstitial(payload.loanId);
					});
				} else {
					this.triggerAddToBasketInterstitial(payload.loanId);
				}
			}
		}
	},
	created() {
		// GROW-127 Add to basket redirect experiment
		const addToBasketRedirectExperiment = this.apollo.readFragment({
			id: 'Experiment:add_to_basket_redirect',
			fragment: experimentVersionFragment,
		}) || {};

		if (addToBasketRedirectExperiment.version === 'control') {
			this.addToBasketRedirectExperimentShown = false;
		} else if (addToBasketRedirectExperiment.version === 'shown') {
			this.addToBasketRedirectExperimentShown = true;
		}
	}
};

</script>

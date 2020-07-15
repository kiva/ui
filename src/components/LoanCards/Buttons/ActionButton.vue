<template>
	<component
		:is="currentButtonState"
		class="action-button smaller"
		:loan-id="loanId"
		:loan="loan"
		:hide-adding-to-basket-text="hideAddingToBasketText"
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
import Lend25Button from './Lend25Button';
import LendIncrementButton from './LendIncrementButton';
import CheckoutNowButton from './CheckoutNowButton';
import LendAgainButton from './LendAgainButton';
import LoanFundedText from './LoanFundedText';
import LoanSelectedText from './LoanSelectedText';
import LoanExpiredText from './LoanExpiredText';

import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';

const freeCreditQuery = gql`query hasFreeCredits($basketId: String) {
	shop (basketId: $basketId) {
		basket {
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
		hideAddingToBasketText: {
			type: Boolean,
			default: false,
		},
		minimalCheckoutButton: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			addToBasketRedirectExperimentShown: false,
			hasFreeCredits: false,
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
		canParticipateInExperiment() {
			// Determines if a user is eligible to be part of the experiment.
			// - If they added first loan to basket
			// - If they do not have promo credits (this is handled below in the add to basket event)
			// - If they have not clicked on "continue browsing" on the checkout page
			if (this.itemsInBasket.length === 1 && !this.userPrefContinueBrowsing) {
				return true;
			}
			return false;
		}
	},
	mounted() {
		this.userPrefContinueBrowsing = store2('userPrefContinueBrowsing') === true; // read from localstorage
	},
	methods: {
		handleAddToBasketEvent(payload) {
			this.$emit('add-to-basket', payload);

			if (payload.success) {
				if (this.canParticipateInExperiment) {
					// If user can participate, make query for hasFreeCredits
					// By gating this, it avoids unnecessarily calling this query.
					this.apollo.query({
						query: freeCreditQuery,
					}).then(data => {
						this.hasFreeCredits = _get(data, 'shop.basket.hasFreeCredits');

						// Users with free credits go to legacy basket.
						if (!this.hasFreeCredits) {
							// User is eligible for experiment, track event
							this.$kvTrackEvent(
								'Lending',
								'EXP-GROW-127-Jul2020',
								this.addToBasketRedirectExperimentShown === true ? 'b' : 'a'
							);

							if (this.addToBasketRedirectExperimentShown) {
								// User is part of shown group
								this.$router.push({
									path: '/basket',
								});
							} else {
								// User is part of control group
								this.triggerAddToBasketInterstitial(payload.loanId);
							}
						} else {
							this.triggerAddToBasketInterstitial(payload.loanId);
						}
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

<style lang="scss" scoped>
@import 'settings';

.action-button {
	margin-top: rem-calc(30);
	margin-bottom: rem-calc(10);
	width: 100%;
}
</style>

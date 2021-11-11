<template>
	<div v-show="loanVisible" class="basket-item-wrapper row">
		<div class="hide-for-small-only medium-3 large-2 columns">
			<checkout-item-img
				:disable-link="disableRedirects"
				:loan-id="loan.id"
				:name="loan.loan.name"
				:image-url="loan.loan.image.url"
			/>
		</div>

		<div class="small-12 medium-5 large-7 columns borrower-info-wrapper">
			<div class="borrower-info featured-text">
				{{ loan.loan.name }} in {{ loan.loan.geocode.country.name }}
				<loan-matcher
					v-if="loan.loan.matchingText"
					:matching-text="loan.loan.matchingText"
				/>
				<loan-reservation
					:is-expiring-soon="loan.loan.loanFundraisingInfo.isExpiringSoon"
					:is-funded="loan.isFunded"
					:expiry-time="loan.expiryTime"
				/>
				<team-attribution
					v-if="teams.length"
					:teams="teams"
					:loan-id="loan.id"
					:team-id="loan.team ? loan.team.id : null"
				/>
				<loan-promo-credits
					:applied-promo-credits="appliedPromoCredits"
				/>
			</div>
		</div>
		<div class="small-12 medium-4 large-3 columns loan-res-price-wrapper">
			<loan-price
				:price="loan.price"
				:loan-id="loan.id"
				type="loan"
				:loan-amount="loan.loan.loanAmount"
				:min-amount="loan.loan.minNoteSize"
				:funded-amount="loan.loan.loanFundraisingInfo.fundedAmount"
				:reserved-amount="loan.loan.loanFundraisingInfo.reservedAmount"
				:is-expiring-soon="loan.loan.loanFundraisingInfo.isExpiringSoon"
				@refreshtotals="onLoanUpdate($event)"
				@updating-totals="$emit('updating-totals', $event)"
			/>
		</div>
	</div>
</template>

<script>
import CheckoutItemImg from '@/components/Checkout/CheckoutItemImg';
import LoanMatcher from '@/components/Checkout/LoanMatcher';
import LoanPromoCredits from '@/components/Checkout/LoanPromoCredits';
import LoanReservation from '@/components/Checkout/LoanReservation';
import LoanPrice from '@/components/Checkout/LoanPrice';
import TeamAttribution from '@/components/Checkout/TeamAttribution';

export default {
	components: {
		CheckoutItemImg,
		LoanMatcher,
		LoanPromoCredits,
		LoanReservation,
		LoanPrice,
		TeamAttribution
	},
	inject: ['apollo'],
	props: {
		disableRedirects: {
			type: Boolean,
			default: false
		},
		loan: {
			type: Object,
			default: () => {}
		},
		teams: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			activateTimer: true,
			loanVisible: true,
		};
	},
	computed: {
		creditsUsed() {
			return this.loan?.creditsUsed ?? [];
		},
		appliedPromoCredits() {
			if (this.creditsUsed.length) {
				const appliedCredits = this.creditsUsed.filter(credit => {
					return credit.creditType !== 'kiva_credit';
				});
				return appliedCredits.length ? appliedCredits : [];
			}
			return [];
		}
	},
	methods: {
		onLoanUpdate($event) {
			this.$emit('refreshtotals', $event);
			if ($event === 'removeLoan') {
				this.loanVisible = false;
			}
		},
	},
	updated() {
		// check for zeroed out loan validate + refresh if present
		if (typeof this.loan.price !== 'undefined' && this.loan.price === '0.00') {
			this.$emit('validateprecheckout');
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.basket-item-wrapper {
	margin-bottom: rem-calc(30);
}

.borrower-info {
	line-height: 1.25;
	font-weight: $global-weight-highlight;
}
</style>

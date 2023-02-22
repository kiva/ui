<template>
	<div v-show="loanVisible" class="basket-item-wrapper tw-flex tw-flex-col md:tw-flex-row tw-pb-5">
		<div class="tw-hidden md:tw-block tw-flex-none md:tw-mr-3 lg:tw-mr-4.5">
			<checkout-item-img
				data-testid="basket-loan-image"
				:disable-link="disableRedirects"
				:loan-id="loan.id"
				:name="loan.loan.name"
				:image-url="loan.loan.image.url"
			/>
		</div>
		<div class="tw-flex-auto borrower-info-wrapper">
			<div class="borrower-info" data-testid="basket-loan-info">
				<div class="tw-flex tw-mb-0.5">
					<h2 class="tw-text-h3 tw-flex-grow" data-testid="basket-loan-name">
						{{ loan.loan.name }} in {{ loan.loan.geocode.country.name }}
					</h2>
					<remove-basket-item
						class="md:tw-hidden tw-flex-none tw-ml-1 tw-mt-0.5 tw-h-1.5"
						:loan-id="loan.id"
						type="loan"
						@refreshtotals="onLoanUpdate($event)"
						@updating-totals="$emit('updating-totals', $event)"
					/>
				</div>
				<loan-matcher
					class="tw-mb-1"
					data-testid="basket-loan-matching-text"
					v-if="loan.loan.matchingText"
					:matching-text="loan.loan.matchingText"
				/>
				<loan-reservation
					class="tw-mb-1"
					data-testid="basket-loan-reservation-text"
					:is-expiring-soon="loan.loan.loanFundraisingInfo.isExpiringSoon"
					:is-funded="loan.isFunded"
					:expiry-time="loan.expiryTime"
				/>
				<team-attribution
					class="tw-mb-1 tw-mt-0.5"
					v-if="teams.length"
					:teams="teams"
					:loan-id="loan.id"
					:team-id="loan.team ? loan.team.id : 0"
				/>
				<loan-promo-credits
					:applied-promo-credits="appliedPromoCredits"
				/>
			</div>
		</div>
		<div
			v-if="leftoverCreditAllocationLoanId === String(loan.id)"
			class="tw-w-full
					md:tw-w-auto
					md:tw-ml-3
					lg:tw-ml-6
					tw-mt-1.5
					md:tw-mt-0"
		>
			<div
				class="
					tw-bg-brand-50
					tw-rounded
					tw-p-2
			">
				<span class="tw-text-action tw-block">The remaining ${{loan.price}} will be lent to this borrower.</span>
				<span class="tw-text-primary tw-block"><u>Choose another borrower</u></span>
			</div>
		</div>
		<div
			v-if="leftoverCreditAllocationLoanId !== String(loan.id)"
			class="
			tw-flex-none
			tw-w-full
			md:tw-w-auto
			md:tw-ml-3
			lg:tw-ml-4.5
			tw-mt-1.5
			md:tw-mt-0
			loan-res-price-wrapper"
		>
			<loan-price
				data-testid="basket-loan-price-selector"
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
import RemoveBasketItem from '@/components/Checkout/RemoveBasketItem';
import TeamAttribution from '@/components/Checkout/TeamAttribution';

export default {
	name: 'BasketItem',
	components: {
		CheckoutItemImg,
		LoanMatcher,
		LoanPromoCredits,
		LoanReservation,
		LoanPrice,
		RemoveBasketItem,
		TeamAttribution
	},
	inject: ['apollo', 'cookieStore'],
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
		},
		leftoverCreditAllocationLoanId() {
			return this.cookieStore.get('leftoverCreditAllocationLoanId');
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

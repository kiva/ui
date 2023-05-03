<template>
	<div>
		<form v-if="useFormSubmit" @submit.prevent="addToBasket" class="tw-w-full tw-flex">
			<fieldset
				class="tw-w-full tw-flex" :disabled="isAdding"
				data-testid="bp-lend-cta-select-and-button"
			>
				<div class="amountDropdownWrapper">
					<kv-ui-select
						v-if="hideShowLendDropdown && !isLessThan25 && !enableRelendingExp"
						:id="`LoanAmountDropdown_${loan.id}`"
						class="tw-min-w-12"
						v-model="selectedOption"
						v-kv-track-event="['Lending', 'click-Modify loan amount', 'open dialog', loanId, loanId]"
						@update:modelValue="trackLendAmountSelection"
						aria-label="Lend amount"
					>
						<option
							v-for="priceOption in prices"
							:key="priceOption"
							:value="priceOption"
						>
							${{ priceOption }}
						</option>
					</kv-ui-select>
				</div>

				<!-- Lend button -->
				<div :class="{ 'lendButtonWrapper' : hideShowLendDropdown}">
					<kv-ui-button
						key="lendButton"
						v-if="lendButtonVisibility && !isLessThan25 && !enableRelendingExp"
						class="tw-inline-flex tw-flex-1"
						data-testid="bp-lend-cta-lend-button"
						type="submit"
					>
						{{ ctaButtonText }}
					</kv-ui-button>

					<!-- Lend again/lent previously button -->
					<kv-ui-button
						key="lendAgainButton"
						v-if="showLendAgain"
						class="lend-again"
						data-testid="bp-lend-cta-lend-again-button"
						type="submit"
					>
						Lend again
					</kv-ui-button>
				</div>

				<!-- Stranded loans -->
				<lend-amount-button
					class="tw-w-full"
					:loan-id="loan.id"
					:show-now="false"
					:amount-left="unreservedAmount"
					@add-to-basket="addToBasket"
					v-if="isLendAmountButton"
				/>

				<!-- Adding to basket button -->
				<kv-ui-button
					v-if="isAdding"
					class="tw-inline-flex tw-flex-1"
				>
					Adding to basket
				</kv-ui-button>
			</fieldset>
		</form>

		<!-- Continue to checkout button -->
		<kv-ui-button
			v-if="this.state === 'basketed'"
			variant="secondary"
			class="tw-inline-flex tw-flex-1"
			data-testid="bp-lend-cta-checkout-button"
			to="/basket"
			v-kv-track-event="['Lending', 'click-Continue-to-checkout', 'Continue to checkout', loanId, loanId]"
		>
			Checkout now
		</kv-ui-button>

		<!-- Refunded, allSharesReserved button -->
		<kv-ui-button
			v-if="showNonActionableLoanButton"
			class="tw-inline-flex tw-flex-1"
		>
			{{ ctaButtonText }}
		</kv-ui-button>

		<!-- Funded / expired -->
		<div
			v-if="isFunded"
			class="tw-w-full tw-text-center tw-rounded tw-p-2"
			style="background: #f1f1f1;"
		>
			This loan was just funded! 🎉
		</div>
	</div>
</template>

<script>
import {
	getDropdownPriceArray,
	isLessThan25,
	isBetween25And50,
	isBetween25And500
} from '@/util/loanUtils';
import LendAmountButton from '@/components/LoanCards/Buttons/LendAmountButton';
import KvUiSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'LendCtaExp',
	props: {
		loan: {
			type: Object,
			default: () => {},
		},
		basketItems: {
			type: Array,
			default: () => []
		},
		isLoading: {
			type: Boolean,
			default: true
		},
		isAdding: {
			type: Boolean,
			default: false
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		},
		enableRelendingExp: {
			type: Boolean,
			default: false
		},
		userBalance: {
			type: Number,
			default: 0
		}
	},
	components: {
		LendAmountButton,
		KvUiButton,
		KvUiSelect,
	},
	data() {
		return {
			completeLoanView: true,
			selectedOption: this.getSelectedOption(this.loan?.unreservedAmount),
		};
	},
	methods: {
		async addToBasket() {
			this.$kvTrackEvent(
				'Lending',
				'Add to basket',
				this.showLendAgain ? 'Lend again' : 'lend-button-click',
				this.loanId,
				this.amountToLend
			);
			this.$emit('add-to-basket', this.amountToLend);
		},
		getSelectedOption(unreservedAmount) {
			if (isBetween25And50(unreservedAmount) || isLessThan25(unreservedAmount)) {
				return Number(unreservedAmount).toFixed();
			}
			return '25';
		},
		trackLendAmountSelection(selectedDollarAmount) {
			this.$kvTrackEvent(
				'Lending',
				'Modify lend amount',
				selectedDollarAmount
			);
		},
	},
	watch: {
		unreservedAmount(newValue, previousValue) {
			if (newValue !== previousValue && previousValue === '') {
				this.selectedOption = this.getSelectedOption(newValue);
			}
		},
		isCompleteLoanActive() {
			if (this.isCompleteLoanActive && this.completeLoanView) {
				this.completeLoanView = false;
			}
		},
	},
	computed: {
		loanId() {
			return this.loan?.id;
		},
		status() {
			return this.loan?.status ?? '';
		},
		minNoteSize() {
			return this.loan?.minNoteSize ?? '';
		},
		unreservedAmount() {
			if (this.enableRelendingExp) {
				if (this.enableFiveDollarsNotes) {
					if (this.userBalance > 20) return '25';
					return '5';
				}
				if (this.loan.unreservedAmount > 25) return '25';
				return this.loan?.unreservedAmount ?? '';
			}
			return this.loan?.unreservedAmount ?? '';
		},
		lentPreviously() {
			return this.loan?.userProperties?.lentTo ?? false;
		},
		isInBasket() {
			/* eslint-disable */
			return this.basketItems?.some(item => item.__typename === 'LoanReservation' && item.id === this.loan.id) ?? false;
			/* eslint-enable */
		},
		prices() {
			// We don't want to open up $5 loan shares for loans with more than $25 at this time
			// IF we wanted to show this interface on loans with less than 25 remaining they would see the selector
			const minAmount = parseFloat(this.unreservedAmount < 25 ? this.minNoteSize : 25); // 25_hard_coded
			// limit price options
			const priceArray = getDropdownPriceArray(this.unreservedAmount, minAmount, this.enableFiveDollarsNotes);
			// eslint-disable-next-line
			if (this.isCompleteLoanActive && !priceArray.includes(Number(this.unreservedAmount).toFixed())) {
				priceArray.push(Number(this.unreservedAmount).toFixed());
			}
			return priceArray;
		},
		ctaButtonText() {
			if (this.isCompleteLoanActive) {
				return 'Lend';
			}
			switch (this.state) {
				case 'loading':
					return 'Loading...';
				case 'refunded':
				case 'expired':
				default:
					return 'Lend';
			}
		},
		useFormSubmit() {
			if (this.hideShowLendDropdown
				|| this.lendButtonVisibility
				|| this.lendAgainButton
				|| this.state === 'lent-to'
				|| this.isAdding) {
				return true;
			}
			return false;
		},
		state() {
			if (this.isLoading) {
				return 'loading';
			}
			if (this.isAdding) {
				return 'adding';
			}
			if (this.isInBasket) {
				return 'basketed';
			}
			if (this.status === 'funded' || this.status === 'refunded' || this.status === 'expired') {
				return this.status;
			}
			if (this.allSharesReserved) {
				return 'fully-reserved';
			}
			if (this.lentPreviously) {
				return 'lent-to';
			}
			return 'lend';
		},
		lendButtonVisibility() {
			return this.state === 'lend' || this.state === 'loading';
		},
		showNonActionableLoanButton() {
			return this.state === 'refunded'
				|| this.state === 'expired';
		},
		hideShowLendDropdown() {
			return this.state === 'lend' || this.state === 'lent-to';
		},
		allSharesReserved() {
			if (parseFloat(this.unreservedAmount) === 0) {
				return true;
			}
			return false;
		},
		isLessThan25() {
			if (this.enableFiveDollarsNotes) return false; // NOTE: for $5 dollars notes we need to show the dropdown
			return isLessThan25(this.unreservedAmount);
		},
		isLentTo() {
			return this.state === 'lent-to';
		},
		isCompleteLoanActive() {
			// eslint-disable-next-line
			return (isLessThan25(this.unreservedAmount) || isBetween25And500(this.unreservedAmount));
		},
		isLendAmountButton() {
			if (this.enableRelendingExp) return (this.lendButtonVisibility || this.state === 'lent-to');
			// eslint-disable-next-line
			return (this.lendButtonVisibility || this.state === 'lent-to') && isLessThan25(this.unreservedAmount) && !this.enableFiveDollarsNotes;
		},
		isFunded() {
			return this.state === 'funded'
				|| this.state === 'fully-reserved';
		},
		amountToLend() {
			return this.isLessThan25 ? this.unreservedAmount : this.selectedOption;
		},
		showLendAgain() {
			return this.isLentTo && !this.isLessThan25;
		},
	},
};

</script>

<style lang="postcss" scoped>
.amountDropdownWrapper >>> select {
	border-radius: 14px 0 0 14px;
}

.lend-again ::v-deep span {
	@apply tw-px-0;
}

.lend-again ::v-deep > span {
	@apply tw-px-1;
}

.lendButtonWrapper >>> span:first-child {
	border-radius: 0 14px 14px 0;
}

</style>

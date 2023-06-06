<template>
	<div>
		<form v-if="showAddToBasket" @submit.prevent="addToBasket" class="tw-w-full tw-flex">
			<fieldset
				class="tw-w-full tw-flex"
				:disabled="isAdding"
				data-testid="bp-lend-cta-select-and-button"
			>
				<!-- Adding to basket button -->
				<kv-button
					v-if="isAdding"
					class="tw-inline-flex tw-flex-1"
				>
					Adding to basket
				</kv-button>

				<!-- Stranded loans -->
				<lend-amount-button
					v-else-if="showLendAmountButton"
					class="tw-w-full"
					:loan-id="loan.id"
					:show-now="false"
					:amount-left="amountToLend"
					@add-to-basket="addToBasket"
				/>

				<template v-else>
					<kv-select
						v-if="showLendDropdown"
						:id="`LoanAmountDropdown_${loan.id}`"
						class="amountDropdownWrapper tw-min-w-12"
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
					</kv-select>

					<!-- Lend button -->
					<div :class="{ 'lend-button-with-dropdown' : showLendDropdown }">
						<!-- Lend again/lent previously button -->
						<kv-button
							v-if="showLendAgain"
							class="lend-again"
							data-testid="bp-lend-cta-lend-again-button"
							type="submit"
						>
							Lend again
						</kv-button>

						<kv-button
							v-else
							class="tw-inline-flex tw-flex-1"
							data-testid="bp-lend-cta-lend-button"
							type="submit"
						>
							{{ ctaButtonText }}
						</kv-button>
					</div>
				</template>
			</fieldset>
		</form>

		<!-- Continue to checkout button -->
		<kv-button
			v-else-if="this.state === 'basketed'"
			variant="secondary"
			class="tw-inline-flex tw-flex-1"
			data-testid="bp-lend-cta-checkout-button"
			to="/basket"
			v-kv-track-event="['Lending', 'click-Continue-to-checkout', 'Continue to checkout', loanId, loanId]"
		>
			Checkout now
		</kv-button>

		<!-- Funded / expired -->
		<div
			v-else-if="isFunded"
			class="tw-w-full tw-text-center tw-rounded tw-p-2"
			style="background: #f1f1f1;"
		>
			This loan was just funded! 🎉
		</div>

		<!-- Refunded, allSharesReserved button -->
		<kv-button
			v-else-if="showNonActionableLoanButton"
			class="tw-inline-flex tw-flex-1"
		>
			{{ ctaButtonText }}
		</kv-button>
	</div>
</template>

<script>
import {
	getDropdownPriceArray,
	isLessThan25,
	isBetween25And50,
	isBetween25And500,
	enableCookie,
	isErlCookieActive,
	getDropdownERL
} from '@/util/loanUtils';
import LendAmountButton from '@/components/LoanCards/Buttons/LendAmountButton';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'LendCtaExp',
	inject: ['cookieStore'],
	props: {
		loan: {
			type: Object,
			default: () => {},
		},
		basketItems: {
			type: Array,
			default: () => []
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
		},
	},
	components: {
		LendAmountButton,
		KvButton,
		KvSelect,
	},
	data() {
		return {
			completeLoanView: true,
			selectedOption: this.getSelectedOption(this.loan?.unreservedAmount),
			activeCookie: '',
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
			if (this.enableFiveDollarsNotes) {
				if (this.activeCookie !== '') {
					return getDropdownERL(
						isErlCookieActive(this.cookieStore),
						this.userBalance,
						unreservedAmount
					);
				}
			}
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
			return this.loan?.unreservedAmount ?? '';
		},
		lentPreviously() {
			return this.loan?.userProperties?.lentTo ?? false;
		},
		amountToLend() {
			if (this.enableRelendingExp) {
				if (this.enableFiveDollarsNotes) {
					if (34 <= 5) {
						return Number(this.unreservedAmount) > 5 ? '5' : this.unreservedAmount;
					}
					if (this.activeCookie !== '') {
						return getDropdownERL(this.activeCookie, 34, this.unreservedAmount);
					}
				}
				return Number(this.unreservedAmount) > 25 ? '25' : this.unreservedAmount;
			}
			return (this.isLessThan25 && !this.enableFiveDollarsNotes) ? this.unreservedAmount : this.selectedOption;
		},
		isInBasket() {
			return this.basketItems
				// eslint-disable-next-line no-underscore-dangle
				?.some(item => item.__typename === 'LoanReservation' && item.id === this.loan.id) ?? false;
		},
		prices() {
			// We don't want to open up $5 loan shares for loans with more than $25 at this time
			// If we wanted to show this interface on loans with less than 25 remaining they would see the selector
			const minAmount = parseFloat(this.unreservedAmount < 25 ? this.minNoteSize : 25);
			const priceArray = getDropdownPriceArray(this.unreservedAmount, minAmount, this.enableFiveDollarsNotes);

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
		state() {
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
		isLentTo() {
			return this.state === 'lent-to';
		},
		isFunded() {
			return this.state === 'funded' || this.state === 'fully-reserved';
		},
		isCompleteLoanActive() {
			return (isLessThan25(this.unreservedAmount) || isBetween25And500(this.unreservedAmount));
		},
		allSharesReserved() {
			return parseFloat(this.unreservedAmount) === 0;
		},
		isLessThan25() {
			return isLessThan25(this.unreservedAmount);
		},
		showAddToBasket() {
			return this.showLendDropdown || this.showLendAmountButton || this.isAdding;
		},
		showLendAmountButton() {
			return (this.state === 'lend' || this.isLentTo || this.state === 'loading')
				&& (this.enableRelendingExp || (!this.enableFiveDollarsNotes && isLessThan25(this.unreservedAmount)));
		},
		showLendDropdown() {
			return (this.state === 'lend' || this.isLentTo)
				&& (this.enableFiveDollarsNotes || !this.isLessThan25)
				&& !this.enableRelendingExp;
		},
		showLendAgain() {
			return this.isLentTo && !this.isLessThan25;
		},
		showNonActionableLoanButton() {
			return this.state === 'refunded' || this.state === 'expired';
		},
	},
	mounted() {
		const campaign = this.$route.query.utm_campaign;
		const sessionTimestamp = new Date();
		sessionTimestamp.setHours(sessionTimestamp.getHours() + 24);

		this.activeCookie = isErlCookieActive(this.cookieStore);

		if (this.enableFiveDollarsNotes && ((this.activeCookie !== '' || campaign))) {
			this.selectedOption = enableCookie(
				campaign,
				this.cookieStore,
				this.activeCookie,
				this.userBalance,
				this.unreservedAmount
			);
		}
	}
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

.lend-button-with-dropdown >>> span:first-child {
	border-radius: 0 14px 14px 0;
}

</style>

<template>
	<div>
		<form v-if="useFormSubmit" @submit.prevent="addToBasket" class="tw-w-full tw-flex">
			<fieldset
				class="tw-w-full tw-flex" :disabled="isAdding"
				data-testid="bp-lend-cta-select-and-button"
			>
				<label
					v-if="hideShowLendDropdown && !isLessThan25"
					for="LoanAmountDropdown"
					class="tw-sr-only"
				>
					Lend amount
				</label>
				<div class="amountDropdownWrapper">
					<kv-ui-select
						v-if="hideShowLendDropdown && !isLessThan25"
						id="LoanAmountDropdown"
						class="tw-min-w-12"
						v-model="selectedOption"
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
						v-if="lendButtonVisibility && !isLessThan25"
						class="tw-inline-flex tw-flex-1"
						data-testid="bp-lend-cta-lend-button"
						type="submit"
					>
						{{ ctaButtonText }}
					</kv-ui-button>
				</div>

				<!-- Lend again/lent previously button -->
				<kv-ui-button
					key="lendAgainButton"
					v-if="isLentTo && !isLessThan25"
					class="tw-inline-flex tw-flex-1"
					data-testid="bp-lend-cta-lend-again-button"
					type="submit"
				>
					Lend again
				</kv-ui-button>

				<!-- Stranded loans -->
				<lend-amount-button
					class="tw-w-full"
					:loan-id="loanId"
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
		>
			Checkout now
		</kv-ui-button>

		<!-- Funded, refunded, expired/ allSharesReserved button -->
		<kv-ui-button
			v-if="showNonActionableLoanButton"
			class="tw-inline-flex tw-flex-1"
		>
			{{ ctaButtonText }}
		</kv-ui-button>
	</div>
</template>

<script>
import { gql } from '@apollo/client';
import { setLendAmount } from '@/util/basketUtils';
import {
	buildPriceArray,
	isLessThan25,
	isBetween25And50,
	isBetween25And500
} from '@/util/loanUtils';

import LendAmountButton from '@/components/LoanCards/Buttons/LendAmountButton';

import KvUiSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvUiButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'LendCtaExp',
	inject: ['apollo', 'cookieStore'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
	},
	components: {
		LendAmountButton,
		KvUiButton,
		KvUiSelect,
	},
	data() {
		return {
			selectedOption: '25',
			loanAmount: '',
			fundedAmount: '',
			reservedAmount: '',
			unreservedAmount: '',
			lentPreviously: false,
			minNoteSize: '',
			status: '',
			basketItems: [],
			isAdding: false,
			isLoading: true,
			completeLoanView: true,
		};
	},
	apollo: {
		query: gql`
			query lendCta($loanId: Int!, $basketId: String) {
				lend {
					loan(id: $loanId) {
						id
						status
						minNoteSize
						loanAmount
						unreservedAmount @client
						loanFundraisingInfo {
							fundedAmount
							reservedAmount
						}
						userProperties {
							lentTo
						}
					}
				}
				shop (basketId: $basketId) {
					id
					basket {
						id
						items {
							values {
								id
							}
						}
					}
				}
			}
		`,
		preFetch: false,
		variables() {
			return {
				loanId: this.loanId,
			};
		},
		result(result) {
			this.isLoading = false;
			const loan = result?.data?.lend?.loan;
			const basket = result?.data?.shop?.basket;

			this.loanAmount = loan?.loanAmount ?? '0';
			this.status = loan?.status ?? '';
			this.minNoteSize = loan?.minNoteSize ?? '';
			this.fundedAmount = loan?.loanFundraisingInfo?.fundedAmount ?? '';
			this.reservedAmount = loan?.loanFundraisingInfo?.reservedAmount ?? '';
			this.unreservedAmount = loan?.unreservedAmount ?? '';
			this.lentPreviously = loan?.userProperties?.lentTo ?? false;
			this.basketItems = basket?.items?.values ?? [];
		},
	},
	methods: {
		async addToBasket() {
			this.isAdding = true;
			setLendAmount({
				amount: isLessThan25(this.unreservedAmount) ? this.unreservedAmount : this.selectedOption,
				apollo: this.apollo,
				loanId: this.loanId,
			}).then(() => {
				this.isAdding = false;
			}).catch(e => {
				this.isAdding = false;
				const msg = e[0].extensions.code === 'reached_anonymous_basket_limit'
					? e[0].message
					: 'There was a problem adding the loan to your basket';

				this.$showTipMsg(msg, 'error');
			});
		},
	},
	watch: {
		unreservedAmount(newValue, previousValue) {
			// set initial selected value for sub 25 loan if shown
			if (isBetween25And50(this.unreservedAmount)) {
				this.selectedOption = Number(this.unreservedAmount).toFixed();
			} else if (newValue !== previousValue && previousValue === '' && newValue < 25) {
				this.selectedOption = parseInt(newValue, 10);
			}
		},
		isCompleteLoanActive() {
			if (this.isCompleteLoanActive && this.completeLoanView) {
				this.completeLoanView = false;
			}
		},
	},
	computed: {
		isInBasket() {
			// eslint-disable-next-line no-underscore-dangle
			return this.basketItems.some(item => item.__typename === 'LoanReservation' && item.id === this.loanId);
		},
		prices() {
			// We don't want to open up $5 loan shares for loans with more than $25 at this time
			// IF we wanted to show this interface on loans with less than 25 remaining they would see the selector
			const minAmount = parseFloat(this.unreservedAmount < 25 ? this.minNoteSize : 25); // 25_hard_coded
			// limit at 20 price options
			const priceArray = buildPriceArray(parseFloat(this.unreservedAmount), minAmount).slice(0, 20);
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
				case 'funded':
					return 'Find another loan';
				case 'refunded':
				case 'expired':
				case 'fully-reserved':
					return 'Find another loan';
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
			return this.state === 'funded'
				|| this.state === 'refunded'
				|| this.state === 'expired'
				|| this.state === 'fully-reserved';
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
			return (this.lendButtonVisibility || this.state === 'lent-to') && isLessThan25(this.unreservedAmount);
		}
	},
};

</script>

<style scoped>
.amountDropdownWrapper >>> select {
	border-radius: 14px 0 0 14px;
}

.lendButtonWrapper >>> span:first-child  {
	border-radius: 0 14px 14px 0;
}

</style>

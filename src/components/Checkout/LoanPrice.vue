<template>
	<div class="loan-price-wrapper tw-flex">
		<div v-if="price > 24" class="loan-price-select tw-flex-grow">
			<label for="loan-price" class="tw-sr-only">Loan Price</label>
			<kv-select
				v-model="selectedOption"
				class="loan-price tw-w-full"
				style="max-width: 18rem;"
				id="loan-price"
				@update:modelValue="updateLoanReservation()"
			>
				<option
					v-for="priceOption in prices"
					:key="priceOption"
					:value="priceOption"
				>
					${{ priceOption }}
				</option>
			</kv-select>
		</div>
		<p v-else class="tw-text-h3 tw-mb-0">
			${{ price }}
		</p>
		<remove-basket-item
			class="tw-hidden tw-flex-none tw-ml-2 tw-py-0.5 md:tw-py-1 md:tw-flex tw-items-center"
			:loan-id="loanId"
			:ids-in-group="idsInGroup"
			:type="type"
			@refreshtotals="$emit('refreshtotals', $event)"
			@updating-totals="$emit('updating-totals', $event)"
		/>
	</div>
</template>

<script>
import numeral from 'numeral';
import _forEach from 'lodash/forEach';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import updateKivaCardAmount from '@/graphql/mutation/updateKivaCardAmount.graphql';
import RemoveBasketItem from '@/components/Checkout/RemoveBasketItem';
import { getDropdownPriceArrayCheckout } from '@/util/loanUtils';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';

export default {
	name: 'LoanPrice',
	components: {
		KvSelect,
		RemoveBasketItem,
	},
	inject: ['apollo'],
	props: {
		price: {
			type: String,
			default: ''
		},
		loanAmount: {
			type: String,
			default: ''
		},
		fundedAmount: {
			type: String,
			default: ''
		},
		reservedAmount: {
			type: String,
			default: ''
		},
		minAmount: {
			type: String,
			default: '',
		},
		loanId: {
			type: Number,
			default: null
		},
		isExpiringSoon: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: 'loan'
		},
		idsInGroup: {
			type: Array,
			default: () => []
		},
		enableFiveDollarsNotes: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			selectedOption: numeral(this.price).format('0,0'),
			cachedSelection: numeral(this.price).format('0,0'),
			additionalSelctionLimit: 150, // how many addition loan shares to show above the selected amount
			overallSelectLimit: 500, // cap on highest loan share amount in select box
		};
	},
	computed: {
		prices() {
			if (this.type === 'loan') {
				let remainingAmount = parseFloat(this.loanAmount) - parseFloat(this.fundedAmount);
				// subtract reservedAmount (minus our own reserved amount)
				// - only do this for loans that are not ending soon
				// - for loans ending soon we just show remaining shares which are all un-reserved
				if (!this.isExpiringSoon) {
					remainingAmount -= (parseFloat(this.reservedAmount) - parseFloat(this.price));
				}

				// if we've met reserve ensure at least this loan share is set
				remainingAmount = Math.max(remainingAmount, parseFloat(this.price));

				const minAmount = parseFloat(this.minAmount || 25); // 25_hard_coded

				const priceArray = getDropdownPriceArrayCheckout(remainingAmount, minAmount, this.enableFiveDollarsNotes); // eslint-disable-line max-len
				if (!priceArray.includes(Number(this.price).toFixed())) {
					priceArray.push(Number(this.price).toFixed());
				}
				return priceArray;
			}
			if (this.type === 'kivaCard') {
				// convert this to formatted array for our select element
				const priceArray = ['25', '30', '50', '75', '100', '150', '200', '250', '300', '400',
					'500', '750', '1,000', '2,000'];
				return priceArray;
			}
			return ['0'];
		}
	},
	methods: {
		updateLoanReservation() {
			if (this.type === 'loan') {
				if (this.selectedOption !== this.price) {
					this.$emit('updating-totals', true);

					const updatedPrice = numeral(this.selectedOption).format('0.00');

					this.apollo.mutate({
						mutation: updateLoanReservation,
						variables: {
							loanid: this.loanId,
							price: updatedPrice
						}
					}).then(data => {
						if (data.errors) {
							let notAllSharesAdded = false;
							_forEach(data.errors, ({ message, code }) => {
								this.$showTipMsg(message, 'error');
								// update flag if this error is present
								if (code === 'not_all_shared_added') {
									notAllSharesAdded = true;
								}
							});
							// for not all shares added, the loan amount is updated by not reported to the client
							// - we need to refresh the page to get back into updated state
							if (typeof window !== 'undefined' && notAllSharesAdded) {
								window.setTimeout(window.location.reload(), 8000);
							} else {
								this.selectedOption = this.cachedSelection;
								this.$emit('updating-totals', false);
							}
						} else {
							this.$closeTipMsg();
							this.$kvTrackEvent(
								'basket',
								'Update Loan Amount',
								'Update Success',
								// pass updated loan amount as whole number
								numeral(updatedPrice).value(),
								numeral(updatedPrice).value()
							);
							this.$emit('refreshtotals');
							this.$emit('updating-totals', false);
							this.cachedSelection = this.selectedOption;
						}
					}).catch(error => {
						console.error(error);
						this.$emit('updating-totals', false);
					});
				}
			} else if (this.type === 'kivaCard') {
				if (this.selectedOption !== this.price) {
					this.$emit('updating-totals', true);

					const updatedPrice = numeral(this.selectedOption).format('0.00');

					this.apollo.mutate({
						mutation: updateKivaCardAmount,
						variables: {
							idsInGroup: this.idsInGroup,
							individualPrice: updatedPrice
						}
					}).then(data => {
						if (data.errors) {
							_forEach(data.errors, ({ message }) => {
								this.$showTipMsg(message, 'error');
							});
							this.selectedOption = this.cachedSelection;
							this.$emit('updating-totals', false);
						} else {
							this.$kvTrackEvent(
								'basket',
								'Update Kiva Card Amount',
								'Update Success',
								// pass updated Kiva Card amount as whole number
								numeral(updatedPrice).value()
							);
							this.$emit('refreshtotals');
							this.$emit('updating-totals', false);
							this.cachedSelection = this.selectedOption;
						}
					}).catch(error => {
						console.error(error);
						this.$emit('updating-totals', false);
					});
				}
			}
		},
	}
};

</script>

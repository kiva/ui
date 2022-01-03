<template>
	<div class="loan-price-wrapper">
		<div class="loan-price-select">
			<label for="loan-price" class="tw-sr-only">Loan Price</label>
			<kv-select
				v-model="selectedOption"
				class="loan-price"
				id="loan-price"
				@change="updateLoanReservation()"
			>
				<option v-for="priceOption in prices"
					:key="priceOption"
					:value="priceOption"
				>
					${{ priceOption }}
				</option>
			</kv-select>
		</div>
		<button
			class="remove-wrapper"
			@click="updateLoanReservation('remove')"
		>
			<kv-icon
				class="remove-x tw-text-tertiary tw-fill-current"
				name="small-x"
				:from-sprite="true"
				title="Remove from cart"
			/>
		</button>
	</div>
</template>

<script>
import numeral from 'numeral';
import _forEach from 'lodash/forEach';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import updateKivaCardAmount from '@/graphql/mutation/updateKivaCardAmount.graphql';
import KvIcon from '@/components/Kv/KvIcon';
import { buildPriceArray } from '@/util/loanUtils';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';

export default {
	components: {
		KvIcon,
		KvSelect
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
				return buildPriceArray(remainingAmount, minAmount);
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
		updateLoanReservation(changeType) {
			if (this.type === 'loan') {
				if (this.selectedOption !== this.price) {
					this.$emit('updating-totals', true);
					let updatedPrice;
					// If the loan remove X is clicked: set updatedPrice to 0
					// else pull the value out of the loanPrice select and keep moving through method
					if (changeType === 'remove') {
						updatedPrice = 0;
					} else {
						updatedPrice = numeral(this.selectedOption).format('0.00');
					}
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
								updatedPrice === 0 ? 'Loan Removed' : 'Update Success',
								// pass updated loan amount as whole number
								numeral(updatedPrice).value(),
								numeral(updatedPrice).value()
							);
							this.$emit('refreshtotals', this.changeType === 'remove' ? 'removeLoan' : '');
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
					let updatedPrice;
					// If the loan remove X is clicked: set updatedPrice to 0
					// else pull the value out of the loanPrice select and keep moving through method
					if (changeType === 'remove') {
						updatedPrice = 0;
					} else {
						updatedPrice = numeral(this.selectedOption).format('0.00');
					}
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
								updatedPrice === 0 ? 'Kiva Card Removed' : 'Update Success',
								// pass updated Kiva Card amount as whole number
								numeral(updatedPrice).value()
							);
							this.$emit('refreshtotals', this.changeType === 'remove' ? 'removeLoan' : '');
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

<style lang="scss" scoped>
@import 'settings';

.loan-price-wrapper {
	display: flex;
	align-items: flex-start;
	white-space: nowrap;
	justify-content: flex-start;

	@include breakpoint(medium) {
		justify-content: flex-end;
	}
}

.remove-wrapper {
	display: inline-block;
	margin-left: rem-calc(56);
	cursor: pointer;

	@include breakpoint(medium) {
		margin-left: 0;
	}
}

.loan-price-select {
	float: left;
	width: rem-calc(95);

	@include breakpoint(medium) {
		margin-right: rem-calc(20);
	}
}

.remove-x {
	display: inline-block;
	width: 1.1rem;
	height: rem-calc(50);

	@include breakpoint(medium) {
		height: rem-calc(36);
	}
}
</style>

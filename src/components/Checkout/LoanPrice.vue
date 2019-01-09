<template>
	<div class="loan-price-wrapper">
		<div class="loan-price-select">
			<select
				v-model="selectedOption"
				class="loan-price medium-text-font-size"
				@change="updateLoanReservation()">
				<option v-for="price in prices"
					:key="price"
					:value="price">${{ price }}
				</option>
			</select>
		</div>
		<div
			class="remove-wrapper"
			@click="updateLoanReservation('remove')"
		>
			<kv-icon class="remove-x" name="small-x" />
		</div>
	</div>
</template>

<script>
import numeral from 'numeral';
import updateLoanReservation from '@/graphql/mutation/updateLoanReservation.graphql';
import updateKivaCardAmount from '@/graphql/mutation/updateKivaCardAmount.graphql';
import _forEach from 'lodash/forEach';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
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
				// determine how many (if any) overall additional shares are remaining
				let remainingShares = parseFloat(this.loanAmount) - parseFloat(this.fundedAmount);

				// subtract reservedAmount shares (minus our own reserved shares)
				// - only do this for loans that are not expiring soon
				// - for loans expiring soon we just show remaining shares which are all un-reserved
				if (!this.isExpiringSoon) {
					remainingShares -= (parseFloat(this.reservedAmount) - parseInt(this.price, 10));
				}

				// if we've met reserve ensure atleast this loan share is set
				if (remainingShares < parseInt(this.price, 10)) remainingShares = parseInt(this.price, 10);

				// get count of shares based on available remaining shares
				const sharesBelowReserve = parseInt(remainingShares, 10) / 25;
				// convert this to formatted array for our select element
				const reservePriceArray = this.buildShareArray(sharesBelowReserve);

				return reservePriceArray;
			} else if (this.type === 'kivaCard') {
				// convert this to formatted array for our select element
				const priceArray = ['25', '30', '50', '75', '100', '150', '200', '250', '300', '400',
					'500', '750', '1,000', '2,000'];
				return priceArray;
			}
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
								numeral(updatedPrice).value()
							);
							this.$emit('refreshtotals', this.changeType === 'remove' ? 'removeLoan' : '');
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
							this.cachedSelection = this.selectedOption;
						}
					}).catch(error => {
						console.error(error);
						this.$emit('updating-totals', false);
					});
				}
			}
		},
		buildShareArray(shares) {
			// loop and build formatted array
			const priceArray = [];
			// ex. priceArray = ['25.00', '50.00', '75.00']
			for (let i = 0; i < shares; i++) { // eslint-disable-line
				priceArray.push(numeral(25 * (i + 1)).format('0,0'));
			}
			return priceArray;
		}
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.loan-price-wrapper {
	white-space: nowrap;
	float: none;

	@include breakpoint(medium) {
		float: right;
	}
}

.remove-wrapper {
	display: inline-block;
	margin-left: rem-calc(56);
	cursor: pointer;

	@include breakpoint(medium) {
		margin-left: rem-calc(10);
	}
}

.loan-price-select {
	float: left;
	width: rem-calc(95);
}

.loan-price {
	border: 1px solid $charcoal;
	min-width: rem-calc(90);
	width: rem-calc(132);
	border-radius: $button-radius;
	height: rem-calc(50);
	background-image: url('../../assets/images/customDropdown.png');
	background-size: 2rem 2rem;
	color: $charcoal;
	font-size: $medium-text-font-size;
	font-weight: $global-weight-highlight;
	cursor: pointer;

	@include breakpoint(medium) {
		height: inherit;
		line-height: $medium-text-line-height;
		font-size: inherit;
		width: rem-calc(90);
		background-size: rem-calc(23) rem-calc(20);
	}
}

// Media query targeting IE 10+ only
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
	.loan-price {
		width: 100%;
		background-position: left 3.8rem center;
	}
}

// Media query targeting IE EDGE
@supports (-ms-ime-align:auto) {
	.loan-price {
		background-position: right -1.2rem center;
	}
}

.remove-x {
	fill: $subtle-gray;
	display: inline-block;
	width: 1.1rem;
	height: rem-calc(50);

	@include breakpoint(medium) {
		height: rem-calc(36);
	}
}
</style>

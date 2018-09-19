<template>
	<div class="loan-price-wrapper">
		<select
			dir="rtl"
			v-model="selectedOption"
			class="loan-price medium-text-font-size"
			@change="updateLoanAmount()">
			<option v-for="price in prices"
				:key="price"
				:value="price">${{ price }}
			</option>
			<option :key="0" value="remove">Remove</option>
		</select>
	</div>
</template>

<script>
import _union from 'lodash/union';
import numeral from 'numeral';
import updateLoanAmount from '@/graphql/mutation/updateLoanAmount.graphql';
import _forEach from 'lodash/forEach';

export default {
	components: {
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
	},
	data() {
		return {
			selectedOption: numeral(this.price).format('0,0'),
			cachedSelection: numeral(this.price).format('0,0'),
			additionalSelctionLimit: 150, // how many addition loan shares to show above the selected amount
			overallSelectLimit: 500 // cap on highest loan share amount in select box
		};
	},
	computed: {
		prices() {
			// Build availble shares starting with what this lender has resereved
			const sharesBelowAmountLent = parseInt(this.price, 10) / 25;
			// convert this to formatted array for our select element
			const priceArray = this.buildShareArray(sharesBelowAmountLent);

			// determine how many (if any) overall additional shares are remaining
			let remainingShares = parseFloat(this.loanAmount) -
				(parseFloat(this.fundedAmount) + parseFloat(this.reservedAmount));

			// if we've met reserve ensure atleast this loan share is set
			if (remainingShares < parseInt(this.price, 10)) remainingShares = parseInt(this.price, 10);

			// Limit to this.selectLimit in addition to current price
			if (remainingShares > (parseInt(this.price, 10) + this.additionalSelctionLimit)) {
				remainingShares = parseInt(this.price, 10) + this.additionalSelctionLimit;
			}

			// Institute an overall selection cap
			if (remainingShares > this.overallSelectLimit) remainingShares = this.overallSelectLimit;

			// add to available shares based on available remaining shares
			const sharesBelowReserve = parseInt(remainingShares, 10) / 25;
			// convert this to formatted array for our select element
			const reservePriceArray = this.buildShareArray(sharesBelowReserve);

			// return the combined and de-duped arrays
			return _union(priceArray, reservePriceArray);
		}
	},
	methods: {
		updateLoanAmount() {
			if (this.selectedOption !== this.price) {
				this.$emit('updating-totals', true);
				const updatedPrice = this.getUpdatedPrice();
				this.apollo.mutate({
					mutation: updateLoanAmount,
					variables: {
						loanid: this.loanId,
						price: updatedPrice
					}
				}).then(data => {
					if (data.errors) {
						_forEach(data.errors, ({ message }) => {
							this.$showTipMsg(message, 'error');
						});
						this.selectedOption = this.cachedSelection;
					} else {
						this.$emit('refreshtotals', this.selectedOption === 'remove' ? 'removeLoan' : '');
						this.cachedSelection = this.selectedOption;
					}
					this.$emit('updating-totals', false);
				}).catch(error => {
					console.error(error);
					this.$emit('updating-totals', false);
				});
			}
		},
		getUpdatedPrice() {
			if (this.selectedOption === 'remove') {
				return 0;
			}
			return numeral(this.selectedOption).format('0,0.00');
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

<style lang="scss">
@import 'settings';

.loan-price-wrapper {

	@include breakpoint(medium) {
		float: right;
	}
}

.loan-price {
	border: 1px solid $charcoal;
	width: inherit;
	border-radius: $button-radius;
	height: rem-calc(50);
	background-image: url('../../assets/images/customDropdown.png');
	background-size: rem-calc(20) rem-calc(20);
	text-indent: rem-calc(8);

	@include breakpoint(medium) {
		height: rem-calc(32);
		line-height: $medium-text-line-height;
	}
}

</style>

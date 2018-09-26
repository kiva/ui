<template>
	<div class="loan-price-wrapper">
		<div class="loan-price-select">
			<select
				dir="rtl"
				v-model="selectedOption"
				class="loan-price medium-text-font-size"
				@change="updateLoanAmount()">
				<option v-for="price in prices"
					:key="price"
					:value="price">${{ price }}
				</option>
			</select>
		</div>
		<div
			class="remove-wrapper"
			@click="updateLoanAmount('remove')"
		>
			<kv-icon class="remove-x" name="small-x" />
		</div>
	</div>
</template>

<script>
import _union from 'lodash/union';
import numeral from 'numeral';
import updateLoanAmount from '@/graphql/mutation/updateLoanAmount.graphql';
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
		updateLoanAmount(changeType) {
			if (this.selectedOption !== this.price) {
				this.$emit('updating-totals', true);
				let updatedPrice;
				// If the loan remove X is clicked: set updatedPrice to 0
				// else pull the value out of the loanPrice select and keep moving through method
				if (changeType === 'remove') {
					updatedPrice = 0;
				} else {
					updatedPrice = numeral(this.selectedOption).format('0,0.00');
				}
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
						this.$emit('refreshtotals', this.changeType === 'remove' ? 'removeLoan' : '');
						this.cachedSelection = this.selectedOption;
					}
					this.$emit('updating-totals', false);
				}).catch(error => {
					console.error(error);
					this.$emit('updating-totals', false);
				});
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
	padding-left: rem-calc(10);
}

.loan-price-select {
	float: left;
}

.loan-price {
	border: 1px solid $charcoal;
	min-width: rem-calc(90);
	border-radius: $button-radius;
	height: rem-calc(50);
	background-image: url('../../assets/images/customDropdown.png');
	background-size: rem-calc(20) rem-calc(20);
	text-indent: rem-calc(8);
	color: $charcoal;
	font-size: $medium-text-font-size;

	@include breakpoint(medium) {
		height: inherit;
		line-height: $medium-text-line-height;
		font-size: inherit;
	}
}

// Media query targeting IE 10+ only
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
	.loan-price {
		width: 100%;
		background-position: left 3.5rem center;
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

<template>
	<div>
		<select
			dir="rtl"
			v-model="selectedOption"
			class="loan-price"
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
			selectLimit: 150,
			additionalSharesLimit: 6
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

			// Limit to this.selectLimit on shares in select box
			// if (remainingShares > this.selectLimit) remainingShares = this.selectLimit;
			// Limit to this.selectLimit in addition to current price
			if (remainingShares > (parseInt(this.price, 10) + this.selectLimit)) {
				remainingShares = parseInt(this.price, 10) + this.selectLimit;
			}

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
				const updatedPrice = this.getUpdatedPrice();
				this.apollo.mutate({
					mutation: updateLoanAmount,
					variables: {
						loanid: this.loanId,
						price: updatedPrice
					}
				}).then(() => {
					this.$emit('refreshtotals', this.selectedOption === 'remove' ? 'removeLoan' : '');
				}).catch(error => {
					console.error(error);
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

.loan-price {
	border: 1.5px solid black;
}

</style>

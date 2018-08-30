<template>
	<div>
		<select
			v-model="selectedOption"
			class="loan-price"
			@change="updateLoanAmount()">
			<option v-for="price in prices"
				:key="price"
				:value="price">${{ price }}
			</option>
		</select>
	</div>
</template>

<script>
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
		loanId: {
			type: Number,
			default: null
		},
	},
	data() {
		return {
			selectedOption: numeral(this.price).format('0,0.00'),
			prices: ['25.00', '50.00', '75.00', '100.00', '125.00', '150.00', 'remove']
		};
	},
	computed: {

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
			return this.selectedOption;
		}
	}
};

</script>

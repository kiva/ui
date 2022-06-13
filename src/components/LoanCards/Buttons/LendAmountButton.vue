<template>
	<lend-button
		:price="amountLeft"
		:loan-id="loanId"
		@add-to-basket="addToBasket($event)"
	>
		{{ buttonText }}
	</lend-button>
</template>

<script>
import LendButton from './LendButton';

export default {
	name: 'LendAmountButton',
	components: {
		LendButton,
	},
	props: {
		loanId: {
			type: Number,
			default: null
		},
		showNow: {
			type: Boolean,
			default: false
		},
		amountLeft: {
			type: [Number, String],
			default: 20
		},
		completeLoan: {
			type: Boolean,
			default: false
		},
	},
	mounted() {
		if (this.completeLoan) {
			// eslint-disable-next-line max-len
			this.$kvTrackEvent('Borrower profile', 'Complete loan', 'view-amount-left-cta', null, null);
		}
	},
	computed: {
		amountValue() {
			return parseFloat(this.amountLeft).toFixed();
		},
		buttonText() {
			let str = '';

			if (this.completeLoan) {
				str = `Complete loan for $${this.amountValue}`;
			} else {
				str = `Lend ${this.amountValue}`;
				if (this.showNow) {
					str += ' now';
				}
			}

			return str;
		}
	},
	methods: {
		addToBasket(event) {
			if (this.completeLoan) {
				// eslint-disable-next-line max-len
				this.$kvTrackEvent('Borrower profile', 'Complete loan', 'click-amount-left-cta', this.loanId, this.amountLeft);
			} else {
				// eslint-disable-next-line max-len
				this.$kvTrackEvent('Lending', 'Add to basket (Partial Share)', 'lend-button-click', this.loanId, this.amountLeft);
			}
			this.$emit('add-to-basket', event);
		}
	}
};
</script>

export default {
	data() {
		return {
			loanUseMaxLength: 100,
		};
	},
	computed: {
		loanUse() {
			if (!this.loan) {
				return '';
			}
			if (typeof this.loan.use !== 'string'
				|| typeof this.loan.name !== 'string'
				|| !this.loan.status
				|| !this.loan.loanAmount
				|| !this.loan.borrowerCount
			) {
				return '';
			}

			return this.$options.filters.loanUse(this.loan.use,
				this.loan.name,
				this.loan.status,
				this.loan.loanAmount,
				this.loan.borrowerCount,
				this.loanUseMaxLength);
		},
	},
};

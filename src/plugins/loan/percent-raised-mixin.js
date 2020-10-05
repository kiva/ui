function checkLoanProps(loan) {
	if (!loan.loanAmount
		|| !loan.loanFundraisingInfo
		|| !loan.loanFundraisingInfo.fundedAmount
		|| !loan.loanFundraisingInfo.reservedAmount
	) {
		return false;
	}
	return true;
}

export default {
	computed: {
		amountLeft() {
			if (!this.loan || !checkLoanProps(this.loan)) {
				return 0;
			}

			const {
				fundedAmount,
				reservedAmount
			} = this.loan.loanFundraisingInfo;
			return this.loan.loanAmount - fundedAmount - reservedAmount;
		},
		amountLeftWithoutReservation() {
			if (!this.loan || !checkLoanProps(this.loan)) {
				return 0;
			}
			return this.loan.loanAmount - this.loan.loanFundraisingInfo.fundedAmount;
		},
		percentRaised() {
			if (!this.loan || !checkLoanProps(this.loan)) {
				return 0;
			}
			return (this.loan.loanAmount - this.amountLeft) / this.loan.loanAmount;
		},
		percentRaisedWithoutReservation() {
			if (!this.loan || !checkLoanProps(this.loan)) {
				return 0;
			}
			return (this.loan.loanAmount - this.amountLeftWithoutReservation) / this.loan.loanAmount;
		},
	},
};

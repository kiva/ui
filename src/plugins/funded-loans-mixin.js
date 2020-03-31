import _filter from 'lodash/filter';
import _get from 'lodash/get';
import numeral from 'numeral';

export default {
	methods: {
		// Initial set of loans (represented in the 'values' field)
		filterFundedLoans(loans) {
			// remove loans that are funded
			return _filter(loans, loan => {
				return this.testFundedStatus(loan);
			});
		},
		testFundedStatus(loan) {
			// check status, exclude if funded
			if (_get(loan, 'status') !== 'fundraising') {
				// we could store these for tracking if needed
				// this.fundedLoans.push(loan);
				return false;
			}
			// check fundraising information, store if funded
			const loanAmount = numeral(_get(loan, 'loanAmount'));
			const fundedAmount = numeral(_get(loan, 'loanFundraisingInfo.fundedAmount'));
			const reservedAmount = numeral(_get(loan, 'loanFundraisingInfo.reservedAmount'));
			// loan amount vs funded amount
			if (loanAmount.value() === fundedAmount.value()) {
				// this.fundedLoans.push(loan);
				return false;
			}
			// loan amount vs funded + reserved amount
			if (loanAmount.value() === (fundedAmount.value() + reservedAmount.value())) {
				// this.fundedLoans.push(loan);
				return false;
			}
			// all clear
			return true;
		},
	}
};

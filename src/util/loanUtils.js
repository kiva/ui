/* eslint-disable import/prefer-default-export */
import numeral from 'numeral';
import _get from 'lodash/get';

/** Utility functions for working with loan objects */

/**
 * Returns true if loan is fundraising / can be lent to
 *
 * @param {object} loan
 * @returns {boolean|null}
 */
export function isLoanFundraising(loan) {
	// check status
	if (_get(loan, 'status') !== 'fundraising') {
		return false;
	}
	// check fundraising information
	const loanAmount = numeral(_get(loan, 'loanAmount'));
	const fundedAmount = numeral(_get(loan, 'loanFundraisingInfo.fundedAmount'));
	const reservedAmount = numeral(_get(loan, 'loanFundraisingInfo.reservedAmount'));
	// loan amount vs funded amount
	if (loanAmount.value() === fundedAmount.value()) {
		return false;
	}
	// loan amount vs funded + reserved amount
	if (loanAmount.value() === (fundedAmount.value() + reservedAmount.value())) {
		return false;
	}
	// all clear
	return true;
}

export function buildPriceArray(amountLeft, minAmount) {
	// get count of shares based on available remaining amount.
	const N = amountLeft / minAmount;
	// convert this to formatted array for our select element
	const priceArray = Array(N).map((_, i) => numeral(minAmount * (i + 1).format('0,0')));
	// ex. priceArray = ['25', '50', '75']
	return priceArray;
}

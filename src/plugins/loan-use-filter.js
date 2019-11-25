import numeral from 'numeral';

/**
 * Uses the loan status to return the proper verbiage and tense for 'helped'
 *
 * @param {string} loan status
 * @returns {string}
 */
export function helpedLanguage(status) {
	if (status === 'fundraising'
	|| status === 'inactive'
	|| status === 'reviewed') {
		return 'helps';
	}
	return 'helped';
}

/**
 * Uses the borrowerCount to `a member` or empty string.
 *
 * @param {string} borrowerCount
 * @returns {string}
 */
export function borrowerCountLanguage(borrowerCount) {
	if (borrowerCount > 1) {
		return 'a member ';
	}
	return '';
}
/**
 * Uses the borrowerCount to `a member` or empty string.
 *
 * @param {string} loanUse, loanName required
 * @param {number} loanUseMaxLength required
 * @returns {string}
 */
export function shortenedLoanUse(loanUse, loanName, loanUseMaxLength) {
	const lowerCaseUse = loanUse.toString().charAt(0).toLowerCase() + loanUse.toString().slice(1);
	const convertedUse = (loanUse.substring(0, loanName.length) === loanName) ? loanUse : lowerCaseUse;

	if (loanUse.length === 0) {
		return 'For the borrower\'s privacy, this loan has been made anonymous.';
	}
	if (loanUse.length > loanUseMaxLength) {
		return `${convertedUse.substring(0, loanUseMaxLength)}...`;
	}
	return convertedUse;
}

/**
 * Combines all of the above in a filter that returns a string to present to the UI
 *
 * @param {string} loanUse required
 * @param {string} loanName, loanStatus optional
 * @param {number} loanAmount, loanBorrowerCount, loanUseMaxLength  optional
 * @returns {string}
 */
export default (loanUse,
	loanName = '',
	loanStatus = '',
	loanAmount = 0,
	loanBorrowerCount = 0,
	loanUseMaxLength = 0) => {
	return 'A loan of '
		+ `${numeral(loanAmount).format('$0,0')} `
		+ `${helpedLanguage(loanStatus)} `
		+ `${borrowerCountLanguage(loanBorrowerCount)}`
		+ `${shortenedLoanUse(loanUse, loanName, loanUseMaxLength)}`;
};

// This file uses common JS imports/exports so our express router can use it as well.
const numeral = require('numeral');

const DIRECT = 'direct';
const PARTNER = 'fieldPartner';

/**
 * Format the loan amount
 *
 * @param {number} loanAmount - loan amount
 * @returns {string}
 */
function amount(loanAmount) {
	return loanAmount > 0 ? numeral(loanAmount).format('$0,0') : '';
}

/**
 * Uses the loan status to return the proper verbiage and tense for 'helped'
 *
 * @param {string} status - loan status
 * @returns {string}
 */
function helped(status = '') {
	if (['fundraising', 'inactive', 'reviewed'].includes(status)) {
		return 'helps';
	}
	return 'helped';
}

/**
 * Uses the borrowerCount to `a member` or empty string.
 *
 * @param {number} borrowerCount - loan borrower count
 * @returns {string}
 */
function groupMember(borrowerCount = 0) {
	if (borrowerCount > 1) {
		return 'a member ';
	}
	return '';
}

/**
 * Uses the borrowerCount to return `a member of` or empty string.
 *
 * @param {number} borrowerCount - loan borrower count
 * @returns {string}
 */
function groupMemberV2(borrowerCount = 0) {
	if (borrowerCount > 1) {
		return 'a member of ';
	}
	return '';
}

/**
 * Lowercase the first letter of the loan use field unless it starts with the loan name.
 *
 * @param {string} loanUse - loan use field from api
 * @param {string} loanName - loan name
 * @returns {string}
 */
function normalizeUse(loanUse, loanName) {
	const use = typeof loanUse === 'string' ? loanUse : '';
	const name = typeof loanName === 'string' ? loanName : '';
	if (use.slice(0, name.length) === name) {
		return use;
	}
	return `${use.charAt(0).toLowerCase()}${use.slice(1)}`;
}

/**
 * Lowercase the first letter of the loan use field unless it starts with the loan name.
 *
 * @param {string} loanUse - loan use field from api
 * @param {string} loanName - loan name
 * @returns {string}
 */
function normalizeUseV2(loanUse, loanName) {
	let use = typeof loanUse === 'string' ? loanUse : '';
	const name = typeof loanName === 'string' ? loanName : '';
	if (use.slice(0, name.length) === name) {
		use = use.slice(name.length).trim();
	}
	return `${use.charAt(0).toLowerCase()}${use.slice(1)}`;
}

/**
 * Truncate and append ellipsis if maxLength is greater than 0
 *
 * @param {string} loanUse - loan use
 * @param {number} maxLength - maximum length of loan use to allow
 * @returns {string}
 */
function truncateUse(loanUse, maxLength) {
	const use = typeof loanUse === 'string' ? loanUse : '';
	const max = typeof maxLength === 'number' ? maxLength : 0;
	return max > 0 && use.length > max ? `${use.slice(0, max)}...` : use;
}

/**
 * Get the full, formatted loan use for display on loan cards, borrower profiles, etc.
 *
 * @param {Object} options
 * @param {string} options.anonymizationLevel - LoanBasic.anonymizationLevel API field
 * @param {number} options.borrowerCount - LoanBasic.borrowerCount API field
 * @param {number} options.distributionModel - LoanBasic.distributionModel API field
 * @param {string} options.loanAmount - LoanBasic.loanAmount API field
 * @param {number} options.maxLength - Truncate the loan use to this length. Skips truncation if 0. (default 0)
 * @param {string} options.name - LoanBasic.name API field
 * @param {string} options.status - LoanBasic.status API field
 * @param {string} options.use - LoanBasic.use API field
 * @param {string} options.version - Loan use text version number (default 1)
 * @returns {string}
 */
function getLoanUse({
	anonymizationLevel = 'none',
	borrowerCount = 0,
	distributionModel = PARTNER,
	loanAmount = '',
	maxLength = 0,
	name = '',
	prefix = 'A loan of ',
	status = '',
	use = '',
	version = 1,
} = {}) {
	if (anonymizationLevel === 'full' || !use) {
		return 'For the borrower\'s privacy, this loan has been made anonymous.';
	}

	const loanAmountValue = numeral(loanAmount).value();
	if (!loanAmountValue) {
		return '';
	}

	if (version === 2) {
		if (distributionModel === DIRECT) {
			return `${amount(loanAmountValue)} `
				+ `to ${groupMemberV2(borrowerCount)}`
				+ `${name} `
				+ `${helped(status)} `
				+ `${truncateUse(normalizeUseV2(use, name), maxLength)}`;
		}
		return `${amount(loanAmountValue)} `
			+ `${helped(status)} `
			+ `${groupMemberV2(borrowerCount)}`
			+ `${name} `
			+ `${truncateUse(normalizeUseV2(use, name), maxLength)}`;
	}

	// Default (version === 1)
	return `${prefix}${amount(loanAmountValue)} `
		+ `${helped(status)} `
		+ `${groupMember(borrowerCount)}`
		+ `${truncateUse(normalizeUse(use, name), maxLength)}`;
}

module.exports = getLoanUse;

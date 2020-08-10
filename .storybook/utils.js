import loanData from './mock-data/loan-data-mock';

/**
 * Returns array of loan objects
 *
 * @param {number} length
 * @returns {array}
 */
export function returnArrayOfLoans (length) {
	// returns an array of length filled with loanData
	return [].concat(...Array(length).fill(loanData))
}

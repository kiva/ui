import loanData from './mock-data/loan-data-mock';

/**
 * Returns array of loan objects
 *
 * @param {number} length
 * @returns {array}
 */
export function mockLoansArray (length) {
	// returns an array of length filled with loanData with random id's for each loan
	const loanArray = [].concat(...Array(length).fill(loanData));
	return loanArray.map(loan => {
		var temp = Object.assign({}, loan);
		temp.id = Math.floor(Math.random() * 100000);
		return temp;
	})
}

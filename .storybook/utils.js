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
		let temp = Object.assign({}, loan);
		temp.id = Math.floor(Math.random() * 100000);
		// set planned expiration date to be 1-60 days in the future
		let targetDate = new Date();
		let tempRandomInt = Math.floor(Math.random() * 61);
		targetDate.setDate(targetDate.getDate() + tempRandomInt)
		temp.plannedExpirationDate = targetDate.toISOString();
		temp.fundraisingTimeLeft = tempRandomInt + ' days'
		return temp;
	})
}

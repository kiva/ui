import numeral from 'numeral';
import myFTD from '@/graphql/query/myFTD.graphql';
import removeCreditByTypeMutation from '@/graphql/mutation/shopRemoveCreditByType.graphql';

/** Format Transaction Data for Analtyics events
* @param {Number} transactionId
* @param {Array} loans
* @param {Array} kivaCards
* @param {Array} donations
* @param {Object} totals
 * @returns {Object}
*/
export function formatTransactionData(
	transactionId = 0,
	loans = [],
	kivaCards = [],
	donations = [],
	totals = {}
) {
	// calculate loan total
	const loanTotal = loans.reduce((accumulator, loan) => {
		const price = loan.price ? numeral(loan.price) : 0;
		return price.add(accumulator).value();
	}, 0);

	// calculate donation total
	const donationTotal = donations.reduce((accumulator, donation) => {
		const price = donation.price ? numeral(donation.price) : 0;
		return price.add(accumulator).value();
	}, 0);

	// compile payment type
	let paymentType = totals.creditAmountNeeded !== '0.00' ? 'deposit' : '';
	// check for kiva credit applied
	if (totals.kivaCreditAppliedTotal !== '0.00') {
		paymentType += '+kiva_credit';
	}
	// check for promo credits applied
	if (
		totals.bonusAppliedTotal !== '0.00'
		|| totals.redemptionCodeAppliedTotal !== '0.00'
		|| totals.universalCodeAppliedTotal !== '0.00'
	) {
		paymentType += '+promo_credit';
	}

	// compile transaction information
	const transactionData = {
		transactionId: numeral(transactionId).value(),
		itemTotal: totals.itemTotal,
		loans: loans.map(loan => {
			const { __typename, id, price } = loan;
			return { __typename, id, price };
		}),
		loanCount: loans.length > 0 ? loans.length : 0,
		loanTotal: String(numeral(loanTotal).format('0.00')),
		donations: donations.map(donation => {
			const { __typename, id, price } = donation;
			return { __typename, id, price };
		}),
		donationTotal: String(numeral(donationTotal).format('0.00')),
		isTip: donations.reduce((accumulator, donation) => {
			const { isTip } = donation;
			// use accumlator if false
			if (!accumulator) {
				return accumulator;
			}
			return isTip;
		}, true),
		isUserEdited: donations.reduce((accumulator, donation) => {
			const { isUserEdited } = donation;
			// use accumlator if true
			if (accumulator) {
				return accumulator;
			}
			return isUserEdited;
		}, false),
		kivaCardTotal: totals.kivaCardTotal || null,
		kivaCardCount: kivaCards.length > 0 ? kivaCards.length : 0,
		kivaCards: kivaCards.map(kivaCard => {
			const { __typename, id, price } = kivaCard;
			return { __typename, id, price };
		}),
		kivaCreditAppliedTotal: totals.kivaCreditAppliedTotal || 0,
		depositTotal: totals.creditAmountNeeded || 0,
		paymentType,
		isFTD: false,
		optimizely: {
			loanTotal,
			donationTotal
		}
	};

	return transactionData;
}

/**
 * myFTD query
 * Checks for FTD status
 *
 * @param {Object} apollo Apollo Client instance
 * @returns {Promise}
 */
export function myFTDQuery(apollo) {
	// Fetch FTD Status
	return apollo.query({
		query: myFTD,
	});
}

/**
 * removeCredit mutation
 * removes a credit applied to the user
 *
 * @param {Object} apollo Apollo Client instance
 * @param {('bonus_credit'|'free_trial'|'kiva_credit'|'redemption_code'|'universal_code')} creditType
 * @returns {Promise}
 */
export function removeCredit(apollo, creditType) {
	return apollo.mutate({
		mutation: removeCreditByTypeMutation,
		variables: {
			creditType
		}
	});
}

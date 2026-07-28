import numeral from 'numeral';
import myFTD from '#src/graphql/query/myFTD.graphql';
import { getReEngagementEvent } from '#src/util/lifecycleStage';
import removeCreditByTypeMutation from '#src/graphql/mutation/shopRemoveCreditByType.graphql';

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

	const depositTotal = totals.creditAmountNeeded || 0;

	// Which qualifying actions this transaction contains. A basket can hold more than
	// one, so these are reported as a list rather than a single label — marketing needs
	// to tell a deposit-only return apart from one that also included a loan.
	// Kiva Cards do not qualify on their own, though buying one usually needs a deposit.
	const reEngagementTriggers = [];
	if (loans.length) {
		reEngagementTriggers.push('loan');
	}
	// parsed rather than compared to '0.00', which reads a missing amount as a deposit
	if (numeral(depositTotal).value() > 0) {
		reEngagementTriggers.push('deposit');
	}
	if (numeral(donationTotal).value() > 0) {
		reEngagementTriggers.push('donation');
	}

	// compile transaction information
	const transactionData = {
		transactionId: numeral(transactionId).value(),
		reEngagementTriggers,
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
		depositTotal,
		paymentType,
		isFTD: false,
		// Resolved on checkout entry and attached by the caller, see getTransactionAnalyticsData
		lifecycleStage: null,
		daysSinceLastLoan: null,
		reEngagementEvent: null,
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
 * Checkout blocks the thanks-page redirect on these lookups, so they must always
 * settle. Past this point we report what we have and let the lender through.
 */
const ANALYTICS_TIMEOUT_MS = 10000;

function emptyTransactionAnalyticsData() {
	return {
		isFTD: undefined,
		lifecycleStage: null,
		daysSinceLastLoan: null,
		reEngagementEvent: null,
	};
}

/**
 * Resolves the user attributes needed for transaction analytics.
 *
 * The lifecycle promise must be started before checkout completes so a new loan
 * purchase does not change the stage before it is reported.
 *
 * Never throws or hangs. Analytics must not be able to strand a lender who has
 * already paid.
 *
 * @param {Object} apollo Apollo Client instance
 * @param {Promise<Object|null>|null} lifecycleDataPromise Pre-transaction lifecycle request
 * @returns {Promise<Object>}
 */
export async function getTransactionAnalyticsData(apollo, lifecycleDataPromise) {
	let timer;
	const timeout = new Promise(resolve => {
		timer = setTimeout(() => resolve([null, null]), ANALYTICS_TIMEOUT_MS);
	});

	try {
		const [ftdResponse, lifecycleData] = await Promise.race([
			Promise.all([myFTDQuery(apollo), lifecycleDataPromise]),
			timeout,
		]);

		return {
			isFTD: ftdResponse?.data?.my?.userAccount?.isFirstTimeDepositor,
			lifecycleStage: lifecycleData?.stage ?? null,
			daysSinceLastLoan: lifecycleData?.daysSinceLastLoan ?? null,
			// "re-engaged" marks the return itself, so it fires once per inactive period
			reEngagementEvent: lifecycleData?.alreadyReEngaged
				? null
				: getReEngagementEvent(lifecycleData?.stage),
		};
	} catch (e) {
		console.error(e);
		return emptyTransactionAnalyticsData();
	} finally {
		clearTimeout(timer);
	}
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

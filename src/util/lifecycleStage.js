import { LIFECYCLE_STAGES } from '@kiva/kv-analytics';
import lifecycleStageGqlQuery from '#src/graphql/query/lifecycleStage.graphql';
import { getTransactionTimestamp } from '#src/util/myKivaUtils';
import { daysSince } from '#src/util/dateUtils';
import logFormatter from '#src/util/logFormatter';

/**
 * Day thresholds, highest first, mapped to the stage they produce.
 *
 * Mirrored from the Lifecycle Stages doc, which is owned by analytics and is the
 * source of truth. If the thresholds change there, they must be changed here too.
 * https://kiva.atlassian.net/wiki/spaces/ANA/pages/2472640597/Lifecycle+stages
 */

// days since the most recent loan purchase
const IDLE_LADDER = [
	[730, LIFECYCLE_STAGES.LAPSED_CHURNED],
	[365, LIFECYCLE_STAGES.IDLE_365],
	[180, LIFECYCLE_STAGES.IDLE_180],
	[90, LIFECYCLE_STAGES.IDLE_90],
];

// days since registration, for lenders who have never purchased a loan
const UNCONVERTED_LADDER = [
	[180, LIFECYCLE_STAGES.UNCONVERTED_180],
	[90, LIFECYCLE_STAGES.UNCONVERTED_90],
	[0, LIFECYCLE_STAGES.REGISTERED],
];

/**
 * @param {Array} ladder Descending [minDays, stage] pairs
 * @param {Number} days
 * @returns {String|null}
 */
function stageForDays(ladder, days) {
	return ladder.find(([minDays]) => days >= minDays)?.[1] ?? null;
}

/**
 * Derives a lender's lifecycle stage from their loan purchase history
 *
 * Stages are driven entirely by loan purchases. Deposits, donations and Kiva Card
 * purchases do not move a lender between stages.
 *
 * @param {Object} args
 * @param {String} args.memberSince Registration date
 * @param {Number} args.loanPurchaseCount Loan purchases made. Only none / one / more
 *   than one are distinguished, so callers may cap this rather than count them all.
 * @param {String} args.lastLoanPurchase Date of the most recent loan purchase
 * @param {Date} now
 * @returns {String|null} A LIFECYCLE_STAGES value, or null if it can't be determined
 */
export function deriveLifecycleStage({
	memberSince,
	loanPurchaseCount = 0,
	lastLoanPurchase,
} = {}, now = new Date()) {
	// Never purchased a loan, so the clock runs from registration
	if (!loanPurchaseCount) {
		const daysSinceRegistration = daysSince(memberSince, now);
		return daysSinceRegistration === null
			? null
			: stageForDays(UNCONVERTED_LADDER, daysSinceRegistration);
	}

	const daysSinceLastLoan = daysSince(lastLoanPurchase, now);
	if (daysSinceLastLoan === null) {
		return null;
	}

	// Purchased within the last 90 days. A single purchase is still "new"; any
	// subsequent purchase, including one that ends an idle period, is "engaged".
	return stageForDays(IDLE_LADDER, daysSinceLastLoan)
		?? (loanPurchaseCount === 1 ? LIFECYCLE_STAGES.NEW : LIFECYCLE_STAGES.ENGAGED);
}

/**
 * lifecycleStage query
 *
 * Kept out of initializeCheckout deliberately: that query gates checkout render, and
 * this is optional analytics that should not be able to slow or break it.
 *
 * @param {Object} apollo Apollo Client instance
 * @returns {Promise}
 */
function lifecycleStageQuery(apollo) {
	return apollo.query({
		query: lifecycleStageGqlQuery,
		// the stage changes the moment a lender buys a loan, so a cached result from
		// earlier in the session would misclassify them
		fetchPolicy: 'network-only',
	});
}

/**
 * Fetches and derives the lender's current lifecycle stage.
 *
 * Must be started before the transaction completes. The purchase being tracked is
 * itself what moves a lender out of an idle or lapsed stage, so querying afterwards
 * reports every lender as "engaged" and the re-engagement events never fire.
 *
 * Never throws. Tracking must not be able to break checkout.
 *
 * @param {Object} apollo Apollo Client instance
 * @param {Date} now
 * @returns {Promise<Object|null>} { stage, daysSinceLastLoan }, or null for guests
 */
export async function getLifecycleData(apollo, now = new Date()) {
	try {
		const { data } = await lifecycleStageQuery(apollo);

		// Guests have no lender record, so there is no lifecycle stage to report
		const memberSince = data?.my?.lender?.memberSince;
		if (!memberSince) {
			return null;
		}

		// Capped at two rows by the query, which is all the stage distinguishes
		const purchases = data?.my?.loanPurchases?.values ?? [];
		// effectiveTime with a createTime fallback, matching the rest of the codebase
		const lastLoanPurchase = getTransactionTimestamp(purchases[0]);

		return {
			stage: deriveLifecycleStage({
				memberSince,
				loanPurchaseCount: purchases.length,
				lastLoanPurchase,
			}, now),
			daysSinceLastLoan: daysSince(lastLoanPurchase, now),
		};
	} catch (e) {
		logFormatter('Failed to fetch lifecycle data', 'error', { error: e?.message });
		return null;
	}
}

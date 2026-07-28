import { differenceInDays } from 'date-fns';
import lifecycleStageGqlQuery from '#src/graphql/query/lifecycleStage.graphql';
import { getTransactionTimestamp } from '#src/util/myKivaUtils';
import { toValidDate } from '#src/util/dateUtils';
import logFormatter from '#src/util/logFormatter';

export const LIFECYCLE_STAGES = {
	REGISTERED: 'registered',
	UNCONVERTED_90: 'unconverted90',
	UNCONVERTED_180: 'unconverted180',
	NEW: 'new',
	ENGAGED: 'engaged',
	IDLE_90: 'idle90',
	IDLE_180: 'idle180',
	IDLE_365: 'idle365',
	LAPSED_CHURNED: 'lapsedChurned',
};

export const RE_ENGAGEMENT_EVENTS = {
	IDLE: 'idleLenderReEngaged',
	LAPSED: 'lapsedLenderReEngaged',
};

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
 * The re-engagement event a stage qualifies for, if any.
 *
 * IDLE_90 sits in the "Active" lifecycle phase while IDLE_180 and IDLE_365 sit in
 * "Idle". The requirement says stages containing "idle", so all three are included.
 * Drop the IDLE_90 entry if marketing scopes it to the Idle phase.
 */
const RE_ENGAGEMENT_BY_STAGE = {
	[LIFECYCLE_STAGES.LAPSED_CHURNED]: RE_ENGAGEMENT_EVENTS.LAPSED,
	[LIFECYCLE_STAGES.IDLE_365]: RE_ENGAGEMENT_EVENTS.IDLE,
	[LIFECYCLE_STAGES.IDLE_180]: RE_ENGAGEMENT_EVENTS.IDLE,
	[LIFECYCLE_STAGES.IDLE_90]: RE_ENGAGEMENT_EVENTS.IDLE,
};

/**
 * Whole days elapsed between a date and now
 *
 * @param {String|Number|Date} date
 * @param {Date} now
 * @returns {Number|null} null when the date is missing or unparseable
 */
function daysSince(date, now) {
	const parsed = toValidDate(date);
	return parsed ? differenceInDays(now, parsed) : null;
}

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
 * @param {Number} args.loanPurchaseCount Lifetime count of loan purchases
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
 * @param {String} stage
 * @returns {String|null} The re-engagement event name for this stage, if any
 */
export function getReEngagementEvent(stage) {
	return RE_ENGAGEMENT_BY_STAGE[stage] ?? null;
}

/**
 * lifecycleStage query
 *
 * @param {Object} apollo Apollo Client instance
 * @returns {Promise}
 */
function lifecycleStageQuery(apollo) {
	return apollo.query({
		query: lifecycleStageGqlQuery,
		// the stage drives conversion tracking and changes the moment a lender buys a
		// loan, so a cached result from earlier in the session would misclassify them
		fetchPolicy: 'network-only',
	});
}

/**
 * Fetches and derives the lender's current lifecycle stage.
 *
 * Must be called before the transaction completes. The purchase being tracked is
 * itself what moves a lender out of an idle or lapsed stage, so querying afterwards
 * reports every lender as "engaged" and the re-engagement events never fire.
 *
 * Never throws. Tracking must not be able to break checkout.
 *
 * @param {Object} apollo Apollo Client instance
 * @param {Date} now
 * @returns {Promise<Object|null>} Lifecycle facts, or null for guests
 */
export async function getLifecycleData(apollo, now = new Date()) {
	try {
		const { data } = await lifecycleStageQuery(apollo);

		// Guests have no lender record, so there is no lifecycle stage to report
		const memberSince = data?.my?.lender?.memberSince;
		if (!memberSince) {
			return null;
		}

		const loanPurchaseCount = data?.my?.transactions?.totalCount ?? 0;
		// effectiveTime with a createTime fallback, matching the rest of the codebase
		const lastLoanPurchase = getTransactionTimestamp(data?.my?.transactions?.values?.[0]);
		const daysSinceLastLoan = daysSince(lastLoanPurchase, now);

		return {
			stage: deriveLifecycleStage({ memberSince, loanPurchaseCount, lastLoanPurchase }, now),
			daysSinceLastLoan,
		};
	} catch (e) {
		logFormatter('Failed to fetch lifecycle data', 'error', { error: e?.message });
		return null;
	}
}

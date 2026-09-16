/**
 * Well-known giving fund IDs, keyed by fund identity.
 */
export const givingFundIds = {
	// Colombia earthquake recovery (disaster relief) fund
	// https://www.kiva.org/gf/238fe077-033e-4a59-8d11-e571e6e4ed31
	COLOMBIA_DISASTER_RELIEF: '238fe077-033e-4a59-8d11-e571e6e4ed31',
};

/**
 * Last moment the Colombia earthquake recovery fund next step is promoted on MyKiva.
 * The card shows through October 10, so the window closes at the end of that day in
 * Pacific time, which is UTC-7 in October.
 */
export const COLOMBIA_RELIEF_NEXT_STEP_END = '2026-10-11T07:00:00.000Z';

/**
 * Whether the Colombia earthquake recovery fund next step is still inside its promo window
 *
 * @param {Date} now Injectable clock, for tests
 * @returns {boolean}
 */
export function isColombiaReliefNextStepActive(now = new Date()) {
	return now.getTime() < new Date(COLOMBIA_RELIEF_NEXT_STEP_END).getTime();
}

/**
 * Whether the lender has already donated to the Colombia earthquake recovery fund.
 * Relies on the reliefFundParticipation alias, which filters giving fund participation
 * down to COLOMBIA_DISASTER_RELIEF.
 *
 * @param {Object} my Query data carrying the reliefFundParticipation alias
 * @returns {boolean}
 */
export function hasSupportedColombiaReliefFund(my) {
	return (my?.reliefFundParticipation?.totalCount ?? 0) > 0;
}

/**
 * Whether a lender's only giving fund activity is supporting the disaster relief fund:
 * they own no giving funds and every donation they've made went to the relief fund
 *
 * @param {Object} my Query data with givingFunds and givingFundParticipation counts,
 * including the relief-fund-filtered reliefFundParticipation alias
 * @returns {boolean}
 */
export function isDisasterReliefFundOnlySupporter(my) {
	const reliefFundDonationCount = my?.reliefFundParticipation?.totalCount ?? 0;
	return (my?.givingFunds?.totalCount ?? 0) === 0
		&& reliefFundDonationCount > 0
		&& reliefFundDonationCount === (my?.givingFundParticipation?.totalCount ?? 0);
}

/**
 * Utility method for parsing newly created giving fund cookie data
 * This cookie is generated when guests create a giving fund
 * Cookie format: gfid|uiv|action
 */
export default function parseGivingFundCookie(cookieString) {
	if (!cookieString) {
		return {};
	}

	// Decode the cookie value in case it's URL-encoded (e.g., %7C becomes |)
	const decodedCookieString = decodeURIComponent(cookieString);
	const [fundId, uiv, action] = decodedCookieString.split('|');

	return {
		fundId: fundId || null,
		uiv: uiv || null,
		action: action || null,
	};
}

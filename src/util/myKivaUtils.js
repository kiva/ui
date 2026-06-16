import postCheckoutAchievementsQuery from '#src/graphql/query/postCheckoutAchievements.graphql';
import logReadQueryError from '#src/util/logReadQueryError';

export const CONTENTFUL_CAROUSEL_KEY = 'my-kiva-hero-carousel';
export const TRANSACTION_LOANS_KEY = 'loan_purchase';
export const POST_LENDING_NEXT_STEPS_COOKIE = 'my_kiva_post_lending_next_steps';
export const GOAL_SIGNUP_THANKS_VIEWS_COOKIE = 'kv_goal_signup_thanks_views';
export const GOAL_SIGNUP_THANKS_VIEW_CAP = 3;
// Fresh-progress reconciliation window: last 15 minutes.
export const RECENT_TRANSACTION_WINDOW_MS = 15 * 60 * 1000;
export const MY_KIVA_CARD_HEIGHT = 417;

/**
 * Returns transaction timestamp (ms) preferring effectiveTime with createTime fallback.
 *
 * @param transaction Transaction object
 * @returns Transaction timestamp in milliseconds or null when invalid
 */
export const getTransactionTimestamp = transaction => {
	const effectiveTimestamp = transaction?.effectiveTime
		? new Date(transaction.effectiveTime).getTime()
		: NaN;
	if (!Number.isNaN(effectiveTimestamp)) {
		return effectiveTimestamp;
	}

	const createTimestamp = transaction?.createTime
		? new Date(transaction.createTime).getTime()
		: NaN;
	return Number.isNaN(createTimestamp) ? null : createTimestamp;
};

/**
 * Returns loans from transactions that occurred within a recent time window.
 * Transactions are expected to be pre-filtered by caller when needed.
 *
 * @param transactions Array of transactions
 * @param options Optional configuration
 * @param options.nowTimestamp Current timestamp in milliseconds
 * @param options.windowMs Window size in milliseconds
 * @returns Array of loans from in-window transactions
 */
export const getRecentTransactionLoans = (
	transactions = [],
	{ nowTimestamp = Date.now(), windowMs = RECENT_TRANSACTION_WINDOW_MS } = {}
) => {
	const windowStartTimestamp = nowTimestamp - windowMs;
	return (transactions ?? [])
		.map(transaction => ({
			transaction,
			timestamp: getTransactionTimestamp(transaction),
		}))
		.filter(item => (
			item.transaction?.loan?.id != null
			&& item.timestamp != null
			&& item.timestamp >= windowStartTimestamp
			&& item.timestamp <= nowTimestamp
		))
		.map(item => item.transaction.loan);
};

/**
 * Determines whether the provided loan needs a footnote
 *
 * @param loan The loan to check
 * @returns Whether the loan needs a footnote
 */
export const hasLoanFunFactFootnote = loan => {
	const region = loan?.geocode?.country?.region ?? '';
	const country = loan?.geocode?.country?.name ?? '';
	if (region === 'North America' && country === 'United States') {
		return true;
	}
	switch (region) {
		case 'Central America':
		case 'Africa':
		case 'Asia':
			return true;
		default:
			return false;
	}
};

/**
 * Fetches the post-checkout achievements for the provided loan IDs
 *
 * @param apollo The current Apollo client
 * @param loanIds The loan IDs to fetch achievements for
 */
export const fetchPostCheckoutAchievements = async (apollo, loanIds) => {
	try {
		await apollo.query({
			query: postCheckoutAchievementsQuery,
			variables: { loanIds },
		});
	} catch (e) {
		logReadQueryError(e, 'myKivaUtils postCheckoutAchievementsQuery');
	}
};

/**
 * Set session cookie for post lending card cookie to show cards in MyKiva
 *
 * @param cookieStore The cookie store
 * @param totalLoans The total number of loans the user has made
 */
export const setPostLendingCardCookie = (cookieStore, totalLoans) => {
	// Only add the session cookie if the user is a guest and has made at least one loan
	if (totalLoans > 0) {
		cookieStore?.set(POST_LENDING_NEXT_STEPS_COOKIE, 'true', { path: '/' });
	}
};

/**
 * Checks for existence of session cookie for post lending card cookie
 *
 * @param cookieStore The cookie store
 * @returns Whether the post lending card cookie exists
 */
export const checkPostLendingCardCookie = cookieStore => {
	return !!cookieStore?.get(POST_LENDING_NEXT_STEPS_COOKIE);
};

/**
 * Checks for existence of session cookie for post lending card cookie
 *
 * @param cookieStore The cookie store
 * @returns Whether the post lending card cookie exists
 */
export const removePostLendingCardCookie = cookieStore => {
	return cookieStore?.remove(POST_LENDING_NEXT_STEPS_COOKIE);
};

export const getGoalSignupThanksCookieExpiry = (date = new Date()) => {
	return new Date(date.getFullYear() + 1, 0, 1);
};

export const getGoalSignupThanksViewCount = cookieStore => {
	const value = Number(cookieStore?.get(GOAL_SIGNUP_THANKS_VIEWS_COOKIE));
	return Number.isFinite(value) && value > 0 ? value : 0;
};

export const isGoalSignupThanksViewCapped = cookieStore => {
	return getGoalSignupThanksViewCount(cookieStore) >= GOAL_SIGNUP_THANKS_VIEW_CAP;
};

export const incrementGoalSignupThanksViewCount = (cookieStore, date = new Date()) => {
	const nextCount = Math.min(getGoalSignupThanksViewCount(cookieStore) + 1, GOAL_SIGNUP_THANKS_VIEW_CAP);
	/**
	 * Cookie contract for the thank-you page annual-goal signup cap:
	 * name: kv_goal_signup_thanks_views
	 * path: /
	 * domain: host-only (no explicit domain, scoped to the current Kiva host)
	 * expiry: January 1 of the next calendar year so the ask resets annually.
	 */
	cookieStore?.set(GOAL_SIGNUP_THANKS_VIEWS_COOKIE, String(nextCount), {
		path: '/',
		expires: getGoalSignupThanksCookieExpiry(date),
	});
	return nextCount;
};

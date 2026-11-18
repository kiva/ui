/**
 * QA date override for every goal surface: /mykiva?goalDate=2027-01-05 runs the goal features as if
 * it were that date, saves included (use a test account). The date sticks for the browser session
 * through a cookie, so later page loads keep it without the param; ?goalDate=off clears it.
 */
const GOAL_DATE_QUERY_PARAM = 'goalDate';
export const GOAL_DATE_COOKIE = 'kv_goal_date';

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const firstValue = value => (Array.isArray(value) ? value[0] : value);

// Noon, not midnight: a date saved from the override (a goal's dateStarted, say) goes to the server
// as UTC, and local midnight on Jan 1 east of Greenwich is still Dec 31 there. Noon keeps the same
// UTC calendar day from UTC-11 to UTC+11.
const OVERRIDE_HOUR = 12;

function toLocalDate(year, monthIndex, day) {
	const date = new Date(year, monthIndex, day, OVERRIDE_HOUR);
	const isSameDay = date.getFullYear() === year
		&& date.getMonth() === monthIndex
		&& date.getDate() === day;
	return isSameDay ? date : null;
}

/**
 * Parses a YYYY-MM-DD date as that day in the viewer's time zone, at noon. `new Date('2027-04-01')`
 * would read it as UTC midnight, which is the previous evening west of Greenwich. Impossible dates
 * (2027-02-30) and any other format return null.
 *
 * @param {string|string[]} value The value; a repeated query param uses its first value.
 * @returns {Date|null} The local date, or null when the value is not a valid YYYY-MM-DD date.
 */
export function parseGoalDate(value) {
	const match = String(firstValue(value) ?? '').match(DATE_PATTERN);
	if (!match) return null;
	const [, year, month, day] = match;
	return toLocalDate(Number(year), Number(month) - 1, Number(day));
}

const hasGoalDateParam = query => GOAL_DATE_QUERY_PARAM in (query ?? {});

const getQueryOverride = query => parseGoalDate(query[GOAL_DATE_QUERY_PARAM]);

/**
 * The goal date override. A goal date param in the query wins, and one that isn't a valid date
 * (?goalDate=off) turns the override off. Without one, the date saved in the cookie applies.
 *
 * @param {object} [query] The route query. Read it from the route, never the address bar, so the
 *   server render and the browser agree.
 * @param {object} [cookieStore] The app's CookieStore, for the date a tester set earlier.
 * @returns {Date|null} The override date, or null when there is none.
 */
export function getGoalDateOverride(query, cookieStore) {
	if (hasGoalDateParam(query)) {
		return getQueryOverride(query);
	}
	return parseGoalDate(cookieStore?.get(GOAL_DATE_COOKIE));
}

/**
 * @param {object} [query] The route query.
 * @param {object} [cookieStore] The app's CookieStore.
 * @returns {Date} The override date when one is set, otherwise the current time.
 */
export function getGoalNow(query, cookieStore) {
	return getGoalDateOverride(query, cookieStore) ?? new Date();
}

/**
 * @param {object} [query] The route query.
 * @param {object} [cookieStore] The app's CookieStore.
 * @returns {number} The goal year in progress.
 */
export function getCurrentGoalYear(query, cookieStore) {
	return getGoalNow(query, cookieStore).getFullYear();
}

/**
 * @param {object} [query] The route query.
 * @param {object} [cookieStore] The app's CookieStore.
 * @returns {number} The goal year before the one in progress.
 */
export function getLastGoalYear(query, cookieStore) {
	return getCurrentGoalYear(query, cookieStore) - 1;
}

/**
 * @param {Date} date A local date.
 * @returns {string} The date as YYYY-MM-DD.
 */
export function formatGoalDate(date) {
	const pad = value => String(value).padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Saves a goal date param to the session cookie, or clears the cookie when the param isn't a valid
 * date (?goalDate=off). A query without the param leaves the cookie as it is. Browser only: a
 * Set-Cookie on a server render could be cached by the CDN for other visitors.
 *
 * @param {object} query The route query.
 * @param {object} cookieStore The app's CookieStore.
 */
export function saveGoalDateCookie(query, cookieStore) {
	if (!cookieStore || !hasGoalDateParam(query)) return;
	const date = getQueryOverride(query);
	if (date) {
		// No expiry: a session cookie, gone when the browser closes.
		cookieStore.set(GOAL_DATE_COOKIE, formatGoalDate(date), { path: '/' });
	} else if (cookieStore.has(GOAL_DATE_COOKIE)) {
		cookieStore.remove(GOAL_DATE_COOKIE, { path: '/' });
	}
}

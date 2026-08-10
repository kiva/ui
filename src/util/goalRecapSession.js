// Session cookie — no expiry, so it lives until the browser session ends. The recap is
// meant to arrive on the session *after* the one the goal was completed in, and a
// server-side preference cannot express that: it has no idea where one visit ends and
// the next begins.
const COMPLETION_SESSION_COOKIE = 'kvgrcs';

/**
 * Records that the goal was completed during this browsing session, so the recap holds
 * off until the next one.
 *
 * @param {object} cookieStore The injected cookie store.
 * @param {number|string} year The year of the goal that completed.
 */
export function markGoalCompletedThisSession(cookieStore, year) {
	if (!cookieStore || !year) return;
	cookieStore.set(COMPLETION_SESSION_COOKIE, String(year), { path: '/' });
}

/**
 * Whether the goal for this year completed during the current browsing session.
 *
 * @param {object} cookieStore The injected cookie store.
 * @param {number|string} year The recap year.
 * @returns {boolean} True while still in the session the goal was completed in.
 */
export function completedGoalThisSession(cookieStore, year) {
	if (!cookieStore || !year) return false;
	return cookieStore.get(COMPLETION_SESSION_COOKIE) === String(year);
}

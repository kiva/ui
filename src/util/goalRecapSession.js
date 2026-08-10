// No expiry, so it clears when the browser session ends. A stored preference cannot do
// this: it has no idea where one visit ends and the next begins.
const COMPLETION_SESSION_COOKIE = 'kv_goal_completed_this_session';

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

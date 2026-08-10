import { META_EVENTS, trackMetaEvent } from '@kiva/kv-analytics';

const REPORTED_COOKIE = 'kvMetaAccountCreated';

/**
 * The markers a newly registered lender can arrive with, in precedence order, as
 * [param name, the value that counts as a match].
 *
 * `registration=new` is added by the monolith on the post-authentication redirect, in the same
 * place that raises the "Welcome to Kiva!" toast, and covers email and social sign-ups.
 * `claimed=1` is added by GuestAccountRedirect and covers guest account claims.
 */
const REGISTRATION_MARKERS = [
	['registration', 'new'],
	['claimed', '1'],
];

/**
 * The query param marking the page a newly registered lender was sent to, if any.
 *
 * @param {String} search location.search
 * @returns {String|null} The param name that matched, so the caller can remove it
 */
export function getRegistrationMarker(search) {
	const params = new URLSearchParams(search);
	return REGISTRATION_MARKERS.find(([name, value]) => params.get(name) === value)?.[0] ?? null;
}

/**
 * Reports a newly created account to Meta, at most once per lender.
 *
 * The monolith decides a login is a registration by checking whether the account was created
 * in the last 30 seconds, so the marker can arrive more than once for a single sign-up. A
 * cookie rather than sessionStorage: it is shared across tabs, and anyone who just authenticated
 * necessarily has cookies working, so there is no unavailable case to guard.
 *
 * The marker is deliberately left in the URL — the cookie is the whole dedup. The trade is that
 * a marked URL shared or bookmarked past the cookie's lifetime reports again in a browser that
 * has no cookie, since the marker travels with the link and the cookie does not.
 *
 * @param {String|Number|null} userId Keys the guard, so a second lender on the same browser
 *   still reports
 * @param {Object} cookies `{ get, set }`, where set should scope the value to roughly an hour —
 *   the dedup window only needs to outlive the monolith's re-authentication redirect
 */
export function trackAccountCreated(userId, cookies) {
	// No pixel on the server, and no URL to read from an SSR pass
	if (typeof window === 'undefined') {
		return;
	}

	const marker = getRegistrationMarker(window.location.search);
	if (!marker) {
		return;
	}

	const cookieName = `${REPORTED_COOKIE}:${userId ?? ''}`;
	if (cookies?.get(cookieName) !== '1') {
		cookies?.set(cookieName, '1');
		trackMetaEvent(META_EVENTS.ACCOUNT_CREATED);
	}
}

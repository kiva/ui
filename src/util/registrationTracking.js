import { META_EVENTS, trackMetaEvent } from '#src/util/metaEvents';

const SESSION_KEY = 'kvMetaAccountCreated';

/**
 * The query param marking the page a newly registered lender was sent to, if any.
 *
 * `registration=new` is added by the monolith on the post-authentication redirect, in the same
 * place that raises the "Welcome to Kiva!" toast, and covers email and social sign-ups.
 * `claimed=1` is added by GuestAccountRedirect and covers guest account claims.
 *
 * @param {String} search location.search
 * @returns {String|null} The param name that matched, so the caller can remove it
 */
export function getRegistrationMarker(search) {
	const params = new URLSearchParams(search);
	if (params.get('registration') === 'new') {
		return 'registration';
	}
	if (params.get('claimed') === '1') {
		return 'claimed';
	}
	return null;
}

/**
 * Reports a newly created account to Meta, at most once per browser session.
 *
 * The monolith decides a login is a registration by checking whether the account was created
 * in the last 30 seconds, so the marker can arrive more than once for a single sign-up. Once
 * per session is the right ceiling: one session cannot legitimately register twice.
 *
 * @param {String|Number|null} userId
 */
export function trackAccountCreated(userId) {
	const marker = getRegistrationMarker(window.location.search);
	if (!marker) {
		return;
	}

	const sessionKey = `${SESSION_KEY}:${userId ?? ''}`;
	let alreadyReported = false;
	try {
		alreadyReported = window.sessionStorage.getItem(sessionKey) === '1';
		window.sessionStorage.setItem(sessionKey, '1');
	} catch (e) {
		// Storage is unavailable in some private browsing modes. Removing the marker below
		// still prevents the common repeat, a refresh.
	}

	if (!alreadyReported) {
		trackMetaEvent(META_EVENTS.ACCOUNT_CREATED);
	}

	// Drop the marker so a reload cannot replay it
	const url = new URL(window.location.href);
	url.searchParams.delete(marker);
	window.history.replaceState(window.history.state, '', url.toString());
}

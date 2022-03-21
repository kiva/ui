/**
 * Reads the One Trust cookie value and fires an event if
 * the user has accepted any of the optional groups of cookies
 * Runs when a user first accepts, declines, or when group settings are changed
 * Essential Cookies -- Group C0001 is always accepted.
*/
export default function oneTrustGlobalEvent() {
	const getCookieValue = name => {
		return document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || '';
	};
	// Get OneTrust cookie value as decoded search params
	const oneTrustCookieParams = new URLSearchParams(getCookieValue('OptanonConsent'));
	// Get groups from cookie value as a string like: 'C0001:1,C0003:1,C0002:1,C0004:1'
	const acceptedCookieGroups = oneTrustCookieParams.get('groups');

	// Returns boolean if user has accepted any of the optional OneTrust groups
	// User cookie acceptance is determined by groups C0003, or C0002, or C0004 being accepted
	const userHasAcceptedCookies = acceptedCookieGroupsString => {
		if (acceptedCookieGroupsString) {
			// Transforms a string query param like:
			// 'C0001:1,C0003:1,C0002:1,C0004:1'
			// Into an object key pair like:
			/**
				{
					C0001: "1",
					C0002: "1",
					C0003: "1",
					C0004: "1"
				}
				*/
			const arrayOfGroupValues = acceptedCookieGroupsString.split(',').map(item => item.split(':'));
			const queryObject = {};
			arrayOfGroupValues.forEach(item => {
				// eslint-disable-next-line prefer-destructuring
				queryObject[item[0]] = item[1];
			});

			if (queryObject.C0002 === '1' || queryObject.C0003 === '1' || queryObject.C0004 === '1') {
				return true;
			}
		}
		return false;
	};
	if (userHasAcceptedCookies(acceptedCookieGroups)) {
		// If groups exist fire global event.
		const event = new CustomEvent('oneTrustAccepted', { detail: { groups: acceptedCookieGroups } });
		// Dispatch the event.
		window.dispatchEvent(event);
	}
}

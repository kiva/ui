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

/**
 * Well-known giving fund IDs, keyed by fund identity.
 */
export const givingFundIds = {
	// Colombia earthquake recovery (disaster relief) fund, MP-3121
	// https://www.kiva.org/gf/238fe077-033e-4a59-8d11-e571e6e4ed31
	COLOMBIA_DISASTER_RELIEF: '238fe077-033e-4a59-8d11-e571e6e4ed31',
};

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

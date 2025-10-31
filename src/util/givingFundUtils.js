/**
 * Utility method for parsing newly created giving fund cookie data
 * This cookie is generated when guests create a giving fund
 * Cookie format: gfid|uiv|action
 */
export default function parseGivingFundCookie(cookieString) {
	if (!cookieString) {
		return {};
	}

	const [fundId, uiv, action] = cookieString.split('|');

	return {
		fundId: fundId || null,
		uiv: uiv || null,
		action: action || null,
	};
}

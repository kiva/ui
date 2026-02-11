export const BANNER_COOKIE_NAME = 'showPromoCreditPill';
export const KIVA_LENDING_CREDIT_COOKIE_NAME = 'kiva_lending_credit';

export const setPromoCreditBannerCookie = cookieStore => {
	cookieStore.set(BANNER_COOKIE_NAME, 'true', { path: '/' });
};

export const clearPromoCreditBannerCookie = cookieStore => {
	cookieStore.remove(BANNER_COOKIE_NAME, { path: '/' });
};

export const getPromoCreditBannerCookie = cookieStore => {
	return cookieStore.get(BANNER_COOKIE_NAME);
};

export const getKivaLendingCreditCookie = cookieStore => {
	const value = cookieStore.get(KIVA_LENDING_CREDIT_COOKIE_NAME);
	if (!value) return 0;

	try {
		// Cookie value is URL-encoded JSON: {"amount":25,"campaign_id":null}
		const decoded = decodeURIComponent(value);
		const parsed = JSON.parse(decoded);

		// If parsed result is an object with amount field, use that
		if (parsed && typeof parsed === 'object' && 'amount' in parsed) {
			const amount = parseFloat(parsed.amount);
			return !Number.isNaN(amount) && amount > 0 ? amount : 0;
		}

		// If parsed result is a plain number (backwards compatibility)
		const numValue = parseFloat(parsed);
		return !Number.isNaN(numValue) && numValue > 0 ? numValue : 0;
	} catch (error) {
		// If JSON parsing fails entirely, try treating value as plain number
		const numValue = parseFloat(value);
		return !Number.isNaN(numValue) && numValue > 0 ? numValue : 0;
	}
};

export const clearKivaLendingCreditCookie = cookieStore => {
	cookieStore.remove(KIVA_LENDING_CREDIT_COOKIE_NAME, { path: '/' });
};

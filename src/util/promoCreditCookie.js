export const BANNER_COOKIE_NAME = 'showPromoCreditPill';

export const setPromoCreditBannerCookie = cookieStore => {
	cookieStore.set(BANNER_COOKIE_NAME, 'true', { path: '/' });
};

export const clearPromoCreditBannerCookie = cookieStore => {
	cookieStore.remove(BANNER_COOKIE_NAME, { path: '/' });
};

export const getPromoCreditBannerCookie = cookieStore => {
	return cookieStore.get(BANNER_COOKIE_NAME);
};

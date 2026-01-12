import { hasBasketExpired } from '#src/util/basketUtils';

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

export const shouldShowPromoCreditBanner = (cookieStore, basket) => {
	const hasCookie = getPromoCreditBannerCookie(cookieStore) === 'true';
	const basketExists = basket && basket.id;
	const basketNotExpired = basketExists && !hasBasketExpired(basket);
	return hasCookie && basketNotExpired;
};

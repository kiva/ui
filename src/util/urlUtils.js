/**
 * Global exclude list for promoation banners + disclaimers
 */
export const globalBannerDenyList = [
	'/checkout',
	'/confirm-instant-donation/*',
	'/donate/support-kiva',
	'/error',
	'/instant-donation-thanks/*',
	'/instant-lending-error',
	'/join-team',
	'/register/social',
	'/possibility/giving-tuesday',
	'/possibility/12-days-of-lending',
	'/possibility/year-end',
	'/process-instant-lending/*',
];

/**
 * Check the current route against a list of restricted url fragments
 *
 * @param {array} urlArray - Array of Url path fragments
 * @param {string} route - target url to check against
 * @returns {boolean}
 */
export function isExcludedUrl(urlArray, route) {
	let excludeUrl = false;
	urlArray.forEach(url => {
		// match specific urls
		if (url === route) {
			excludeUrl = true;
		}
		const urlFragment = url.replace('/*', '');
		// match wildcard urls
		if (url.indexOf('/*') !== -1 && route.indexOf(urlFragment) !== -1) {
			excludeUrl = true;
		}
	});
	return excludeUrl;
}

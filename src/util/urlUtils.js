/**
 * Global exclude list for promotion banners + disclaimers
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

/**
 * Given a base url and query params in the form of object key value pair, return a fully formed url
 *
 * @param {string} base - The base url string
 * @param {string} args - query params in the form of object key value pairs
 * @returns {string}
 */
export function getFullUrl(base, args) {
	if (!args || Object.keys(args).length === 0) return base;

	// remove hash portion of url if present
	const baseUrlWithoutHash = base.split('#')[0];
	const hashParams = base.split('#')[1] ? `#${base.split('#')[1]}` : '';
	const querystring = Object.keys(args)
		.filter(key => {
			return !!args[key];
		})
		.map(key => {
			return `${key}=${encodeURIComponent(args[key])}`;
		})
		.join('&');
	return `${baseUrlWithoutHash}${querystring ? `?${querystring}` : ''}${hashParams}`;
}

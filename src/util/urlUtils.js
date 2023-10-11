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

function matchRoute(route, pattern) {
	// Match specific urls
	if (pattern === route) {
		return true;
	}
	// Match wildcard urls
	const fragment = pattern.replace('/*', '');
	if (pattern.includes('/*') && route.includes(fragment)) {
		return true;
	}
	return false;
}

/**
 * Check the current route against a list of restricted url fragments
 *
 * @param denyUrls Array of Url path fragments to exclude
 * @param allowUrls Array of Url path fragments to include
 * @param route Target url to check against
 * @returns Whether the URL is excluded
 */
export function isExcludedUrl(denyUrls, allowUrls, route) {
	if (allowUrls.length) {
		return !allowUrls.some(url => matchRoute(route, url));
	}
	return denyUrls.some(url => matchRoute(route, url));
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

/**
 * checks and compares on if the page is a Corporate Campaign Page
 *
 * @param {Object}
 * @returns {String}
 */

export function isCCPage(
	route = {}
) {
	// Fetch route path
	return route.path?.substring(0, 4) === '/cc/';
}

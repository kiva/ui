/**
 * Check the current route against a list of restricted url fragments
 *
 * @param {array} urlArray - Array of Url path fragments
 * @param {string} route - target url to check against
 * @returns {boolean}
 */
export default function isExcludedUrl(urlArray, route) {
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

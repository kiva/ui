/**
 * checks if there page is a Corporate Campaign Page
 *
 * @param {Object}
 * @returns {String}
 */

export default function isCCPage(
	route = {}
) {
	// Fetch route path
	return route.path.substring(0, 4) === '/cc/';
}

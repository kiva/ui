const { info } = require('../../util/log');

// Get route paths from vue-router route definitions.
// Recursively searches children and ignores any route (and children of that route)
// with "excludeFromStaticSitemap: true" in the meta object.
function getRoutes(haystack, root = '') {
	return haystack
		// Remove excluded routes
		.filter(route => !route.meta?.excludeFromStaticSitemap)
		.map(route => {
			// ensure route path starts with '/'
			const routePath = route.path.startsWith('/') ? route.path : `/${route.path}`;
			// combine root with the route path to get the full path
			const fullPath = `${root}${routePath}`;
			// recursively call getRoutes for all the children
			if (route.children) {
				// this array will be falttened after this map function
				return [fullPath, ...getRoutes(route.children, fullPath)];
			}
			return fullPath;
		})
		// Flatten array to bring routes from children up to the same level as the parents
		.flat();
}

// This sitemap generator reads the vue-router route definitions and
// adds a sitemap url for every route that is not excluded.
module.exports = async function staticRouteGenerator() {
	// get route definitions
	info('Sitemap: staticRouteGenerator: loading routes definition file');
	const { default: allRoutes } = await import('../../../src/router/routes.js');
	// turn route definitions into array of path strings
	const routes = getRoutes(allRoutes);
	info('Sitemap: staticRouteGenerator: found routes', { routes });
	return routes;
};

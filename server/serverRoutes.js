/*
	Middleware to expose available routes at the /routes endpoint
	TODO: Run process on server start to write extracted routes json to file then serve that
*/
const fs = require('fs');
const path = require('path');

function buildRouteJSON () {
	// Pull in Route Declarations as a string so import statements aren't attempted
	const routesAsString = fs.readFileSync(path.resolve(__dirname, '../src/router/routes.js'), 'utf-8');
	// Clean out the arrow functions and imports used for code-splitting routes in vue
	const cleanedRoutes = routesAsString.replace('module.exports =', '').replace(/[()@;=>]/g, '').replace(/import/g, '');
	// re-establish a js array from our cleaned string
	const routeObject = eval(cleanedRoutes);
	// map routes array into valid JSON syntax
	const routes = routeObject.map(function(route) {
		return {
			"path": route.path ? route.path : 'no-path',
			"name": route.name ? route.name : 'no-name',
			"status": route.status ? route.status : 'no-status',
			"componentPath": route.component ? route.component : 'no-component'
		};
	});
	// return routes as array
	return routes;
};

module.exports = function(req, res, next) {
	console.log('server routes middle ware');
	res.json(buildRouteJSON());
}

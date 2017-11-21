/*
	Middleware to expose available routes at the /routes endpoint
	TODO: Run process on server start to write extracted routes json to file then serve that
*/
const fs = require('fs');
const path = require('path');

const vuejsRouteFile = '../src/router/routes.js';
const extractedRouteFileName = 'available-routes.json';

/*
 * Extract Routes as formatted for Vue Router, removing async function calls and converting them into a valid json object.
 */
function buildRouteJSON () {
	// Pull in Route Declarations as a string so import statements aren't attempted
	const routesAsString = fs.readFileSync(path.resolve(__dirname, vuejsRouteFile), 'utf-8');
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

// Attempt to write json file to filesystem
try {
	let availableRoutesJSON = buildRouteJSON();

	fs.writeFileSync(path.resolve(__dirname, extractedRouteFileName), JSON.stringify(availableRoutesJSON), (err) => {
		if (err) {
			console.log(err);
		}
		// TODO: Convert to Log Statement
		console.log('Routes written to ' + extractedRouteFileName);
	});

} catch (err) {
	// TODO: Convert to Log Statement
	console.log('Failed to create and write routes json file.');
	console.log(err);
}

module.exports = function(req, res, next) {
	if (fs.existsSync(path.resolve(__dirname, extractedRouteFileName))) {
		res.sendFile(path.resolve(__dirname, extractedRouteFileName), function (err) {
			if (err) {
				console.log(err);
			} else {
				// TODO: Convert to Log Statement
				console.log('Sent generated file (' + extractedRouteFileName + ') from the file system.');
			}
		});
	} else {
		res.json(buildRouteJSON());
		// TODO: Convert to Log Statement
		console.log('Available routes json served directly from buildRouteJSON method.')
	}
}

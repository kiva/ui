import fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const vuejsRouteFile = '../src/router/routes.js';

/*
 * Extract Routes as formatted for Vue Router
 * removing async function calls and converting them into a valid json object.
 */
function buildRouteJSON() {
	// Pull in Route Declarations as a string so import statements aren't attempted
	const routesAsString = fs.readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), vuejsRouteFile), 'utf-8');
	// Clean out the arrow functions and imports used for code-splitting routes in vue
	// re-establish a js array from our cleaned string
	const matchPaths = /path:\s'([^']*)'/g;
	let myArray = [];
	const paths = [];
	// eslint-disable-next-line
	while ((myArray = matchPaths.exec(routesAsString)) !== null) {
		const msg = `${myArray[0]}`;
		const pathOnly = msg.replace(/(path:\s)/, '');
		const cleanString = pathOnly.replace(/'/g, '');
		if (cleanString !== '*' && cleanString !== '' && cleanString.indexOf('/') === 0) {
			paths.push(cleanString);
		}
	}
	// add /static path and anything against it to allow initial calls for static assets
	paths.push('/static/:any');
	// add paths for auth0 implementation
	paths.push('/error');
	paths.push('/ui-login');
	paths.push('/ui-logout');
	paths.push('/process-ssr-auth');
	// add path for time synchronization
	paths.push('/timesync');
	// add paths for healthcheck
	paths.push('/healthcheck');
	// add paths for sitemap
	paths.push('/sitemaps/ui.xml');

	return paths;
}

export default (req, res) => {
	res.set('Cache-Control', 'no-cache, no-store, max-age=0, no-transform, private');
	res.json(buildRouteJSON());
};

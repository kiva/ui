const fs = require('fs');
const path = require('path');
const { createBundleRenderer } = require('vue-server-renderer');
const clearCachedVueModule = require('./util/clearCachedVueModule');
const getGqlFragmentTypes = require('./util/getGqlFragmentTypes');
const getCookies = require('./util/getCookies');
const vueSsrCache = require('./util/vueSsrCache');

const isProd = process.env.NODE_ENV === 'production';

// vue-middleware specific error handling
function handleError(err, req, res, next) {
	// redirect to url if provided in the error
	// -> this is how we handle vue-router links to external kiva pages
	if (err.url) {
		res.redirect(err.url);
	// respond with 404 specifically set
	} else if (err.code === 404) {
		res.status(404).send('404 | Page Not Found');

		// TOOO: consider sending to Kiva 404
		// res.redirect('/error.html?url='+ req.url.replace('/', '') +&status=404');
	} else {
		// Pass all other errors out to generalized handlers
		next(err, req, res, next);
	}
}

module.exports = function createMiddleware({
	serverBundle,
	clientManifest,
	config,
	cache
}) {
	const template = fs.readFileSync(path.resolve(__dirname, 'index.template.html'), 'utf-8');

	if (typeof config === 'undefined' || typeof config.app === 'undefined') {
		throw new TypeError('Missing configuration');
	}

	// Set webpack public asset path based on configuration
	// eslint-disable-next-line no-param-reassign
	clientManifest.publicPath = config.app.publicPath || '/';

	// Create single renderer to be used by all requests
	const renderer = createBundleRenderer(serverBundle, {
		cache: vueSsrCache(cache),
		template,
		clientManifest,
		runInNewContext: false,
		inject: false,
		// don't prefetch anything
		shouldPrefetch: () => false,
	});

	return function middleware(req, res, next) {
		const s = Date.now();

		const context = {
			url: req.url,
			config: config.app,
			user: req.user || {},
			locale: req.locale,
		};

		const { graphqlUri, sessionUri } = config.server;

		// set html response headers
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

		// get graphql api fragment types for the graphql client
		const typesPromise = getGqlFragmentTypes(graphqlUri, cache);

		// get cookies for this request including new session cookies
		const cookiePromise = getCookies({ req, res, sessionUri });

		if (!isProd) {
			typesPromise.then(() => console.info(JSON.stringify({
				meta: {},
				level: 'info',
				message: `fragment fetch: ${Date.now() - s}ms`
			})));
			cookiePromise.then(() => console.info(JSON.stringify({
				meta: {},
				level: 'info',
				message: `session fetch: ${Date.now() - s}ms`
			})));
		}

		Promise.all([typesPromise, cookiePromise])
			.then(([types, cookies]) => {
				// add fetched types to rendering context
				context.config.graphqlFragmentTypes = types;
				// add Cookie instance to rendering context
				context.cookies = cookies;
				// Clear module cache of global Vue instance to ensure clean render
				clearCachedVueModule();
				// render the app
				return renderer.renderToString(context);
			}).then(html => {
				// send the final rendered html
				res.send(html);
				if (!isProd) {
					console.info(JSON.stringify({
						meta: {},
						level: 'info',
						message: `whole request: ${Date.now() - s}ms`
					}));
				}
			}).catch(err => {
				handleError(err, req, res, next);
			});
	};
};

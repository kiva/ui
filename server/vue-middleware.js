const fs = require('fs');
const path = require('path');
const cookie = require('cookie');
const { createBundleRenderer } = require('vue-server-renderer');
const clearCachedVueModule = require('./util/clearCachedVueModule');
const getGqlFragmentTypes = require('./util/getGqlFragmentTypes');
const getSessionCookies = require('./util/getSessionCookies');
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

	// Create single renderer to be used be all requests
	const renderer = createBundleRenderer(serverBundle, {
		cache: vueSsrCache(cache),
		template,
		clientManifest,
		runInNewContext: false,
		inject: false,
		shouldPrefetch: () => false,
	});

	return function middleware(req, res, next) {
		const s = Date.now();

		const cookies = cookie.parse(req.headers.cookie || '');

		const context = {
			url: req.url,
			config: config.app,
			cookies,
			user: req.user || {},
		};

		res.setHeader('Content-Type', 'text/html');

		// get graphql api fragment types for the graphql client
		const typesPromise = getGqlFragmentTypes(config.server.graphqlUri, cache);

		// fetch initial session cookies in case starting session with this request
		const cookiePromise = getSessionCookies(config.server.sessionUri, cookies);

		if (!isProd) {
			typesPromise.then(() => console.log(`fragment fetch: ${Date.now() - s}ms`));
			cookiePromise.then(() => console.log(`session fetch: ${Date.now() - s}ms`));
		}

		Promise.all([typesPromise, cookiePromise])
			.then(([types, cookieInfo]) => {
				// add fetched types to rendering context
				context.config.graphqlFragmentTypes = types;
				// update cookies in the rendering context with any newly fetched session cookies
				context.cookies = Object.assign(context.cookies, cookieInfo.cookies);
				// forward any newly fetched 'Set-Cookie' headers
				cookieInfo.setCookies.forEach(setCookie => res.append('Set-Cookie', setCookie));
				// Clear module cache of global Vue instance to ensure clean render
				clearCachedVueModule();
				// render the app
				return renderer.renderToString(context);
			}).then(html => {
				// set any cookies created during the app render
				context.setCookies.forEach(setCookie => res.append('Set-Cookie', setCookie));
				// send the final rendered html
				res.send(html);
				if (!isProd) {
					console.log(`whole request: ${Date.now() - s}ms`);
				}
			}).catch(err => {
				if (err.url) {
					// since this error is a redirect, set any cookies created during the app render
					context.setCookies.forEach(setCookie => res.append('Set-Cookie', setCookie));
				}
				handleError(err, req, res, next);
			});
	};
};

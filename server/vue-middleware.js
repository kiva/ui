const fs = require('fs');
const path = require('path');
const Bowser = require('bowser');
const cookie = require('cookie');
const { createBundleRenderer } = require('vue-server-renderer');
const getGqlPossibleTypes = require('./util/getGqlPossibleTypes');
const getSessionCookies = require('./util/getSessionCookies');
const vueSsrCache = require('./util/vueSsrCache');
const tracer = require('./util/ddTrace');

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

	function middleware(req, res, next) {
		const s = Date.now();

		const cookies = cookie.parse(req.headers.cookie || '');
		const userAgent = req.get('user-agent');
		const device = userAgent ? Bowser.getParser(userAgent).parse().parsedResult : null;

		const context = {
			url: req.url,
			config: config.app,
			cookies,
			user: req.user || {},
			locale: req.locale,
			device
		};

		// set html response headers
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

		// get graphql api possible types for the graphql client
		const typesPromise = getGqlPossibleTypes(config.server.graphqlUri, cache);

		// fetch initial session cookies in case starting session with this request
		const cookiePromise = getSessionCookies(config.server.sessionUri, cookies);

		if (!isProd) {
			typesPromise.then(() => console.info(JSON.stringify({
				meta: {},
				level: 'info',
				message: `types fetch: ${Date.now() - s}ms`
			})));
			cookiePromise.then(() => console.info(JSON.stringify({
				meta: {},
				level: 'info',
				message: `session fetch: ${Date.now() - s}ms`
			})));
		}

		Promise.all([typesPromise, cookiePromise])
			.then(([types, cookieInfo]) => {
				// add fetched types to rendering context
				context.config.graphqlPossibleTypes = types;
				// update cookies in the rendering context with any newly fetched session cookies
				context.cookies = Object.assign(context.cookies, cookieInfo.cookies);
				// forward any newly fetched 'Set-Cookie' headers
				cookieInfo.setCookies.forEach(setCookie => res.append('Set-Cookie', setCookie));
				// render the app
				return tracer.trace('renderer.renderToString', () => renderer.renderToString(context));
			}).then(html => {
				// set any cookies created during the app render
				context.setCookies.forEach(setCookie => res.append('Set-Cookie', setCookie));
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
				if (err.url) {
					// since this error is a redirect, set any cookies created during the app render
					if (context && context.setCookies) {
						context.setCookies.forEach(setCookie => res.append('Set-Cookie', setCookie));
					}
				}
				handleError(err, req, res, next);
			});
	}

	return tracer.wrap('vue-middleware', middleware);
};

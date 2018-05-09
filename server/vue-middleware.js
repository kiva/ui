const fs = require('fs');
const path = require('path');
const cookie = require('cookie');
const { createBundleRenderer } = require('vue-server-renderer');
const { getCache } = require('./util/initMemcached');
const Raven = require('raven');
const getGqlFragmentTypes = require('./util/getGqlFragmentTypes');
const getSessionCookies = require('./util/getSessionCookies');

const isProd = process.env.NODE_ENV === 'production';

function handleError(err, req, res) {
	if (err.url) {
		res.redirect(err.url);
	} else if (err.code === 404) {
		res.status(404).send('404 | Page Not Found');
		// Passing the error over to Raven.
		Raven.captureException(err);

		// TOOO: consider sending to Kiva 404
		// res.redirect('/error.html?url='+ req.url.replace('/', '') +&status=404');
	} else {
		// Render Error Page or Redirect
		res.status(500).send('500 | Internal Server Error');
		// Passing the error over to Raven.
		Raven.captureException(err);

		console.error(`Error during render : ${req.url}`);
		console.error(err);
	}
}

module.exports = function createMiddleware({ serverBundle, clientManifest, config }) {
	const template = fs.readFileSync(path.resolve(__dirname, 'index.template.html'), 'utf-8');

	if (typeof config === 'undefined' || typeof config.app === 'undefined') {
		throw new TypeError('Missing configuration');
	}

	// Get the cache instance
	const cache = getCache();

	return function middleware(req, res) {
		console.log('---------> rendering server');
		const s = Date.now();

		// Set webpack public asset path based on configuration
		// eslint-disable-next-line no-param-reassign
		clientManifest.publicPath = config.app.publicPath || '/';

		const renderer = createBundleRenderer(serverBundle, {
			cache,
			template,
			clientManifest,
			runInNewContext: false,
			inject: false,
		});

		const cookies = cookie.parse(req.headers.cookie || '');

		const context = {
			url: req.url,
			config: config.app,
			cookies,
		};

		res.setHeader('Content-Type', 'text/html');

		// get graphql api fragment types for the graphql client
		const typesPromise = getGqlFragmentTypes(config.server.graphqlUri);

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
				// render the app
				return renderer.renderToString(context);
			}).then(html => {
				res.send(html);
				if (!isProd) {
					console.log(`whole request: ${Date.now() - s}ms`);
				}
			}).catch(err => handleError(err, req, res));
	};
};

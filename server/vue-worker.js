const { createBundleRenderer } = require('vue-server-renderer');
const { workerData } = require('worker_threads');
const workerpool = require('workerpool');
const initCache = require('./util/initCache');
const log = require('./util/log');
const vueSsrCache = require('./util/vueSsrCache');
const getGqlPossibleTypes = require('./util/getGqlPossibleTypes');
const getSessionCookies = require('./util/getSessionCookies');

const {
	clientManifest,
	serverBundle,
	serverConfig,
	template,
} = workerData;

const isProd = process.env.NODE_ENV === 'production';
const cache = initCache(serverConfig);

// create a new renderer instance
const renderer = createBundleRenderer(serverBundle, {
	cache: vueSsrCache(cache),
	template,
	clientManifest,
	runInNewContext: false,
	inject: false,
	// don't prefetch anything
	shouldPrefetch: () => false,
});

async function render(context) {
	const s = Date.now();

	// get graphql api possible types for the graphql client
	const typesPromise = getGqlPossibleTypes(serverConfig.graphqlUri, cache)
		.finally(() => {
			if (!isProd) {
				log.info(`fragment fetch: ${Date.now() - s}ms`);
			}
		});

	// fetch initial session cookies in case starting session with this request
	const cookiePromise = getSessionCookies(serverConfig.sessionUri, context.cookies)
		.finally(() => {
			if (!isProd) {
				log.info(`session fetch: ${Date.now() - s}ms`);
			}
		});

	let setCookies = [];

	return Promise.all([typesPromise, cookiePromise])
		.then(([types, cookieInfo]) => {
			// add fetched types to rendering context
			context.config.graphqlPossibleTypes = types;
			// update cookies in the rendering context with any newly fetched session cookies
			context.cookies = Object.assign(context.cookies, cookieInfo.cookies);
			// collect any newly fetched 'Set-Cookie' headers to send after the render
			setCookies = [...cookieInfo.setCookies];
			// render the app
			return renderer.renderToString(context);
		})
		.then(html => {
			// collect any cookies created during the app render
			const contextSetCookies = context?.setCookies ?? [];
			setCookies = [...setCookies, ...contextSetCookies];
			// send the final rendered html
			return {
				html,
				setCookies,
			};
		})
		.catch(err => {
			// collect any cookies created during the app render
			const contextSetCookies = context?.setCookies ?? [];
			setCookies = [...setCookies, ...contextSetCookies];
			// send the error
			return {
				error: err,
				// only send cookies if there is a redirect url
				setCookies: err.url ? setCookies : [],
			};
		})
		.finally(() => {
			if (!isProd) {
				log.info(`whole request: ${Date.now() - s}ms`);
			}
		});
}

workerpool.worker({
	render,
});

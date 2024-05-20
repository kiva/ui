import initCache from './util/initCache.js';
import { info } from './util/log.js';
import vueSsrCache from './util/vueSsrCache.js';
import getGqlPossibleTypes from './util/getGqlPossibleTypes.js';
import getSessionCookies from './util/getSessionCookies.js';

const isProd = process.env.NODE_ENV === 'production';

let cache;

export default async function render({
	context,
	serverConfig,
	serverEntry,
	// TODO: use ssrManifest to determine which modules to preload
	// ssrManifest,
	template
}) {
	const s = Date.now();

	// if cache is not initialized, initialize it
	if (!cache) {
		cache = vueSsrCache(initCache(serverConfig));
	}

	// get graphql api possible types for the graphql client
	const typesPromise = getGqlPossibleTypes(serverConfig.graphqlUri, cache)
		.finally(() => {
			if (!isProd) {
				info(`fragment fetch: ${Date.now() - s}ms`);
			}
		});

	// fetch initial session cookies in case starting session with this request
	const cookiePromise = getSessionCookies(serverConfig.sessionUri, context.cookies)
		.finally(() => {
			if (!isProd) {
				info(`session fetch: ${Date.now() - s}ms`);
			}
		});

	let setCookies = [];
	try {
		const [types, cookieInfo] = await Promise.all([typesPromise, cookiePromise]);
		// add fetched types to rendering context
		context.config.graphqlPossibleTypes = types;
		// update cookies in the rendering context with any newly fetched session cookies
		context.cookies = Object.assign(context.cookies, cookieInfo.cookies);
		// collect any newly fetched 'Set-Cookie' headers to send after the render
		setCookies = [...cookieInfo.setCookies];
		// render the app
		context.template = template;
		const { html, setCookies: appSetCookies } = await serverEntry(context);
		// collect any cookies created during the app render
		setCookies = [...setCookies, ...appSetCookies];
		info('modules', context.modules);
		// send the final rendered html
		return {
			html,
			setCookies,
		};
	} catch (err) {
		// collect any cookies created during the app render
		const contextSetCookies = context?.setCookies ?? [];
		setCookies = [...setCookies, ...contextSetCookies];
		// send the error
		return {
			error: err,
			// only send cookies if there is a redirect url
			setCookies: err.url ? setCookies : [],
		};
	} finally {
		if (!isProd) {
			info(`whole request: ${Date.now() - s}ms`);
		}
	}
}

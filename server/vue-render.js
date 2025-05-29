import ESI from 'nodesi';
import { getCookieHeader } from './util/cookies.js';
import initCache from './util/initCache.js';
import { info } from './util/log.js';
import getGqlPossibleTypes from './util/getGqlPossibleTypes.js';

const isProd = process.env.NODE_ENV === 'production';

let cache;
let esi;

// Only resolve ESI tags if not in production
if (!isProd) {
	esi = new ESI();
}

export default async function render({
	context,
	serverConfig,
	serverEntry,
	ssrManifest,
	template
}) {
	const processESITags = esi && !context.esi;

	// if cache is not initialized, initialize it
	if (!cache) {
		cache = initCache(serverConfig);
	}

	// get graphql api possible types for the graphql client
	const s = Date.now();
	const typesPromise = getGqlPossibleTypes(serverConfig.graphqlUri, cache)
		.finally(() => {
			if (!isProd) {
				info(`fragment fetch: ${Date.now() - s}ms`);
			}
		});

	try {
		// add fetched types to rendering context
		const types = await typesPromise;
		context.config.graphqlPossibleTypes = types;

		// render the app
		context.template = template;
		context.ssrManifest = ssrManifest;
		const { html, setCookies } = await serverEntry(context);

		// if using ESI, process the html to resolve ESI tags
		const finalHtml = processESITags ? await esi.process(html, {
			baseUrl: `http://localhost:${serverConfig.port}`,
			headers: {
				Cookie: getCookieHeader(context.cookies),
				'Fastly-Top-Url': context.url,
			},
		}) : html;

		// send the final rendered html
		return {
			html: finalHtml,
			setCookies,
		};
	} catch (err) {
		// collect any cookies created during the app render
		const setCookies = context?.setCookies ?? [];
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

import { parentPort, workerData } from 'worker_threads';
import initCache from '../util/initCache.js';
import { info } from '../util/log.js';
import { getFromCache, setToCache } from '../util/memJsUtils.js';
import * as generators from './generators/index.js';

const {
	appConfig,
	serverConfig,
	CACHE_TTL,
} = workerData;

const cache = initCache(serverConfig);

// Generate route list from scratch by invoking all generators in ./generators
async function generateRoutes() {
	// invoke all generators
	const invokedGenerators = Object.keys(generators).map(name => {
		info(`Sitemap: invoking ${name} generator`);
		return generators[name]();
	});
	// wait for generators to complete
	const results = await Promise.all(invokedGenerators);
	// remove duplicate routes
	const uniqueResults = [...new Set(results.flat())];
	// return sorted routes
	return uniqueResults.sort();
}

// Create sitemap, using <host> for all url hostnames
async function createSitemap(host) {
	// include xml sitemap header
	let sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

	// add absolute URL for each route to the sitemap
	const routes = await generateRoutes();
	routes.forEach(route => {
		sitemap += `<url><loc>https://${host}${route}</loc></url>`;
	});

	// include sitemap footer
	sitemap += '</urlset>';

	return sitemap;
}

// Get the sitemap for a given <config>
async function getSitemap() {
	const { host } = appConfig;

	// check for & return cached version
	const cacheKey = `ui-xml-sitemap-${host}`;
	const sitemapFromCache = await getFromCache(cacheKey, cache);
	if (sitemapFromCache) {
		info(`Sitemap: returning cached sitemap ${cacheKey}`, { sitemapFromCache });
		parentPort.postMessage({ sitemap: sitemapFromCache });
		return;
	}

	// otherwise create sitemap and cache it
	const sitemap = await createSitemap(host);
	info(`Sitemap: caching sitemap ${cacheKey}`, { sitemap });
	await setToCache(cacheKey, sitemap, CACHE_TTL, cache);
	parentPort.postMessage({ sitemap });
}

getSitemap();

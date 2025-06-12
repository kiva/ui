import fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import Bowser from 'bowser';
import cookie from 'cookie';
import vueWorkerPool from './vue-worker-pool.js';
import vueRender from './vue-render.js';
import protectedRoutes from './util/protectedRoutes.js';
import { wrap } from './util/mockTrace.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

// vue-middleware specific error handling
function handleError(err, req, res, next) {
	// redirect to url if provided in the error
	// -> this is how we handle vue-router links to external kiva pages
	if (err.url) {
		res.redirect(err.code ?? 302, err.url);
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

export default function createMiddleware({ config, vite }) {
	if (typeof config === 'undefined' || typeof config.app === 'undefined') {
		throw new TypeError('Missing configuration');
	}

	let ssrManifest = {};
	let template = '';
	if (!vite) {
		ssrManifest = JSON.parse(fs.readFileSync(resolve(__dirname, '../dist/client/.vite/ssr-manifest.json')));
		template = fs.readFileSync(resolve(__dirname, '../dist/client/index.html'), 'utf-8');
	} else {
		template = fs.readFileSync(resolve(__dirname, '../index.html'), 'utf-8');
	}

	// Set webpack public asset path based on configuration
	// clientManifest.publicPath = config.app.publicPath || '/';

	let render;
	if (!vite) {
		// Create a worker pool to render the app for production
		const pool = vueWorkerPool({
			idleTimeout: config.server.vueWorkerIdleTimeout,
			minWorkers: config.server.minVueWorkers,
			maxWorkers: config.server.maxVueWorkers,
			recordTiming: config.server.vueWorkerRecordTiming,
			workerData: {
				ssrManifest,
				serverConfig: config.server,
				template,
			},
		});
		render = context => pool.run(context);
	} else {
		// Create dev server render function
		render = async context => {
			const t = await vite.transformIndexHtml(context.url, template);
			const { default: serverEntry } = await vite.ssrLoadModule('#src/server-entry.js');
			return vueRender({
				context,
				serverConfig: config.server,
				serverEntry,
				template: t,
			});
		};
	}

	async function middleware(req, res, next) {
		// Get cookies from the request
		const cookies = cookie.parse(req.get('Cookie') || '');

		// Get device information from the user agent
		const userAgent = req.get('User-Agent');
		const device = userAgent ? Bowser.getParser(userAgent).parse().parsedResult : null;

		// Get ESI information from the request
		const esiTag = req.url.match(/\/esi-ui\/(.*)/)?.[1];
		const topUrl = req.get('Fastly-Top-Url');
		const esi = esiTag && topUrl ? {
			tagName: esiTag,
			topUrl,
		} : null;

		// Check if CDN indicates that the user is logged in
		const cdnNotedLoggedIn = config.server.simulateCDN
			// If simulating CDN, check login sync cookie
			? cookies.kvls && cookies.kvls !== 'o'
			// If not simulating CDN, check Fastly header
			: req.get('Fastly-Noted-Logged-In') === 'true';

		// Setup rendering context
		const context = {
			url: req.url,
			esi,
			config: config.app,
			kivaUserAgent: config.server.userAgent,
			cookies,
			user: req.user || {},
			locale: req.locale,
			device,
			cdnNotedLoggedIn,
		};

		// set html response headers
		res.setHeader('Content-Type', 'text/html');
		// Set strict cache-control headers for protected pages
		if (req?.url && protectedRoutes.filter(route => {
			return req?.url?.indexOf(route) !== -1;
		}).length) {
			res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, no-transform, private');
		} else {
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
		}
		try {
			// render the app
			const { error, html, setCookies } = await render(context);
			// set any cookies created during the app render
			setCookies?.forEach(setCookie => res.append('Set-Cookie', setCookie));
			if (error) {
				handleError(error, req, res, next);
			} else {
				// send the final rendered html
				res.send(html);
			}
		} catch (err) {
			handleError(err, req, res, next);
		}
	}

	return wrap('vue-middleware', middleware);
}

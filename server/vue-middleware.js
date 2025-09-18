import fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import Bowser from 'bowser';
import cookie from 'cookie';
import { HOME_PAGE_EXPERIMENT_HEADER } from '../src/util/experiment/fastlyExperimentUtils.js';
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
			forceHeader: req.headers[HOME_PAGE_EXPERIMENT_HEADER.toLowerCase()],
		};

		// set html response headers
		res.setHeader('Content-Type', 'text/html');

		try {
			// render the app
			const {
				cdnHeaders,
				error,
				html,
				setCookies
			} = await render(context);
			// set any cookies created during the app render
			setCookies?.forEach(setCookie => res.append('Set-Cookie', setCookie));
			// handle any errors
			if (error) {
				handleError(error, req, res, next);
			} else {
				if (req?.url && protectedRoutes.some(route => {
					return req?.url?.indexOf(route) !== -1;
				})) {
					// Set strict cache-control headers for protected pages
					res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, no-transform, private');
				} else {
					// Don't cache pages in the browser
					res.setHeader('Cache-Control', 'max-age=0');
					// Set CDN caching headers
					if (cdnHeaders) {
						Object.keys(cdnHeaders).forEach(headerName => {
							res.setHeader(headerName, cdnHeaders[headerName]);
						});
						// Delete the session object for this request so that session changes are not saved and no
						// session cookie is sent in the response. To cache in the CDN we must not set any cookies, but
						// a session cookie will be created if a session was created or regenerated in this request.
						delete req.session;
					}
				}

				// send the final rendered html
				res.send(html);
			}
		} catch (err) {
			handleError(err, req, res, next);
		}
	}

	return wrap('vue-middleware', middleware);
}

const fs = require('fs');
const path = require('path');
const { Worker, SHARE_ENV } = require('worker_threads');
const Bowser = require('bowser');
const cookie = require('cookie');
const log = require('./util/log');
const protectedRoutes = require('./util/protectedRoutes.js');
const tracer = require('./util/ddTrace');

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

module.exports = function createMiddleware({
	serverBundle,
	clientManifest,
	config,
}) {
	const template = fs.readFileSync(path.resolve(__dirname, 'index.template.html'), 'utf-8');

	if (typeof config === 'undefined' || typeof config.app === 'undefined') {
		throw new TypeError('Missing configuration');
	}

	// Set webpack public asset path based on configuration
	// eslint-disable-next-line no-param-reassign
	clientManifest.publicPath = config.app.publicPath || '/';

	function middleware(req, res, next) {
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
		// Set strict cache-control headers for protected pages
		if (req?.url && protectedRoutes.filter(route => {
			return req?.url?.indexOf(route) !== -1;
		}).length) {
			res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, no-transform, private');
		} else {
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
		}

		// Create a worker thread to render the app
		const worker = new Worker(path.resolve(__dirname, 'vue-worker.js'), {
			workerData: {
				clientManifest,
				context,
				serverBundle,
				serverConfig: config.server,
				template,
			},
			env: SHARE_ENV,
		});

		// Send the rendered html back to the client
		worker.on('message', ({ error, html, setCookies }) => {
			// set any cookies created during the app render
			setCookies.forEach(setCookie => res.append('Set-Cookie', setCookie));

			if (error) {
				handleError(error, req, res, next);
			} else {
				// send the final rendered html
				res.send(html);
			}
		});

		// Handle any errors that occur in the worker
		worker.on('error', err => {
			handleError(err, req, res, next);
		});

		// Handle the worker exiting
		worker.on('exit', code => {
			if (code !== 0) {
				log.error(new Error(`Worker stopped with exit code ${code}`));
			}
		});
	}

	return tracer.wrap('vue-middleware', middleware);
};

const fs = require('fs');
const path = require('path');
const Bowser = require('bowser');
const cookie = require('cookie');
const vueWorkerPool = require('./vue-worker-pool.js');
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

	// Create a worker pool to render the app
	const pool = vueWorkerPool({
		minWorkers: config.server.minVueWorkers,
		maxWorkers: config.server.maxVueWorkers,
		workerData: {
			clientManifest,
			serverBundle,
			serverConfig: config.server,
			template,
		},
	});

	function middleware(req, res, next) {
		const cookies = cookie.parse(req.headers.cookie || '');
		const userAgent = req.get('user-agent');
		const device = userAgent ? Bowser.getParser(userAgent).parse().parsedResult : null;

		// Set the first user visit to the web
		req.session.firstPage = !req.session?.firstPage ? req.url : req.session.firstPage;

		const context = {
			url: req.url,
			config: { ...config.app, firstPage: req.session?.firstPage },
			cookies,
			user: req.user || {},
			locale: req.locale,
			device,
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

		// render the app using the worker pool
		pool.exec('render', [context])
			.then(({ error, html, setCookies }) => {
				// set any cookies created during the app render
				setCookies.forEach(setCookie => res.append('Set-Cookie', setCookie));

				if (error) {
					handleError(error, req, res, next);
				} else {
					// send the final rendered html
					res.send(html);
				}
			})
			.catch(err => {
				handleError(err, req, res, next);
			});
	}

	return tracer.wrap('vue-middleware', middleware);
};

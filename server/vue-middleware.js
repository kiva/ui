const fs = require('fs');
const path = require('path');
const cookie = require('cookie');
const { createBundleRenderer } = require('vue-server-renderer');
const getGqlFragmentTypes = require('./util/getGqlFragmentTypes');

const isProd = process.env.NODE_ENV === 'production';

function handleError(err, req, res) {
	if (err.url) {
		res.redirect(err.url);
	} else if (err.code === 404) {
		res.status(404).send('404 | Page Not Found');
		// TOOO: consider sending to Kiva 404
		// res.redirect('/error.html?url='+ req.url.replace('/', '') +&status=404');
	} else {
		// Render Error Page or Redirect
		res.status(500).send('500 | Internal Server Error');
		console.error(`error during render : ${req.url}`);
		console.error(err.stack);
	}
}

module.exports = function createMiddleware({ serverBundle, clientManifest, config }) {
	const template = fs.readFileSync(path.resolve(__dirname, 'index.template.html'), 'utf-8');

	if (typeof config === 'undefined' || typeof config.server === 'undefined') {
		throw new TypeError('Missing configuration');
	}

	return function middleware(req, res) {
		console.log('---------> rendering server');
		const s = Date.now();

		const renderer = createBundleRenderer(serverBundle, {
			template,
			clientManifest,
			runInNewContext: false,
			inject: false,
		});

		const cookies = cookie.parse(req.headers.cookie || '');

		const context = {
			url: req.url,
			config: {
				graphqlUri: config.server.graphqlUri
			},
			cookies,
		};

		res.setHeader('Content-Type', 'text/html');

		getGqlFragmentTypes(config.server.graphqlUri)
			.then(types => {
				if (!isProd) {
					console.log(`fragment fetch: ${Date.now() - s}ms`);
				}
				context.config.graphqlFragmentTypes = types;
				return renderer.renderToString(context);
			})
			.then(html => {
				res.send(html);
				if (!isProd) {
					console.log(`whole request: ${Date.now() - s}ms`);
				}
			})
			.catch(err => handleError(err, req, res));
	};
};

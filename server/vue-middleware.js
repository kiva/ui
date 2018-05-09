const fs = require('fs');
const path = require('path');
const cookie = require('cookie');
const { createBundleRenderer } = require('vue-server-renderer');
const { getCache } = require('./util/initMemcached');
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
		console.error(`Error during render : ${req.url}`);
		console.error(err);
	}
}

module.exports = function createMiddleware({ serverBundle, clientManifest, config }) {
	const template = fs.readFileSync(path.resolve(__dirname, 'index.template.html'), 'utf-8');

	if (typeof config === 'undefined' || typeof config.app === 'undefined') {
		throw new TypeError('Missing configuration');
	}

	// Initialize a Cache instance, Should Only be called once!
	// initMemcached(config.server.memcachedServers.split(','), { retries: 10, retry: 10000 });
	// Get the cache, import the lib and call this to get the instance
	const cache = getCache();
	// console.log(cache);

	function handleCacheData(err, data) {
		if (err) {
			console.error('error : ');
			console.log(typeof err);
			console.log(String(err));
		}
		console.log(typeof data);
		console.log(String(data));
		// console.log(`data : ${data}`);
	}
	// c4ddd97054305e792c5ec7242799fc83
	// 9ed1963a4bc632d0b84f9f58b74b145a
	// cache.get('c4ddd97054305e792c5ec7242799fc83', handleCacheData);

	cache.set('ui-test-1', 'test content', 20000, handleCacheData);
	cache.get('ui-test-1', handleCacheData);
	cache.get('ui-gql-fragment-types', handleCacheData);
	cache.get('Kc-LoanChannel-object-11731_44', handleCacheData);

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

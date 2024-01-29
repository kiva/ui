const path = require('path');
const { Worker } = require('worker_threads');
const { info } = require('../util/log');

// Length of time that sitemap is cached in memcache, CDNs, and browsers
const CACHE_TTL = 60 * 60; // 1 hour (seconds)

// Sitemap middleware
module.exports = function sitemapMiddleware(appConfig, serverConfig) {
	return (req, res, next) => {
		// Create worker thread to generate sitemap
		const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
			workerData: {
				appConfig,
				serverConfig,
				CACHE_TTL
			},
		});

		// Send error or sitemap to client
		worker.on('message', ({ error, sitemap }) => {
			if (error) {
				return next(error);
			}
			res.setHeader('Content-Type', 'application/xml');
			res.setHeader('Cache-Control', `public, max-age=${CACHE_TTL};`);
			res.send(sitemap);
		});

		// Handle errors from worker
		worker.on('error', err => {
			next(err);
		});

		// Handle worker exit
		worker.on('exit', code => {
			if (code !== 0) {
				info(`Sitemap: worker stopped with exit code ${code}`);
			}
		});
	};
};

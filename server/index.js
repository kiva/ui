import { config as config$0 } from 'dotenv';
import cluster from 'cluster';
import http from 'http';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import locale from 'locale';
import promBundle from 'express-prom-bundle';
import { info } from './util/log.js';
import { setupTracing } from './util/tracer.js';
import serverRoutes from './available-routes-middleware.js';
import sitemapMiddleware from './sitemap/middleware.js';
import authRouter from './auth-router.js';
import sessionRouter from './session-router.js';
import timesyncRouter from './timesync-router.cjs';
import liveLoanRouter from './live-loan-router.js';
import vueMiddleware from './vue-middleware.js';
import argv from './util/argv.js';
import config, { initConfig } from './util/config.js';
import initCache from './util/initCache.js';
import { errorLogger, fallbackErrorHandler, requestLogger } from './util/errorLogger.js';
import initializeTerminus from './util/terminusConfig.js';

({ config: config$0 }.config({ path: '/etc/kiva-ui-server/config.env' }));
setupTracing();
// Initialize config globally
await initConfig();

const metricsMiddleware = promBundle({
	includeMethod: true,
	includePath: true,
	includeStatusCode: true,
	includeUp: true,
	promClient: {
		collectDefaultMetrics: {}
	}
});

// Initialize a Cache instance
const cache = initCache(config.server);

const app = express();
const port = argv.port || config.server.port;

// load metrics middleware
app.use(metricsMiddleware);

// Use gzip on local server.
// In higher environments it's handled elsewhere
if (config.server.gzipEnabled) {
	app.use(compression());
}

// Set sensible security headers for express
app.use(helmet({
	contentSecurityPolicy: false,
}));

// Set headers for static files
function setHeaders(res, requestPath) {
	if (/\/fonts\//.test(requestPath)) {
		// Allow fonts to be loaded from anywhere
		res.header('Access-Control-Allow-Origin', '*');
	} else {
		// All other static files should have same origin
		res.header('Access-Control-Allow-Origin', `https://${config.app.host}`);
	}
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Surrogate-Key', 'ui-all ui-static all-assets');
}

app.use('/static', express.static('dist/client/static', {
	setHeaders,
	maxAge: '1y'
}));

// Setup Request Logger
// -> placed here to exclude static
app.use(requestLogger);

// Read locale from request
app.use(locale(config.app.locale.supported, config.app.locale.default));

// Apply serverRoutes middleware to expose available routes
app.use('/ui-routes', serverRoutes);

// Apply sitemap middleware to expose routes we want search engine crawlers to see
app.use('/sitemaps/ui.xml', sitemapMiddleware(config.app, config.server));

// Handle time sychronization requests
app.use('/', timesyncRouter());

// dynamic personalized loan routes
app.use('/live-loan', liveLoanRouter(cache));

// Configure session
app.set('trust proxy', 1);
app.use('/', sessionRouter(config.server));

// Configure auth
app.use('/', authRouter(config.app));

// Setup Vue Request handler
app.use(vueMiddleware({ config }));

// Setup Request Error Logger
app.use(errorLogger);

// Final Error Handler
app.use(fallbackErrorHandler);

if (config.server.disableCluster) {
	// initialize http server instance
	const server = http.createServer(app);

	// initialize terminus with the http server + cache instance
	initializeTerminus(server, cache);

	// listen for requests
	server.listen(port, () => info(`server (pid: ${process.pid}) started at localhost:${port}`));
} else {
	// Cluster Activation
	// See: https://nodejs.org/docs/latest-v8.x/api/cluster.html

	// Number of CPUs for pool
	const numCPUs = 2;

	// Start the cluster master process
	if (cluster.isPrimary && !argv.mock) {
		info(`Primary ${process.pid} is running`);

		// Fork workers.
		for (let i = 0; i < numCPUs; i += 1) {
			cluster.fork();
		}

		// Check if work id died
		cluster.on('exit', (worker, code, signal) => {
			info(`Worker ${worker.process.pid} died`, { code, signal });
		});
	} else {
		// Start the worker processes
		// - these can share any TCP connection
		info(`Worker ${process.pid} started`);

		app.listen(port, () => info(`server started at localhost:${port}`));
	}
}

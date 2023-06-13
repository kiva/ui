require('dotenv').config({ path: '/etc/kiva-ui-server/config.env' });
const cluster = require('cluster');
const http = require('http');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const locale = require('locale');
const serverRoutes = require('./available-routes-middleware');
const sitemapMiddleware = require('./sitemap/middleware');
const authRouter = require('./auth-router');
const sessionRouter = require('./session-router');
const timesyncRouter = require('./timesync-router');
const liveLoanRouter = require('./live-loan-router');
const vueMiddleware = require('./vue-middleware');
const serverBundle = require('../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../dist/vue-ssr-client-manifest.json');
const argv = require('./util/argv');
const config = require('../config/selectConfig')(argv.config);
const initCache = require('./util/initCache');
const logger = require('./util/errorLogger');
const initializeTerminus = require('./util/terminusConfig');

// Initialize tracing
require('./util/ddTrace');

// Initialize a Cache instance, Should Only be called once!
const cache = initCache(config.server);

const app = express();
const port = argv.port || config.server.port;

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
function setHeaders(res, path) {
	if (/\/fonts\//.test(path)) {
		// Allow fonts to be loaded from anywhere
		res.header('Access-Control-Allow-Origin', '*');
	} else {
		// All other static files should have same origin
		res.header('Access-Control-Allow-Origin', `https://${config.app.host}`);
	}
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
}

app.use('/static', express.static('dist/static', {
	setHeaders,
	maxAge: '1y'
}));

// Setup Request Logger
// -> placed here to exclude static
app.use(logger.requestLogger);

// Read locale from request
app.use(locale(config.app.locale.supported, config.app.locale.default));

// Apply serverRoutes middleware to expose available routes
app.use('/ui-routes', serverRoutes);

// Apply sitemap middleware to expose routes we want search engine crawlers to see
app.use('/sitemaps/ui.xml', sitemapMiddleware(config.app, cache));

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
app.use(vueMiddleware({
	serverBundle,
	clientManifest,
	config,
	cache,
}));

// Setup Request Error Logger
app.use(logger.errorLogger);
// Final Error Handler
app.use(logger.fallbackErrorHandler);

if (config.server.disableCluster) {
	// initialize http server instance
	const server = http.createServer(app);

	// initialize terminus with the http server + cache instance
	initializeTerminus(server, cache);

	// listen for requests
	server.listen(port, () => console.info(JSON.stringify({
		meta: {},
		level: 'log',
		message: `server (pid: ${process.pid}) started at localhost:${port}`
	})));
} else {
	// Cluster Activation
	// See: https://nodejs.org/docs/latest-v8.x/api/cluster.html

	// Number of CPUs for pool
	const numCPUs = 2;

	// Start the cluster master process
	if (cluster.isMaster && !argv.mock) {
		console.log(JSON.stringify({
			meta: {},
			level: 'log',
			message: `Master ${process.pid} is running`
		}));

		// Fork workers.
		for (let i = 0; i < numCPUs; i++) { // eslint-disable-line
			cluster.fork();
		}

		// Check if work id is died
		// eslint-disable-next-line no-unused-vars
		cluster.on('exit', (worker, code, signal) => {
			console.info(JSON.stringify({
				meta: {},
				level: 'log',
				message: `worker ${worker.process.pid} died`
			}));
		});
	} else {
		// Start the worker processes
		// - these can share any TCP connection
		console.info(JSON.stringify({
			meta: {},
			level: 'log',
			message: `Worker ${process.pid} started`
		}));

		app.listen(port, () => console.info(JSON.stringify({
			meta: {},
			level: 'log',
			message: `server started at localhost:${port}`
		})));
	}
}

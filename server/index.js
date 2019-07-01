require('dotenv').config({ path: '/etc/kiva-ui-server/config.env' });
const cluster = require('cluster');
const express = require('express');
const helmet = require('helmet');
const serverRoutes = require('./available-routes-middleware');
const authRouter = require('./auth-router');
const mockGraphQLRouter = require('./mock-graphql-router');
const sessionRouter = require('./session-router');
const vueMiddleware = require('./vue-middleware');
const serverBundle = require('../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../dist/vue-ssr-client-manifest.json');
const argv = require('./util/argv');
const config = require('../config/selectConfig')(argv.config);
const initCache = require('./util/initCache');
const logger = require('./util/errorLogger');

// Initialize a Cache instance, Should Only be called once!
const cache = initCache(config.server);

const app = express();
const port = argv.port || config.server.port;

// Set sensible security headers for express
app.use(helmet());

// Set headers for fonts
function setHeaders(res, path) {
	if (path.indexOf('/fonts/') > -1) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	}
}

app.use(express.static('dist', {
	setHeaders,
	maxAge: '1d'
}));

// Setup Request Logger
// -> placed here to exclude static
app.use(logger.requestLogger);

// Setup optional mock graphql server
if (argv.mock) {
	app.use('/', mockGraphQLRouter(config.app.graphqlUri));
	config.app.graphqlUri = `http://localhost:${port}/graphql`;
	config.app.auth0.enable = false;
}

// Apply serverRoutes middleware to expose available routes
app.use('/ui-routes', serverRoutes);

// Configure session
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

// Cluster Activation
// See: https://nodejs.org/docs/latest-v8.x/api/cluster.html

// Number of CPUs for pool
const numCPUs = 2;

// Start the cluster master process
if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running`); // eslint-disable-line

	// Fork workers.
	for (let i = 0; i < numCPUs; i++) { // eslint-disable-line
		cluster.fork();
	}

	// Check if work id is died
	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`); // eslint-disable-line
	});
} else {
	// Start the worker processes
	// - these can share any TCP connection
	console.log(`Worker ${process.pid} started`); // eslint-disable-line

	app.listen(port, () => console.log(`server started at localhost:${port}`));
}

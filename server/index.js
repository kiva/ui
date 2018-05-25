const express = require('express');
const helmet = require('helmet');
const vueMiddleware = require('./vue-middleware');
const serverBundle = require('../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../dist/vue-ssr-client-manifest.json');
const argv = require('minimist')(process.argv.slice(2));
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
	setHeaders
}));

// Setup Request Logger
// -> placed here to exclude static
app.use(logger.requestLogger);

app.use(vueMiddleware({
	serverBundle,
	clientManifest,
	config,
	cache,
}));

// Setup Request Logger
app.use(logger.errorLogger);
// Final Error Handler
app.use(logger.fallbackErrorHandler);

app.listen(port, () => console.log(`server started at localhost:${port}`));

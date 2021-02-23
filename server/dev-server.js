// verify npm/node/dependency versions
require('../build/check-versions')();

// dependencies
require('dotenv').config({ path: '/etc/kiva-ui-server/config.env' });
const chokidar = require('chokidar');
const express = require('express');
const helmet = require('helmet');
const locale = require('locale');
const MFS = require('memory-fs');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const threadLoader = require('thread-loader');

// Import Middleware for Exposing server routes
const serverRoutes = require('./available-routes-middleware');
const authRouter = require('./auth-router');
const mockGraphQLRouter = require('./mock-graphql-router');
const sessionRouter = require('./session-router');
const timesyncRouter = require('./timesync-router');
const liveLoanRouter = require('./live-loan-router');
const vueMiddleware = require('./vue-middleware');
const serverConfig = require('../build/webpack.server.conf');
const clientConfig = require('../build/webpack.client.dev.conf');
const argv = require('./util/argv');
const config = require('../config/selectConfig')(argv.config || 'local');
const initCache = require('./util/initCache');
const logger = require('./util/errorLogger');

// Initialize a Cache instance, Should Only be called once!
const cache = initCache(config.server);

// app init
const port = argv.port || config.server.port;
const app = express();

// Set sensible security headers for express
app.use(helmet());

// Setup Request Logger
app.use(logger.requestLogger);

// Setup optional mock graphql server
if (argv.mock) {
	app.use('/', mockGraphQLRouter(config.app.graphqlUri));
	config.app.graphqlUri = `http://localhost:${port}/graphql`;
	config.app.auth0.enable = false;
}

// Setup thread loader for use in webpack build
threadLoader.warmup({
	// pool options, like passed to loader options
	// must match loader options to boot the correct pool
}, [
	// modules to load
	'babel-loader',
	'graphql-tag/loader',
	'vue-style-loader',
	'css-loader',
	'postcss-loader',
	'sass-loader'
]);

// webpack setup
const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);
const devMiddleware = webpackDevMiddleware(clientCompiler, {
	logLevel: 'silent',
	stats: false,
	publicPath: clientConfig.output.publicPath,
	watchOptions: {
		poll: 1000
	}
	// serverSideRender: true,
});
const hotMiddleware = webpackHotMiddleware(clientCompiler, {
	path: '/__ui_hmr',
	log: () => {}
});

// file reader helper
const readFile = (fs, file) => {
	try {
		return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8');
	} catch (e) { /* intentionally empty */ }
};

// promise to delay request handling until bundles are created
let resolveHandlerReady;
const handlerReady = new Promise(resolve => { resolveHandlerReady = resolve; });

let handler = () => console.info(JSON.stringify({
	meta: {},
	level: 'error',
	message: 'dev-server handler was called before it was ready'
}));
let clientManifest;
let serverBundle;

// function to update the request handler
const updateHandler = () => {
	if (clientManifest && serverBundle) {
		handler = vueMiddleware({
			clientManifest,
			serverBundle,
			config,
			cache,
		});
		resolveHandlerReady();
	}
};

// update on template change
chokidar.watch(path.resolve(__dirname, 'index.template.html')).on('change', () => {
	console.info(JSON.stringify({
		meta: {},
		level: 'log',
		message: 'index.template.html updated.'
	}));
	updateHandler();
});

// update when the client manifest changes
clientCompiler.plugin('done', rawStats => {
	// abort if there were errors
	const stats = rawStats.toJson();
	if (stats.errors.length) return;

	// read client manifest from dev-middleware filesystem
	clientManifest = JSON.parse(readFile(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json'));
	updateHandler();
});

// update when the server bundle changes
const mfs = new MFS();
serverCompiler.outputFileSystem = mfs;
serverCompiler.watch({
	poll: 1000
}, (err, rawStats) => {
	// abort on error
	if (err) throw err;
	const stats = rawStats.toJson();
	if (stats.errors.length) return;

	// read server bundle from server-compiler filesystem
	serverBundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
	updateHandler();
});

// Read locale from request
app.use(locale(config.app.locale.supported, config.app.locale.default));

// Apply serverRoutes middleware to expose available routes
app.use('/ui-routes', serverRoutes);

// Handle time sychronization requests
app.use('/', timesyncRouter());

// dynamic personalized loan routes
app.use('/live-loan', liveLoanRouter(cache));

// install dev/hot middleware
app.use(devMiddleware);
app.use(hotMiddleware);

// Configure session
app.use('/', sessionRouter(config.server));

// Configure auth
app.use('/', authRouter(config.app));

// install handler
app.use((req, res, next) => {
	handlerReady.then(() => handler(req, res, next));
});

// Setup Request Logger
app.use(logger.errorLogger);
// Final Error Handler
app.use(logger.fallbackErrorHandler);

// start server
app.listen(port, () => 	console.info(JSON.stringify({
	meta: {},
	level: 'log',
	message: `dev-server started at localhost:${port}`
})));

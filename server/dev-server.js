// verify npm/node/dependency versions
require('../build/check-versions')();

// dependencies
const chokidar = require('chokidar');
const express = require('express');
const MFS = require('memory-fs');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const vueMiddleware = require('./vue-middleware');
const serverConfig = require('../build/webpack.server.conf');
const clientConfig = require('../build/webpack.client.dev.conf');
const argv = require('minimist')(process.argv.slice(2));
const config = require('../config/selectConfig')(argv.config || 'dev-vm');

// app init
const port = argv.port || config.server.port;
const app = express();

// webpack setup
const clientCompiler = webpack(clientConfig);
const serverCompiler = webpack(serverConfig);
const devMiddleware = webpackDevMiddleware(clientCompiler, {
	logLevel: 'silent',
	stats: false,
	publicPath: clientConfig.output.publicPath,
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

let handler = () => console.error('dev-server handler was called before it was ready');
let clientManifest;
let serverBundle;

// function to update the request handler
const updateHandler = () => {
	if (clientManifest && serverBundle) {
		handler = vueMiddleware({
			clientManifest,
			serverBundle,
			config,
		});
		resolveHandlerReady();
	}
};

// update on template change
chokidar.watch(path.resolve(__dirname, 'index.template.html')).on('change', () => {
	console.log('index.template.html updated.');
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
serverCompiler.watch({}, (err, rawStats) => {
	// abort on error
	if (err) throw err;
	const stats = rawStats.toJson();
	if (stats.errors.length) return;

	// read server bundle from server-compiler filesystem
	serverBundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
	updateHandler();
});

// install dev/hot middleware
app.use(devMiddleware);
app.use(hotMiddleware);

// install handler
app.use((req, res) => {
	handlerReady.then(() => handler(req, res));
});

// start server
app.listen(port, () => console.log(`dev-server started at localhost:${port}`));

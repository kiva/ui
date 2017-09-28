const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');

const clientConfig = require('../build/webpack.client.dev.conf');
const serverConfig = require('../build/webpack.server.dev.conf');

const app = express();

if (process.env.NODE_ENV !== 'production') {
	// make a webpack compiler for the client bundle and the server bundle
	const compiler = webpack([clientConfig, serverConfig]);

	// kick-off the webpack build and watch files for changes
	app.use(webpackDevMiddleware(compiler, {
		serverSideRender: true,
	}));

	// setup hmr server to send client bundle changes to the browser
	app.use(webpackHotMiddleware(compiler.compilers.find(c => c.name === 'client')));

	// setup our server so that it reloads when changes are made to the server bundle
	app.use(webpackHotServerMiddleware(compiler));
} else {
	// app.use(express.static('../dist/static'));
	// app.use(serverRenderer());
}

app.listen(8080);

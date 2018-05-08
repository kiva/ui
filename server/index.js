const express = require('express');
const vueMiddleware = require('./vue-middleware');
const serverBundle = require('../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../dist/vue-ssr-client-manifest.json');
const argv = require('minimist')(process.argv.slice(2));
const config = require('../config/selectConfig')(argv.config);
const Raven = require('raven');

const app = express();
const port = argv.port || config.server.port;

if (config.app.enableSentry) {
	Raven.config(config.app.sentryURI).install();
	app.use(Raven.requestHandler());
	app.use(Raven.errorHandler());
}

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

app.use(vueMiddleware({
	serverBundle,
	clientManifest,
	config,
}));

app.listen(port, () => console.log(`server started at localhost:${port}`));

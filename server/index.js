const express = require('express');
const vueMiddleware = require('./vue-middleware');
const serverBundle = require('../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../dist/vue-ssr-client-manifest.json');
const argv = require('minimist')(process.argv.slice(2));
const config = require('../config/selectConfig')(argv.config);

const app = express();
const port = argv.port || config.server.port;

app.use(express.static('dist'));

app.use(vueMiddleware({
	serverBundle,
	clientManifest,
	config,
}));

app.listen(port, () => console.log(`server started at localhost:${port}`));

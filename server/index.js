const express = require('express');
const conf = require('../config');
const vueMiddleware = require('./vue-middleware');
const serverBundle = require('../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../dist/vue-ssr-client-manifest.json');
// Import Middleware for Exposing server routes
const serverRoutes = require('./serverRoutes.js');

const app = express();
const port = process.env.PORT || conf.build.port;

app.use(express.static('dist'));

// Apply serverRoutes middleware to expose available routes
app.use('/available-routes', serverRoutes);

app.use(vueMiddleware({
	serverBundle,
	clientManifest,
}));

app.listen(port, () => console.log(`server started at localhost:${port}`));

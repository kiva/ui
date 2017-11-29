const express = require('express');
// const fs = require('fs');
const http = require('http');
// const https = require('https');
const conf = require('../config');
const vueMiddleware = require('./vue-middleware');
const serverBundle = require('../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../dist/vue-ssr-client-manifest.json');

// Import Middleware for Exposing server routes
const serverRoutes = require('./available-routes-middleware');

// Load SSL keys
// const sslOptions = {
// 	key: fs.readFileSync(''),
// 	cert: fs.readFileSync('')
// };

const app = express();
const port = process.env.PORT || conf.server.port;
// const sslPort = process.env.SSL_PORT || conf.server.sslPort;

app.use(express.static('dist'));

// Apply serverRoutes middleware to expose available routes
app.use('/available-routes', serverRoutes);

app.use(vueMiddleware({
	serverBundle,
	clientManifest,
}));

http.createServer(app)
	.listen(port, () => console.log(`server started at localhost:${port}`));
// https.createServer(sslOptions, app)
// 	.listen(sslPort, () => console.log(`ssl server started at localhost:${sslPort}`));

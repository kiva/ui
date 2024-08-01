import { config as dotEnvConfig } from 'dotenv';
import chokidar from 'chokidar';
import express from 'express';
import helmet from 'helmet';
import locale from 'locale';
import path from 'path';
import { fileURLToPath } from 'url';
import promBundle from 'express-prom-bundle';
import { createServer as createViteServer } from 'vite';
import { info, error } from './util/log.js';
import { setupTracing } from './util/tracer.js';
import serverRoutes from './available-routes-middleware.js';
import sitemapMiddleware from './sitemap/middleware.js';
import authRouter from './auth-router.js';
import sessionRouter from './session-router.js';
import timesyncRouter from './timesync-router.cjs';
import liveLoanRouter from './live-loan-router.js';
import vueMiddleware from './vue-middleware.js';
import argv from './util/argv.js';
import selectConfig from '../config/selectConfig.js';
import initCache from './util/initCache.js';
import { errorLogger, fallbackErrorHandler, requestLogger } from './util/errorLogger.js';

// tracing
setupTracing();

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// dependencies
dotEnvConfig({ path: '/etc/kiva-ui-server/config.env' });
dotEnvConfig({ path: './.config.env' });
const metricsMiddleware = promBundle({
	includeMethod: true,
	includePath: true,
	includeStatusCode: true,
	includeUp: true,
	promClient: {
		collectDefaultMetrics: {}
	}
});

const config = await selectConfig(argv.config || 'local');

// Initialize a Cache instance
const cache = initCache(config.server);

// app init
const port = argv.port || config.server.port;
const app = express();
(async function createServer() {
	// Setup Vite Server
	const vite = await createViteServer({
		server: { middlewareMode: true },
		appType: 'custom',
		root: path.resolve(__dirname, '../'),
	});

	// promise to delay request handling until bundles are created
	let resolveHandlerReady;
	const handlerReady = new Promise(resolve => { resolveHandlerReady = resolve; });
	let handler = () => error('dev-server handler was called before it was ready');

	let clientManifest;

	// function to update the request handler
	const updateHandler = async () => {
		handler = vueMiddleware({
			clientManifest,
			config,
			vite,
		});
		resolveHandlerReady();
	};

	// update on template change
	chokidar.watch(path.resolve(__dirname, '../index.html')).on('change', () => {
		info('index.html updated.');
		updateHandler();
	});

	// Set sensible security headers for express
	app.use(helmet({
		contentSecurityPolicy: false,
	}));

	// Setup Request Logger
	app.use(requestLogger);

	// Read locale from request
	app.use(locale(config.app.locale.supported, config.app.locale.default));

	// Apply serverRoutes middleware to expose available routes
	app.use('/ui-routes', serverRoutes);

	// Apply sitemap middleware to expose routes we want search engine crawlers to see
	app.use('/sitemaps/ui.xml', sitemapMiddleware(config.app, config.server));

	// Handle time sychronization requests
	app.use('/', timesyncRouter());

	// dynamic personalized loan routes
	app.use('/live-loan', liveLoanRouter(cache));

	// install vite middlewares
	app.use(vite.middlewares);

	// load metrics middleware
	app.use(metricsMiddleware);

	// Configure session
	app.use('/', sessionRouter(config.server));

	// Configure auth
	app.use('/', authRouter(config.app));

	// install handler
	updateHandler();
	app.use((req, res, next) => {
		handlerReady.then(() => handler(req, res, next));
	});

	// Setup Request Logger
	app.use(errorLogger);

	// Final Error Handler
	app.use(fallbackErrorHandler);

	// start server
	app.listen(port, () => info(`dev-server started at localhost:${port}`));
}());

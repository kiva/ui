import { createTerminus } from '@godaddy/terminus';

let cache = null;
function disconnectCache() {
	return new Promise(resolve => {
		if (cache && cache.close) {
			console.log(JSON.stringify({
				meta: {},
				level: 'log',
				message: 'Closing connection with cache'
			}));
			cache.close();
		}
		resolve(true);
	});
}

function onSignal() {
	console.log(JSON.stringify({
		meta: {},
		level: 'log',
		message: 'Server is starting cleanup'
	}));
	return Promise.all([
		// TODO: add any additional shutdown methods
		disconnectCache()
	]);
}

function beforeShutdown() {
	// avoid race conditions by making this longer than our readiness probe
	return new Promise(resolve => {
		setTimeout(resolve, 6000);
	});
}

function onShutdown() {
	console.log(JSON.stringify({
		meta: {},
		level: 'log',
		message: 'Cleanup finished, server is shutting down'
	}));
}

function healthCheck() {
	return Promise.resolve();
}

const options = {
	// health check options
	healthChecks: {
		'/healthcheck': healthCheck,
	},

	// cleanup options
	timeout: 12000, // [optional = 1000] number of milliseconds before forceful exiting
	beforeShutdown, // [optional] called before the HTTP server starts its shutdown
	onSignal, // [optional] cleanup function, returning a promise (used to be onSigterm)
	onShutdown, // [optional] called right before exiting
};

export default (function initializeTerminus(server, cacheInstance) {
	createTerminus(server, options);
	cache = cacheInstance;
});

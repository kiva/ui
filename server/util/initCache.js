const LRU = require('lru-cache');
const Memcached = require('memcached');

function AsyncLRU(options) {
	// create LRU-cache instance
	const lru = LRU(options);

	// replace 'get' with an async wrapper
	const oldGet = lru.get;
	lru.get = (key, cb) => {
		cb(oldGet.call(lru, key));
	};

	// return patched LRU-cache instance
	return lru;
}

module.exports = function initCache(config) {
	if (config.memcachedEnabled && config.memcachedServers.length) {
		let servers = config.memcachedServers;
		if (typeof servers === 'string') {
			servers = servers.split(',');
		}

		// create a memcached connection
		return new Memcached(servers, {
			retries: 1,
			retry: 200,
		});
	}
	// create a simple local-memory cache
	return AsyncLRU({
		max: 1000
	});
};

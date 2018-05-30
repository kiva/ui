const LRU = require('lru-cache');
const Memcached = require('memcached');

function FakeMemcached(options) {
	// Create LRU-cache instance
	const lru = LRU(options);

	// Replace 'get' with an async wrapper
	const oldGet = lru.get;
	lru.get = (key, callback) => {
		const result = oldGet.call(lru, key);
		return callback ? callback(result) : result;
	};

	// Replace 'set' with a memcached-compatible wrapper
	const oldSet = lru.set;
	lru.set = (key, value, age, callback) => {
		try {
			oldSet.call(lru, key, value, age * 1000);
		} catch (error) {
			if (callback) {
				callback(error);
			}
		}
	};

	// Return patched LRU-cache instance
	return lru;
}

module.exports = function initCache(config) {
	if (config.memcachedEnabled && config.memcachedServers.length) {
		let servers = config.memcachedServers;
		if (typeof servers === 'string') {
			servers = servers.split(',');
		}

		// Create a memcached connection
		return new Memcached(servers, {
			retries: 1
		});
	}
	// Create a simple local-memory cache
	return FakeMemcached({
		max: 1000
	});
};

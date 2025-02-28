import LRU from 'lru-cache';
import memjs from 'memjs';

function FakeMemcached(options) {
	// Create LRU-cache instance
	const lru = new LRU(options);

	// Replace 'get' with an async wrapper
	const oldGet = lru.get;
	lru.get = (key, callback) => {
		const result = oldGet.call(lru, key);
		return callback ? callback((result === undefined ? undefined : null), result) : result;
	};

	// Replace 'set' with a memcached-compatible wrapper
	const oldSet = lru.set;
	lru.set = (key, value, { expires }, callback) => {
		try {
			oldSet.call(lru, key, value, (expires ?? 0) * 1000);
		} catch (error) {
			if (callback) {
				callback(error);
			}
		}
		if (callback) {
			callback(null, true);
		}
	};

	// Return patched LRU-cache instance
	return lru;
}

let cache;
export default function initCache(config) {
	// Return existing cache if already initialized
	if (cache) {
		return cache;
	}

	if (config.memcachedEnabled && config.memcachedServers.length) {
		// Create a memcached connection
		// eslint-disable-next-line new-cap
		cache = new memjs.Client.create(config.memcachedServers, {
			failover: true,
			timeout: 1,
			keepAlive: true,
		});
		return cache;
	}
	// Create a simple local-memory cache
	cache = FakeMemcached({
		max: 1000
	});
	return cache;
}

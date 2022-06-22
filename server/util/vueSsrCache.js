const { log } = require('./log');
const tracer = require('./ddTrace');

// The Vue ServerSideRenderer requires a cache instance that implements this interface:
// type RenderCache = {
//     get: (key: string, cb?: Function) => string | void;
//     set: (key: string, val: string) => void;
//     has?: (key: string, cb?: Function) => boolean | void;
// };
//
// This wrapper makes a Memcached cache instance become compatible with that interface.
module.exports = function wrapper(cache) {
	return {
		get(key, cb) {
			tracer.trace('vueSsrCache.get', { resource: key }, () => {
				cache.get(key, (error, data) => {
					if (error) {
						log(`MemJS Error Getting Cache for ${key}, Error: ${error}`, 'error');
					}
					if (!error && data) {
						const bufferToString = data.toString('utf8');
						// Only the html is actually cached, so reconstitute the value as expected by the renderer.
						// Testing has so far shown 'components' to be empty, so just creating it as an empty set.
						cb({ html: bufferToString, components: new Set([]) });
					} else {
						cb();
					}
				});
			});
		},
		set(key, value) {
			tracer.trace('vueSsrCache.set', { resource: key }, () => {
				cache.set(key, value.html, { expires: 0 }, (error, success) => {
					if (error) {
						log(`MemJS Error Setting Cache for: ${key}, Error: ${error}`, 'error');
					}
					if (success) {
						log(`MemJS Success Setting Cache for: ${key}, Success: ${success}`);
					}
				});
			});
		},
	};
};

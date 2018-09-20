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
			cache.get(key, (error, data) => {
				if (error) console.error(`MemJS Error Getting Cache for ${key}, Error: ${error}`);
				if (!error && data) {
					const bufferToString = data.toString('utf8');
					// Only the html is actually cached, so reconstitute the value as expected by the renderer.
					// Testing has so far shown 'components' to be empty, so just creating it as an empty set for now.
					cb({ html: bufferToString, components: new Set([]) });
				} else {
					cb();
				}
			});
		},
		set(key, value) {
			cache.set(key, value.html, 1 * 60 * 60, (error, success) => {
				if (error) console.error(`MemJS Error Setting Cache for: ${key}, Error: ${error}`);
				if (success) console.info(`MemJS Success Setting Cache for: ${key}, Success: ${success}`);
			});
		},
	};
};

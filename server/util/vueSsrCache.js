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
				if (!error && data) {
					// Only the html is actually cached, so reconstitute the value as expected by the renderer.
					// Testing has so far shown 'components' to be empty, so just creating it as an empty set for now.
					cb({ html: data, components: new Set([]) });
				} else {
					cb();
				}
			});
		},
		set(key, value) {
			cache.set(key, value.html, 1 * 60 * 60, error => console.error(error));
		},
	};
};

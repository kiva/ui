import { log } from './log.js';
import { trace } from './mockTrace.js';

export default (function wrapper(cache) {
	return {
		get(key, cb) {
			trace('vueSsrCache.get', { resource: key }, () => {
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
			trace('vueSsrCache.set', { resource: key }, () => {
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
});

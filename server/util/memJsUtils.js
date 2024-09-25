import { log, error } from './log.js';
import { trace } from './mockTrace.js';

export const getFromCache = (key, cache) => {
	return trace('getFromCache', { resource: key }, () => {
		return new Promise(resolve => {
			cache.get(key, (err, data) => {
				if (err) {
					error(`MemJS Error Getting ${key}`, { error: err });
				}
				if (data) {
					log(`MemJS Success Getting ${key}`);
				}
				resolve(data || null);
			});
		});
	});
};
export const setToCache = (key, value, expires, cache) => {
	return trace('setToCache', { resource: key }, () => {
		return new Promise((resolve, reject) => {
			cache.set(key, value, { expires }, (err, success) => {
				if (err) {
					error(`MemJS Error Setting Cache for ${key}`, { error: err });
					reject();
				} else {
					log(`MemJS Success Setting Cache for ${key}, Success: ${success}`);
					resolve();
				}
			});
		});
	});
};
export default {
	getFromCache,
	setToCache
};

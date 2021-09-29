const log = require('./log');

module.exports = {
	getFromCache: (key, cache) => {
		return new Promise(resolve => {
			cache.get(key, (error, data) => {
				if (error) {
					log(`MemJS Error Getting ${key}, Error: ${error}`, 'error');
				}
				if (data) {
					log(`MemJS Success Getting ${key}`);
				}
				resolve(data || null);
			});
		});
	},
	setToCache: (key, value, expires, cache) => {
		return new Promise((resolve, reject) => {
			cache.set(key, value, { expires }, (error, success) => {
				if (error) {
					log(`MemJS Error Setting Cache for ${key}, Error: ${error}`, 'error');
					reject();
				} else {
					log(`MemJS Success Setting Cache for ${key}, Success: ${success}`);
					resolve();
				}
			});
		});
	}
};

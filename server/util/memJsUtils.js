const log = require('./log');

module.exports = {
	getFromCache: (key, cache) => {
		return new Promise(resolve => {
			cache.get(key, (error, data) => {
				if (error) {
					console.error(JSON.stringify({
						meta: {},
						level: 'error',
						message: `MemJS Error Getting ${key}, Error: ${error}`
					}));
				}
				log(`MemJS Success Getting ${key}`);
				resolve(data);
			});
		});
	},
	setToCache: (key, value, expires, cache) => {
		return new Promise((resolve, reject) => {
			cache.set(key, value, { expires }, (error, success) => {
				if (error) {
					log(`MemJS Error Setting Cache for ${key}, Error: ${error}`, 'error');
					reject();
				}
				if (success) {
					log(`MemJS Success Setting Cache for ${key}, Success: ${success}`);
					resolve();
				}
			});
		});
	}
};

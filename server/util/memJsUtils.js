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
				resolve(data);
			});
		});
	},
	setToCache: (key, value, expires, cache) => {
		return new Promise((resolve, reject) => {
			cache.set(key, value, { expires }, (error, success) => {
				if (error) {
					console.error(JSON.stringify({
						meta: {},
						level: 'error',
						message: `MemJS Error Setting Cache for ${key}, Error: ${error}`
					}));
					reject();
				}
				if (success) {
					console.info(JSON.stringify({
						meta: {},
						level: 'info',
						message: `MemJS Success Setting Cache for ${key}, Success: ${success}`
					}));
					resolve();
				}
			});
		});
	}
};

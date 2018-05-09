const Memcached = require('memcached');

let cache;

module.exports = {
	// create a memcached connection
	initMemcached: (servers, options = {}) => {
		cache = new Memcached(servers, options);
	},
	// retreive cache instance
	getCache: () => cache
};

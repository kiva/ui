const Memcached = require('memcached');

module.exports = {
	// create a memcached connection
	initMemcached: (servers, options = {}) => {
		return new Memcached(servers, options);
	},
};

var merge = require('webpack-merge')
var test  = require('./test.js')

module.exports = merge(test, {
	app: {
		// removes 'ui' path segment
		// publicPath: 'https://ui-test-dk1-kiva-org.freetls.fastly.net/',
		publicPath: 'https://www-test-kiva-org.freetls.fastly.net/',
	},
	server: {
		// memcachedServers: 'k8sdev-elasticache.bu9ifv.0001.usw1.cache.amazonaws.com:11211',
		memcachedServers: 'test-memcached-01:11211',
	}
})

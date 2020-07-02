var merge = require('webpack-merge')
var prod = require('./index.js')

module.exports = merge(prod, {
	app: {
		publicPath: 'https://www-kiva-org.freetls.fastly.net/',
	},
	server: {
		memcachedServers: 'memcached-ui-01:11211,memcached-ui-02:11211',
		enableDDTrace: true,
		disableCluster: true,
	}
})

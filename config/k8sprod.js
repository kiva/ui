const { merge } = require('webpack-merge');
var prod = require('./index.js')

module.exports = merge(prod, {
	app: {
		publicPath: 'https://www-kiva-org.freetls.fastly.net/',
	},
	server: {
		memcachedServers: 'awsprod-ui-memcached-cluster.xd6r4x.0001.usw2.cache.amazonaws.com:11211,awsprod-ui-memcached-cluster.xd6r4x.0002.usw2.cache.amazonaws.com:11211,awsprod-ui-memcached-cluster.xd6r4x.0003.usw2.cache.amazonaws.com:11211,awsprod-ui-memcached-cluster.xd6r4x.0004.usw2.cache.amazonaws.com:11211',
		enableDDTrace: true,
		disableCluster: true,
	}
})

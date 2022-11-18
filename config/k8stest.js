const { merge } = require('webpack-merge');
var test  = require('./test.js')

module.exports = merge(test, {
	app: {
		publicPath: 'https://www.test.kiva.org/',
	},
	server: {
		memcachedServers: 'marketplace-k8s-ui-test.knmtma.0001.usw2.cache.amazonaws.com:11211',
		enableDDTrace: true,
		disableCluster: true,
	}
})

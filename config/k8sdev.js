const { merge } = require('webpack-merge');
var dev  = require('./dev.js')

module.exports = merge(dev, {
	app: {
		publicPath: 'https://www.dev.kiva.org/',
	},
	server: {
		memcachedServers: 'marketplace-k8s-ui-dev.knmtma.cfg.usw2.cache.amazonaws.com:11211',
		enableDDTrace: true,
		disableCluster: true,
	}
})

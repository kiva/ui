var merge = require('webpack-merge')
var dev  = require('./dev.js')

module.exports = merge(dev, {
	app: {
		publicPath: 'https://www-dev-kiva-org.global.ssl.fastly.net/',
	}
	server: {
		memcachedServers: 'k8sdev-elasticache.bu9ifv.0001.usw1.cache.amazonaws.com:11211',
	}
})

var merge = require('webpack-merge')
var dev  = require('./dev.js')

module.exports = merge(dev, {
	server: {
		memcachedServers: 'k8sdev-elasticache.bu9ifv.cfg.usw1.cache.amazonaws.com:11211',
	}
})

var merge = require('webpack-merge')
var devVm  = require('./dev-vm.js')

module.exports = merge(devVm, {
	server: {
		memcachedServers: 'k8sdev-elasticache.bu9ifv.cfg.usw1.cache.amazonaws.com:11211',
	}
})

var merge = require('webpack-merge')
var base = require('./index.js')
var devVm  = require('./dev-vm.js')

module.exports = merge(base, devVm, {
	app: {
		publicPath: 'https://dev-vm-01.kiva.org/uiext/',
	},
	server: {
		memcachedEnabled: false,
	}
})

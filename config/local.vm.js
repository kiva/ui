var merge = require('webpack-merge')
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		host: 'localhost',
		publicPath: '/',
		auth0: {
			enable: false,
		},
	},
	server: {
		sessionUri: '',
		memcachedEnabled: false,
		memcachedServers: '',
	},
})

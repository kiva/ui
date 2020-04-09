var merge = require('webpack-merge')
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		host: 'localhost',
		publicPath: '/',
		auth0: {
			enable: false,
		},
		contentfulService: {
			uri: 'https://api.kivaws.org/graphql',
		},
	},
	server: {
		sessionUri: '',
		memcachedEnabled: false,
		memcachedServers: '',
	},
})

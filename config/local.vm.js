var merge = require('webpack-merge')
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		host: 'localhost',
		publicPath: '/',
		graphqlUri: 'https://api-vm.kiva.org/graphql',
		auth0: {
			enable: false,
		},
	},
	server: {
		graphqlUri: 'https://api-vm.kiva.org/graphql',
		sessionUri: '',
		memcachedEnabled: false,
		memcachedServers: '',
	},
})

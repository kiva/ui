var merge = require('webpack-merge')
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		host: 'localhost',
		publicPath: '/',
		graphqlUri: 'https://api.kivaws.org/graphql',
		auth0: {
			enable: false,
		},
	},
	server: {
		graphqlUri: 'https://api.kivaws.org/graphql',
		sessionUri: '',
		memcachedEnabled: false,
		memcachedServers: '',
	},
})

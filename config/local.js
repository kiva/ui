const { merge } = require('webpack-merge');
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		host: 'localhost',
		publicPath: '/',
		graphqlUri: 'https://marketplace-api.k1.kiva.org/graphql',
		auth0: {
			enable: false,
		},
		federationService: {
			uri: 'https://marketplace-api.k1.kiva.org/graphql',
		},
	},
	server: {
		graphqlUri: 'https://marketplace-api.k1.kiva.org/graphql',
		sessionUri: '',
		memcachedEnabled: false,
		memcachedServers: '',
	},
})

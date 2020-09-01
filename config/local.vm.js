const { merge } = require('webpack-merge');
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		host: 'localhost',
		publicPath: '/',
		auth0: {
			enable: false,
		},
		federationService: {
			uri: 'https://marketplace-api.k1.kiva.org/graphql',
		},
	},
	server: {
		sessionUri: '',
		memcachedEnabled: false,
		memcachedServers: '',
	},
})

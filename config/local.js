const { merge } = require('webpack-merge');
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		host: 'localhost',
		publicPath: '/',
		graphqlUri: 'https://marketplace-api.dk1.kiva.org/graphql',
		auth0: {
			enable: false,
		},
	},
	server: {
		graphqlUri: 'https://marketplace-api.dk1.kiva.org/graphql',
		sessionUri: '',
		memcachedEnabled: false,
		memcachedServers: '',
		gzipEnabled: true,
	},
})

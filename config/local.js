const { merge } = require('webpack-merge');
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		host: 'localhost',
		publicPath: '/',
<<<<<<< HEAD
		photoPath: 'https://www-kiva-org.freetls.fastly.net/img/',
		graphqlUri: 'https://marketplace-api.k1.kiva.org/graphql',
||||||| parent of 891fa8f3 (use prod endpoint for config)
		graphqlUri: 'https://marketplace-api.dk1.kiva.org/graphql',
=======
		graphqlUri: 'https://marketplace-api.k1.kiva.org/graphql',
>>>>>>> 891fa8f3 (use prod endpoint for config)
		auth0: {
			enable: false,
		},
	},
	server: {
		graphqlUri: 'https://marketplace-api.k1.kiva.org/graphql',
		sessionUri: '',
		memcachedEnabled: false,
		memcachedServers: '',
		gzipEnabled: true,
	},
})

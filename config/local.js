const { merge } = require('webpack-merge');
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		host: 'localhost',
		publicPath: '/',
		photoPath: 'https://www-kiva-org.freetls.fastly.net/img/',
		graphqlUri: 'https://marketplace-api.k1.kiva.org/graphql',
		enablePerimeterx: false,
		enableAnalytics: false,
		enableFullStory: false,
		enableSentry: false,
		auth0: {
			enable: false,
		},
		oneTrust: {
			enable: false
		}
	},
	server: {
		graphqlUri: 'https://marketplace-api.k1.kiva.org/graphql',
		sessionUri: '',
		memcachedEnabled: false,
		memcachedServers: '',
		gzipEnabled: true,
	},
})

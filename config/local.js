var merge = require('webpack-merge')
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		publicPath: '/',
		graphqlUri: 'https://api.kivaws.org/graphql',
		enableAnalytics: false,
		enablePerimeterx: false,
		enableSentry: false,
		sentryURI: 'https://845904672b2a40048c8340268928b614@sentry.io/1201289'
	},
	server: {
		graphqlUri: 'https://api.kivaws.org/graphql',
		sessionUri: '',
	},
})

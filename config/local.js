var merge = require('webpack-merge')
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		publicPath: '/',
		graphqlUri: 'https://api.kivaws.org/graphql',
		enableAnalytics: false,
		enablePerimeterx: false,
	}
})

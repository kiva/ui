var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://www-dev-kiva-org.global.ssl.fastly.net/ui/',
		graphqlUri: 'https://www.dev.kiva.org/ajax/graphql',
		googleTagmanagerId: 'GTM-PXFRMT',
		perimeterxAppId: 'PX5u4Lz98O',
	}
})

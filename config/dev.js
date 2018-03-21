var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		cdnDomain: 'www-dev-kiva-org.global.ssl.fastly.net',
		graphqlUri: 'https://www.dev.kiva.org/ajax/graphql',
		googleTagmanagerId: 'GTM-PXFRMT',
		perimeterxAppId: 'PX5u4Lz98O',
	}
})

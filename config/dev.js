var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://www-dev-kiva-org.global.ssl.fastly.net/ui/',
		graphqlUri: 'https://www.dev.kiva.org/ajax/graphql',
		googleTagmanagerId: 'GTM-PXFRMT',
		perimeterxAppId: 'PX5u4Lz98O',
		enableGA: true,
		gaId: 'UA-11686022-3',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
	},
	server: {
		graphqlUri: 'https://api.dev.kivaws.org/graphql',
	}
})

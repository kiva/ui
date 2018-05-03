var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://www-dev-kiva-org.global.ssl.fastly.net/ui/',
		graphqlUri: 'https://www.dev.kiva.org/ajax/graphql',
		enablePerimeterx: true,
		perimeterxAppId: 'PX5u4Lz98O',
		enableAnalytics: true,
		enableGTM: false,
		googleTagmanagerId: 'GTM-PXFRMT',
		enableGA: true,
		gaId: 'UA-11686022-3',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableFB: true,
		fbApplicationId: '364044572460',
		fbPixelId: '108245819986414',
	},
	server: {
		graphqlUri: 'https://api.dev.kivaws.org/graphql',
	}
})

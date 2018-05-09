var path = require('path')

module.exports = {
	app: {
		publicPath: 'https://www-kiva-org.global.ssl.fastly.net/ui/',
		graphqlUri: 'https://www.kiva.org/ajax/graphql',
		enablePerimeterx: true,
		perimeterxAppId: 'PXr3pNVz1F',
		enableAnalytics: true,
		enableGTM: false,
		googleTagmanagerId: 'GTM-PX6FDG',
		enableGA: true,
		gaId: 'UA-175897-4',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/kiva_rules',
		enableFB: true,
		fbApplicationId: '123230061223',
		fbPixelId: '1531213600467139',
	},
	server: {
		port: 8888,
		graphqlUri: 'https://api.kivaws.org/graphql',
		sessionUri: 'https://www.kiva.org/start-ui-session',
	},
	build: {
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		productionSourceMap: true,
	}
}

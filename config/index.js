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
	},
	build: {
		env: require('./env/prod.env'),
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		productionSourceMap: true,
		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	}
}

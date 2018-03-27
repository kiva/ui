var path = require('path')

module.exports = {
	app: {
		publicPath: 'https://www-kiva-org.global.ssl.fastly.net/ui/',
		graphqlUri: 'https://www.kiva.org/ajax/graphql',
		googleTagmanagerId: 'GTM-PX6FDG',
		perimeterxAppId: 'PXr3pNVz1F',
		enableAnalytics: false,
		enablePerimeterx: false,
	},
	server: {
		port: 8888,
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

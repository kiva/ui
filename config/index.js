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
		graphqlUri: 'https://api.kivaws.org/graphql',
	},
	build: {
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		productionSourceMap: true,
	}
}

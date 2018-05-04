var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://dev-vm-01.kiva.org/ui/',
		graphqlUri: 'https://dev-vm-01.kiva.org/ajax/graphql',
		enablePerimeterx: false,
		perimeterxAppId: '###',
		enableAnalytics: true,
		enableGTM: false,
		googleTagmanagerId: 'GTM-PXFRMT',
		enableGA: true,
		gaId: 'UA-11686022-7',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableFB: true,
		fbApplicationId: '263964058630',
		fbPixelId: '108245819986414',
	},
	server: {
		graphqlUri: 'https://api-vm.kiva.org/graphql',
		memcachedServers: ['localhost'],
	}
})

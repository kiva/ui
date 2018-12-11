var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://dev-vm-01.kiva.org/ui/',
		graphqlUri: 'https://dev-vm-01.kiva.org/ajax/graphql',
		enablePerimeterx: false,
		perimeterxAppId: '###',
		enableAnalytics: false,
		enableGTM: true,
		googleTagmanagerId: 'GTM-PXFRMT',
		enableGA: true,
		gaId: 'UA-11686022-7',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableFB: true,
		fbApplicationId: '263964058630',
		fbPixelId: '108245819986414',
		fbOgNameSpace: 'vm-kiva',
		enableSentry: false,
		sentryURI: '',
		algoliaAppId: 'H4ONVZQ2C6',
		algoliaApiKey: 'a373a52c000e929706c9e02a5862a327',
		algoliaDefaultIndex: 'dev_all_loans'
	},
	server: {
		graphqlUri: 'https://api-vm.kiva.org/graphql',
		sessionUri: 'https://dev-vm-01.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'localhost:11211',
	}
})

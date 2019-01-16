var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		host: 'www.stage.kiva.org',
		publicPath: 'https://www-stage-kiva-org.global.ssl.fastly.net/ui/',
		graphqlUri: 'https://www.stage.kiva.org/ajax/graphql',
		enablePerimeterx: false,
		perimeterxAppId: '####',
		enableAnalytics: true,
		enableGTM: true,
		googleTagmanagerId: 'GTM-K6HR28',
		enableGA: true,
		gaId: 'UA-11686022-5',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableFB: true,
		fbApplicationId: '2260431077572912',
		fbPixelId: '',
		fbOgNameSpace: 'stage-kiva',
		enableSentry: true,
		sentryURI: 'https://7ce141b23c4a4e6091c206d08442f0e9@sentry.io/1201287',
		algoliaAppId: 'H4ONVZQ2C6',
		algoliaApiKey: 'a373a52c000e929706c9e02a5862a327',
		algoliaDefaultIndex: 'dev_all_loans'
	},
	server: {
		graphqlUri: 'https://api.stage.kivaws.org/graphql',
		sessionUri: 'https://www.stage.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'stage-web-01:11211',
	}
})

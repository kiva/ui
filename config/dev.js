var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://www-dev-kiva-org.global.ssl.fastly.net/ui/',
		graphqlUri: 'https://www.dev.kiva.org/ajax/graphql',
		// graphqlUri: 'https://api.dev.kivaws.org/graphql', // when using auth0
		enablePerimeterx: true,
		perimeterxAppId: 'PX5u4Lz98O',
		enableAnalytics: true,
		enableGTM: true,
		googleTagmanagerId: 'GTM-PXFRMT',
		enableGA: true,
		gaId: 'UA-11686022-3',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableFB: true,
		fbApplicationId: '364044572460',
		fbPixelId: '108245819986414',
		fbOgNameSpace: 'dev-kiva',
		enableSentry: true,
		sentryURI: 'https://7ce141b23c4a4e6091c206d08442f0e9@sentry.io/1201287',
		algoliaAppId: 'H4ONVZQ2C6',
		algoliaApiKey: 'a373a52c000e929706c9e02a5862a327',
		algoliaDefaultIndex: 'dev_all_loans',
		enableAuth0: false,
		auth0ApiAudience: 'https://api.dev.kivaws.org/graphql',
		auth0BrowserClientID: 'ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF',
		auth0ServerClientID: 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH',
		auth0BrowserCallbackUri: 'https://www.dev.kiva.org/process-browser-auth',
		auth0ServerCallbackUri: 'https://www.dev.kiva.org/process-ssr-auth',
		auth0Domain: 'login.dev.kiva.org',
	},
	server: {
		graphqlUri: 'https://api.dev.kivaws.org/graphql',
		sessionUri: 'https://www.dev.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'dev-web-01:11211',
	}
})

var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		host: 'dev-vm-01.kiva.org',
		publicPath: 'https://dev-vm-01.kiva.org/ui/',
		graphqlUri: 'https://dev-vm-01.kiva.org/ajax/graphql',
		// graphqlUri: 'https://api-vm.kiva.org/graphql', // when using auth0
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
		algoliaDefaultIndex: 'dev_all_loans',
		enableAuth0: false,
		auth0ApiAudience: 'https://api.dev.kivaws.org/graphql',
		auth0BrowserClientID: 'ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF',
		auth0ServerClientID: 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH',
		auth0BrowserCallbackUri: 'https://dev-vm-01.kiva.org/process-browser-auth',
		auth0ServerCallbackUri: 'https://dev-vm-01.kiva.org/process-ssr-auth',
		auth0Domain: 'login.dev.kiva.org',
	},
	server: {
		graphqlUri: 'https://api-vm.kiva.org/graphql',
		sessionUri: 'https://dev-vm-01.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'localhost:11211',
	}
})

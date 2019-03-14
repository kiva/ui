var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		host: 'www.qa.kiva.org',
		publicPath: 'https://www-qa-kiva-org.global.ssl.fastly.net/ui/',
		graphqlUri: 'https://www.qa.kiva.org/ajax/graphql',
		// graphqlUri: 'https://api.qa.kivaws.org/graphql', // when using auth0
		enablePerimeterx: false,
		perimeterxAppId: '####',
		enableAnalytics: true,
		enableGTM: true,
		googleTagmanagerId: 'GTM-WXLS9B',
		enableGA: true,
		gaId: 'UA-11686022-4',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableFB: true,
		fbApplicationId: '370252743225',
		fbPixelId: '108245819986414',
		fbOgNameSpace: 'qa-kiva',
		enableSentry: false,
		sentryURI: '',
		algoliaConfig: {
			group: 'qa',
			appId: 'testingZ9YK0WNQ85',
			apiKey: '28aaa1d56e6a1688f13f6b41da0f27a5',
			defaultIndex: 'qa_fundraising_loans',
		},
		enableAuth0: false,
		auth0ApiAudience: 'https://api.dev.kivaws.org/graphql',
		auth0BrowserClientID: 'ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF',
		auth0ServerClientID: 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH',
		auth0BrowserCallbackUri: 'https://www.qa.kiva.org/process-browser-auth',
		auth0ServerCallbackUri: 'https://www.qa.kiva.org/process-ssr-auth',
		auth0Domain: 'login.dev.kiva.org',
		auth0: {
			loginRedirectUrls: {
				Sjw8ylxL4HZT5HzOtoGZMqoP5FQbTmPA: 'http://admin.qa.kiva.org/login',
				CeQC6x4yEVuzjgZ8ohQwBvZtAdHMFCTD: 'http://partners.qa.kiva.org/login',
				DI2eKv1v4S7Ms3ZtOej2xyeULKfXYd47: 'http://qa.kiva.org/authenticate',
			},
		},
	},
	server: {
		graphqlUri: 'https://api.qa.kivaws.org/graphql',
		sessionUri: 'https://www.qa.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'qa-web-01:11211',
	}
})

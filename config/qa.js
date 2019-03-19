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
		auth0: {
			loginRedirectUrls: {
				Sjw8ylxL4HZT5HzOtoGZMqoP5FQbTmPA: 'http://admin.qa.kiva.org/login',
				CeQC6x4yEVuzjgZ8ohQwBvZtAdHMFCTD: 'http://partners.qa.kiva.org/login',
				DI2eKv1v4S7Ms3ZtOej2xyeULKfXYd47: 'http://qa.kiva.org/authenticate',
			},
			enable: false,
			apiAudience: 'https://api.qa.kivaws.org/graphql',
			browserClientID: 'D4nisXFEuifQ8Am1WoJJpuneCBTBle3Q',
			serverClientID: 'tZuDW6xKBP5WYgP8FEwNsl41T4fhjWhF',
			browserCallbackUri: 'https://www.qa.kiva.org/process-browser-auth',
			serverCallbackUri: 'https://www.qa.kiva.org/process-ssr-auth',
			domain: 'login.qa.kiva.org',
		},
	},
	server: {
		graphqlUri: 'https://api.qa.kivaws.org/graphql',
		sessionUri: 'https://www.qa.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'qa-web-01:11211',
	}
})

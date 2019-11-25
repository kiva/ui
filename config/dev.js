var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		host: 'www.dev.kiva.org',
		publicPath: 'https://www-dev-kiva-org.freetls.fastly.net/ui/',
		graphqlUri: 'https://api.dev.kivaws.org/graphql',
		enablePerimeterx: true,
		perimeterxAppId: 'PX5u4Lz98O',
		enableAnalytics: true,
		enableGTM: true,
		googleTagmanagerId: 'GTM-PXFRMT',
		enableGA: true,
		gaId: 'UA-11686022-3',
		gaAlternateId: 'UA-11686022-6',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableFB: true,
		fbApplicationId: '364044572460',
		fbPixelId: '108245819986414',
		fbOgNameSpace: 'dev-kiva',
		enableSentry: true,
		sentryURI: 'https://7ce141b23c4a4e6091c206d08442f0e9@sentry.io/1201287',
		algoliaConfig: {
			enableAA: true,
			group: 'dev',
			appId: 'testingZ9YK0WNQ85',
			apiKey: '28aaa1d56e6a1688f13f6b41da0f27a5',
			defaultIndex: 'dev_fundraising_popularity',
		},
		auth0: {
			loginRedirectUrls: {
				cNTV7eN5sBKgv9nQOxDpAz1pPfJGlBI5: 'https://admin.dev.kiva.org/login',
				e6wSaTBDpKRkV5SV5cWw6zD6eJjd2DEk: 'https://partners.dev.kiva.org/login',
				xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: 'https://www.dev.kiva.org/authenticate',
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: 'https://www.dev.kiva.org/ui-login',
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: 'https://www.dev.kiva.org/ui-login',
			},
			enable: true,
			apiAudience: 'https://api.dev.kivaws.org/graphql',
			browserClientID: 'ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF',
			serverClientID: 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH',
			serverClientID: 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH',
			browserCallbackUri: 'https://www.dev.kiva.org/process-browser-auth',
			serverCallbackUri: 'https://www.dev.kiva.org/process-ssr-auth',
			domain: 'login.dev.kiva.org',
		},
		contentful: {
			environment: 'development'
		},
	},
	server: {
		graphqlUri: 'https://api.dev.kivaws.org/graphql',
		sessionUri: 'https://www.dev.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'dev-web-02:11211',
	}
})

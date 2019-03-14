var path = require('path')

module.exports = {
	app: {
		host: 'www.kiva.org',
		publicPath: 'https://www-kiva-org.global.ssl.fastly.net/ui/',
		graphqlUri: 'https://www.kiva.org/ajax/graphql',
		// graphqlUri: 'https://api.kivaws.org/graphql', // when using auth0
		enablePerimeterx: true,
		perimeterxAppId: 'PXr3pNVz1F',
		enableAnalytics: true,
		enableGTM: true,
		googleTagmanagerId: 'GTM-PX6FDG',
		enableGA: true,
		gaId: 'UA-175897-4',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/kiva_rules',
		enableFB: true,
		fbApplicationId: '123230061223',
		fbPixelId: '1531213600467139',
		fbOgNameSpace: 'kivadotorg',
		enableSentry: true,
		sentryURI: 'https://3ab8031cd8bf45d48f79e2b77657e16e@sentry.io/1201288',
		algoliaConfig: {
			group: 'prod',
			appId: 'H4ONVZQ2C6',
			apiKey: '82ec72aa3177a6f4fc47b7103e6db786',
			defaultIndex: 'prod_fundraising_loans',
		},
		enableAuth0: false,
		auth0ApiAudience: 'https://api.kivaws.org/graphql',
		auth0BrowserClientID: 'ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF', // @todo update with prod app id
		auth0ServerClientID: 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH', // @todo update with prod app id
		auth0BrowserCallbackUri: 'https://www.kiva.org/process-browser-auth',
		auth0ServerCallbackUri: 'https://www.kiva.org/process-ssr-auth',
		auth0Domain: 'login.kiva.org',
		auth0Scope: 'https://www.kiva.org/last_login ' +
			'https://www.kiva.org/kiva_id ' +
			'openid email profile',
		auth0: {
			loginRedirectUrls: {
				X6gQsD1f3Y4dvCQK8LGxYPc84UZ9Svts: 'http://admin.kiva.org/login',
				hIkkBL8POL6hCBp3uOI0bLMlz6nt2jW2: 'http://partners.kiva.org/login',
				maWr24ubbIjM4aOnWsQ7XWYBdJG9AL8g: 'http://www.kiva.org/authenticate',
			},
		},
	},
	server: {
		port: 8888,
		graphqlUri: 'https://api.kivaws.org/graphql',
		sessionUri: 'https://www.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'memcache-01:11211',
	},
	build: {
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		productionSourceMap: true,
	}
}

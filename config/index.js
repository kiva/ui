var path = require('path')

module.exports = {
	app: {
		host: 'www.kiva.org',
		publicPath: 'https://www-kiva-org.freetls.fastly.net/ui/',
		graphqlUri: 'https://api.kivaws.org/graphql',
		enablePerimeterx: true,
		perimeterxAppId: 'PXr3pNVz1F',
		enableAnalytics: true,
		enableGTM: true,
		googleTagmanagerId: 'GTM-PX6FDG',
		enableGA: true,
		gaId: 'UA-175897-4',
		gaAlternateId: 'UA-175897-21',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/kiva_rules',
		enableFB: true,
		fbApplicationId: '123230061223',
		fbPixelId: '1531213600467139',
		fbOgNameSpace: 'kivadotorg',
		enableSentry: true,
		sentryURI: 'https://3ab8031cd8bf45d48f79e2b77657e16e@sentry.io/1201288',
		algoliaConfig: {
			enableAA: true,
			group: 'prod',
			appId: 'H4ONVZQ2C6',
			apiKey: '82ec72aa3177a6f4fc47b7103e6db786',
			defaultIndex: 'prod_fundraising_popularity',
		},
		auth0: {
			loginRedirectUrls: {
				X6gQsD1f3Y4dvCQK8LGxYPc84UZ9Svts: 'https://admin.kiva.org/login',
				hIkkBL8POL6hCBp3uOI0bLMlz6nt2jW2: 'https://partners.kiva.org/login',
				PErQOIgS2YLVyBwtaK4eGcmHhIdC186g: 'https://www.kiva.org/authenticate',
				xRbi3nkuYZ2B8rjYg4VdyZb2EaI1fhPd: 'https://www.kiva.org/ui-login',
				AEnMbebwn6LBvxg1iMYczZKoAgdUt37K: 'https://www.kiva.org/ui-login',
			},
			enable: true,
			apiAudience: 'https://api.kivaws.org/graphql',
			browserClientID: 'AEnMbebwn6LBvxg1iMYczZKoAgdUt37K',
			serverClientID: 'xRbi3nkuYZ2B8rjYg4VdyZb2EaI1fhPd',
			browserCallbackUri: 'https://www.kiva.org/process-browser-auth',
			serverCallbackUri: 'https://www.kiva.org/process-ssr-auth',
			domain: 'login.kiva.org',
			scope: 'https://www.kiva.org/last_login ' +
				'https://www.kiva.org/kiva_id ' +
				'openid email profile',
		},
		contentful: {
			accessToken: 'kMmnBKkNsHXuCkBhcFUndWKXeWZ81NREp45K-VvtdMw',
			space: 'j0p9a6ql0rn7'
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
	}
}

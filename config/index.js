var path = require('path')

module.exports = {
	app: {
		host: 'www.kiva.org',
		publicPath: 'https://www-kiva-org.freetls.fastly.net/ui/',
		photoPath: 'https://www-kiva-org.freetls.fastly.net/img/',
		graphqlUri: 'https://marketplace-api.k1.kiva.org/graphql',
		enablePerimeterx: true,
		perimeterxAppId: 'PXr3pNVz1F',
		enableAnalytics: true,
		enableGTM: true,
		googleTagmanagerId: 'GTM-PX6FDG',
		enableGA: true,
		gaId: 'UA-175897-4',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/kiva_rules',
		enableHotjar: true,
		hotjarId: '3071239',
		enableOptimizely: true,
		optimizelyProjectId: '21625780072',
		enableFB: true,
		fbApplicationId: '123230061223',
		fbOgNameSpace: 'kivadotorg',
		enableFullStory: true,
		enableSentry: true,
		sentryURI: 'https://3ab8031cd8bf45d48f79e2b77657e16e@o7540.ingest.sentry.io/1201288',
		algoliaConfig: {
			enableAA: false,
			group: 'prod',
			appId: 'H4ONVZQ2C6',
			apiKey: '82ec72aa3177a6f4fc47b7103e6db786',
			defaultIndex: 'prod_fundraising_popularity',
		},
		btTokenKey: 'production_x6dwd3k4_f5swrg87wym8bx37',
		auth0: {
			loginRedirectUrls: {
				X6gQsD1f3Y4dvCQK8LGxYPc84UZ9Svts: 'https://admin.kiva.org/admin/login?force=1',
				hIkkBL8POL6hCBp3uOI0bLMlz6nt2jW2: 'https://partners.kiva.org/pa2/login/login?authLevel=recent',
				PErQOIgS2YLVyBwtaK4eGcmHhIdC186g: 'https://www.kiva.org/authenticate?authLevel=recent',
				xRbi3nkuYZ2B8rjYg4VdyZb2EaI1fhPd: 'https://www.kiva.org/ui-login?force=true',
				AEnMbebwn6LBvxg1iMYczZKoAgdUt37K: 'https://www.kiva.org/ui-login?force=true',
			},
			enable: true,
			checkFakeAuth: false,
			apiAudience: 'https://api.kivaws.org/graphql',
			mfaAudience: 'https://kiva-prod.auth0.com/mfa/',
			browserClientID: 'AEnMbebwn6LBvxg1iMYczZKoAgdUt37K',
			serverClientID: 'xRbi3nkuYZ2B8rjYg4VdyZb2EaI1fhPd',
			browserCallbackUri: 'https://www.kiva.org/process-browser-auth',
			serverCallbackUri: 'https://www.kiva.org/process-ssr-auth',
			domain: 'login.kiva.org',
			scope: 'openid mfa',
		},
		oneTrust: {
			enable: true,
			key: 'db9dcf94-1c32-40fb-9a57-cefafea1088d',
			domainSuffix: '',
		},
		paypal : {
			url: 'www.paypal.com',
			environment: 'production'
		},
		googlePay: {
			merchantId: '10620948091453922228'
		},
		locale: {
			default: 'en',
			supported: ['en', 'es', 'fr'],
		},
	},
	server: {
		port: 8888,
		graphqlUri: 'https://marketplace-api.k1.kiva.org/graphql',
		sessionUri: 'https://www.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'memcached-01:11211,memcached-02:11211',
		gzipEnabled: false,
	},
	build: {
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
	}
}

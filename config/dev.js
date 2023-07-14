const { merge } = require('webpack-merge');
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		host: 'www.dev.kiva.org',
		publicPath: 'https://www.dev.kiva.org/',
		photoPath: 'https://www-dev-kiva-org.freetls.fastly.net/img/',
		graphqlUri: 'https://marketplace-api.dk1.kiva.org/graphql',
		enablePerimeterx: true,
		perimeterxAppId: 'PX5u4Lz98O',
		enableAnalytics: true,
		enableGTM: true,
		googleTagmanagerId: 'GTM-PXFRMT',
		enableGA: true,
		gaId: 'UA-11686022-3',
		grecaptchaSitekey: '6LcXENcmAAAAAEC4ygspn1WTm4zP4gLexXDnWuXE',
		enableHotjar: true,
		hotjarId: '3071239',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableFB: true,
		fbApplicationId: '364044572460',
		fbOgNameSpace: 'dev-kiva',
		enableSentry: true,
		sentryURI: 'https://7ce141b23c4a4e6091c206d08442f0e9@o7540.ingest.sentry.io/1201287',
		algoliaConfig: {
			group: 'dev',
			appId: 'testingZ9YK0WNQ85',
			apiKey: '28aaa1d56e6a1688f13f6b41da0f27a5',
			defaultIndex: 'dev_fundraising_popularity',
		},
		btTokenKey: 'sandbox_q7kbtvzy_vynd473f79sfskz3',
		auth0: {
			loginRedirectUrls: {
				cNTV7eN5sBKgv9nQOxDpAz1pPfJGlBI5: 'https://admin.dev.kiva.org/admin/login?force=1',
				e6wSaTBDpKRkV5SV5cWw6zD6eJjd2DEk: 'https://partners.dev.kiva.org/pa2/login/login?authLevel=recent',
				xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: 'https://www.dev.kiva.org/authenticate?authLevel=recent',
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: 'https://www.dev.kiva.org/ui-login?force=true',
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: 'https://www.dev.kiva.org/ui-login?force=true',
			},
			enable: true,
			checkFakeAuth: true,
			apiAudience: 'https://api.dev.kivaws.org/graphql',
			mfaAudience: 'https://kiva-dev.auth0.com/mfa/',
			browserClientID: 'ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF',
			serverClientID: 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH',
			browserCallbackUri: 'https://www.dev.kiva.org/process-browser-auth',
			serverCallbackUri: 'https://www.dev.kiva.org/process-ssr-auth',
			domain: 'login.dev.kiva.org',
		},
		paypal : {
			url: 'www.sandbox.paypal.com',
			environment: 'sandbox'
		},
		oneTrust: {
			enable: true,
			key: 'db9dcf94-1c32-40fb-9a57-cefafea1088d',
			domainSuffix: '-test',
		},
	},
	server: {
		graphqlUri: 'https://marketplace-api.dk1.kiva.org/graphql',
		sessionUri: 'https://www.dev.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'dev-memcached-01:11211,dev-memcached-02:11211',
		disableCluster: true
	}
})

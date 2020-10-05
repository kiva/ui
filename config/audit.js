const { merge } = require('webpack-merge');
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		host: 'www.audit.kiva.org',
		publicPath: 'https://www-audit-kiva-org.freetls.fastly.net/ui/',
		graphqlUri: 'https://marketplace-api.dk1.kiva.org/graphql',
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
		fbOgNameSpace: 'audit-kiva',
		enableSentry: true,
		sentryURI: 'https://7ce141b23c4a4e6091c206d08442f0e9@sentry.io/1201287',
		algoliaConfig: {
			enableAA: true,
			group: 'audit',
			appId: 'testingZ9YK0WNQ85',
			apiKey: '28aaa1d56e6a1688f13f6b41da0f27a5',
			defaultIndex: 'audit_fundraising_popularity',
		},
		auth0: {
			loginRedirectUrls: {
				cNTV7eN5sBKgv9nQOxDpAz1pPfJGlBI5: 'https://admin.audit.kiva.org/admin/login?force=1',
				e6wSaTBDpKRkV5SV5cWw6zD6eJjd2DEk: 'https://partners.audit.kiva.org/pa2/login/login?authLevel=recent',
				xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: 'https://www.audit.kiva.org/authenticate?authLevel=recent',
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: 'https://www.audit.kiva.org/ui-login?force=true',
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: 'https://www.audit.kiva.org/ui-login?force=true',
			},
			enable: true,
			apiAudience: 'https://api.audit.kivaws.org/graphql',
			browserClientID: 'ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF',
			serverClientID: 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH',
			browserCallbackUri: 'https://www.audit.kiva.org/process-browser-auth',
			serverCallbackUri: 'https://www.audit.kiva.org/process-ssr-auth',
			domain: 'login.audit.kiva.org',
		},
		intercom: {
			enable: true,
		},
		paypal : {
			url: 'www.sandbox.paypal.com',
			environment: 'sandbox'
		},
	},
	server: {
		graphqlUri: 'https://marketplace-api.dk1.kiva.org/graphql',
		sessionUri: 'https://www.audit.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'audit-memcached-01:11211',
	}
})

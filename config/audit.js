var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		host: 'www.audit.kiva.org',
		publicPath: 'https://www-audit-kiva-org.freetls.fastly.net/ui/',
		graphqlUri: 'https://api.audit.kivaws.org/graphql',
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
				erMiYChkrfWfIDiBdybgOUy5v5V2xSsF: 'https://admin.audit.kiva.org/login',
				Y24mV3SPmgnsrwSUfqelVSucLHfLeJUl: 'https://partners.audit.kiva.org/login',
				i4FGTy2eb69K1fga4VnhkK2ujtRxDMio: 'https://www.audit.kiva.org/authenticate',
				26KTpMLdMUDdqWYrTYU3uu6reqVa7JcQ: 'https://www.audit.kiva.org/ui-login',
				BvSELfanq0c6p36hVRcCL5QREpzz6ioc: 'https://www.audit.kiva.org/ui-login',
			},
			enable: true,
			apiAudience: 'https://api.audit.kivaws.org/graphql',
			browserClientID: 'BvSELfanq0c6p36hVRcCL5QREpzz6ioc',
			serverClientID: '26KTpMLdMUDdqWYrTYU3uu6reqVa7JcQ',
			browserCallbackUri: 'https://www.audit.kiva.org/process-browser-auth',
			serverCallbackUri: 'https://www.audit.kiva.org/process-ssr-auth',
			domain: 'login.audit.kiva.org',
		},
		contentful: {
			environment: 'development'
		},
	},
	server: {
		graphqlUri: 'https://api.audit.kivaws.org/graphql',
		sessionUri: 'https://www.audit.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'audit-web-02:11211',
	}
})

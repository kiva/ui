const { merge } = require('webpack-merge');
var base = require('./index.js')

const apolloBatching = process.env.APOLLO_BATCH !== 'false';
const memcachedServers = process.env.MEMCACHE_HOST || 'ui-memcached:11211';
const baseUrl = process.env.BASE_URL || 'development.kiva.org';
const env = process.env.SHORT_ENV || 'dev';
const enableOptimizely = process.env.ENABLE_OPTIMIZELY !== 'false';
const enablePerimeterx = process.env.ENABLE_PERIMETERX !== 'false';

module.exports = merge(base, {
	app: {
		apolloBatching,
		host: `www.${baseUrl}`,
		publicPath: `https://www.${baseUrl}/`,
		photoPath: process.env.PHOTO_PATH || 'https://www-dev-kiva-org.freetls.fastly.net/img/',
		graphqlUri: `https://gateway.${baseUrl}/graphql`,
		enablePerimeterx,
		perimeterxAppId: process.env.PERIMETERX_APP_ID || 'PX5u4Lz98O',
		enableAnalytics: true,
		enableGTM: true,
		googleTagmanagerId: process.env.GOOGLE_TAG_MANAGER_ID || 'GTM-PXFRMT',
		enableGA: true,
		gaId: process.env.GOOGLE_ANALYTICS_ID || 'UA-11686022-3',
		grecaptchaSitekey: '6LcXENcmAAAAAEC4ygspn1WTm4zP4gLexXDnWuXE',
		enableHotjar: true,
		hotjarId: process.env.HOTJAR_ID || '3071239',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableFB: true,
		enableOptimizely,
		fbApplicationId: process.env.FACEBOOK_APP_ID || '364044572460',
		fbOgNameSpace: `${env}-kiva`,
		enableSentry: true,
		sentryURI: 'https://7ce141b23c4a4e6091c206d08442f0e9@o7540.ingest.sentry.io/1201287',
		algoliaConfig: {
			group: `${env}`,
			appId: 'testingZ9YK0WNQ85',
			apiKey: '28aaa1d56e6a1688f13f6b41da0f27a5',
			defaultIndex: `${env}_fundraising_popularity`,
		},
		btTokenKey: 'sandbox_q7kbtvzy_vynd473f79sfskz3',
		auth0: {
			loginRedirectUrls: {
				cNTV7eN5sBKgv9nQOxDpAz1pPfJGlBI5: `https://admin.${baseUrl}/admin/login?force=1`,
				e6wSaTBDpKRkV5SV5cWw6zD6eJjd2DEk: `https://partners.${baseUrl}/pa2/login/login?authLevel=recent`,
				xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: `https://www.${baseUrl}/authenticate?authLevel=recent`,
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: `https://www.$baseUrl}/ui-login?force=true`,
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: `https://www.${baseUrl}/ui-login?force=true`,
			},
			enable: true,
			checkFakeAuth: true,
			apiAudience: `https://api.${env}.kivaws.org/graphql`,
			mfaAudience: `https://kiva-${env}.auth0.com/mfa/`,
			browserClientID: process.env.BROWSER_CLIENT_ID || 'ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF',
			serverClientID: process.env.SERVER_CLIENT_ID || 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH',
			browserCallbackUri: `https://www.${baseUrl}/process-browser-auth`,
			serverCallbackUri: `https://www.${baseUrl}/process-ssr-auth`,
			domain: `login.${env}.kiva.org`,
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
		graphqlUri: `https://gateway.${baseUrl}/graphql`,
		sessionUri: `https://www.${baseUrl}/start-ui-session`,
		memcachedEnabled: true,
		memcachedServers,
		disableCluster: true
	}
})

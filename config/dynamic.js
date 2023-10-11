const path = require("path");

const apolloBatching = process.env.APOLLO_BATCH !== 'false';
const memcachedServers = process.env.MEMCACHE_HOST || 'ui-memcached:11211';
const baseUrl = process.env.BASE_URL || 'development.kiva.org';
const env = process.env.SHORT_ENV || 'dev';
const formattedUrlEnv = env === 'prod' ? '' : `${env}.`;
const enableOptimizely = process.env.ENABLE_OPTIMIZELY !== 'false';
const enablePerimeterx = process.env.ENABLE_PERIMETERX !== 'false';
const enableHotjar = process.env.ENABLE_HOTJAR !== 'false';

// Auth0 app IDs
const adminAuthId = process.env.ADMIN_AUTH_ID || 'cNTV7eN5sBKgv9nQOxDpAz1pPfJGlBI5';
const partnerAuthId = process.env.PARTNER_AUTH_ID || 'e6wSaTBDpKRkV5SV5cWw6zD6eJjd2DEk';
const wwwAuthId = process.env.WWW_AUTH_ID || 'xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD';
const browserClientID = process.env.BROWSER_CLIENT_ID || 'ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF';
const serverClientID = process.env.SERVER_CLIENT_ID || 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH';

const checkFakeAuth = process.env.CHECK_FAKE_AUTH === 'true';

module.exports = {
	app: {
		algoliaConfig: {
			group: `${env}`,
			appId: process.env.ALGOLIA_APP_ID || 'testingZ9YK0WNQ85',
			apiKey: process.env.ALGOLIA_API_KEY || '28aaa1d56e6a1688f13f6b41da0f27a5',
			defaultIndex: `${env}_fundraising_popularity`,
		},
		apolloBatching,
		auth0: {
			loginRedirectUrls: {
				[adminAuthId]: `https://admin.${baseUrl}/admin/login?force=1`,
				[partnerAuthId]: `https://partners.${baseUrl}/pa2/login/login?authLevel=recent`,
				[wwwAuthId]: `https://www.${baseUrl}/authenticate?authLevel=recent`,
				[serverClientID]: `https://www.${baseUrl}/ui-login?force=true`,
				[browserClientID]: `https://www.${baseUrl}/ui-login?force=true`,
			},
			enable: true,
			checkFakeAuth,
			apiAudience: `https://api.${baseUrl}/graphql`,
			mfaAudience: `https://kiva-${env}.auth0.com/mfa/`,
			browserClientID,
			serverClientID,
			browserCallbackUri: `https://www.${baseUrl}/process-browser-auth`,
			serverCallbackUri: `https://www.${baseUrl}/process-ssr-auth`,
			domain: `login.${formattedUrlEnv}kiva.org`,
			scope: 'openid mfa',
		},
		btTokenKey: process.env.BT_TOKEN_KEY || 'sandbox_q7kbtvzy_vynd473f79sfskz3',
		enableAnalytics: true,
		enableFB: true,
		enableGA: true,
		enableGTM: true,
		enableHotjar,
		enableOptimizely,
		enablePerimeterx,
		enableSentry: true,
		enableSnowplow: true,
		fbApplicationId: process.env.FACEBOOK_APP_ID || '364044572460',
		fbOgNameSpace: process.env.FB_OG_NAMESPACE || `${env}-kiva`,
		gaId: process.env.GOOGLE_ANALYTICS_ID || 'UA-11686022-3',
		googlePay: {
			merchantId: '10620948091453922228'
		},
		googleTagmanagerId: process.env.GOOGLE_TAG_MANAGER_ID || 'GTM-PXFRMT',
		graphqlUri: `https://gateway.${baseUrl}/graphql`,
		grecaptchaSitekey: process.env.G_RECAPTCHA_SITE_KEY || '6LcXENcmAAAAAEC4ygspn1WTm4zP4gLexXDnWuXE',
		host: `www.${baseUrl}`,
		hotjarId: process.env.HOTJAR_ID || '3071239',
		locale: {
			default: 'en',
			supported: ['en', 'es', 'fr'],
		},
		oneTrust: {
			enable: true,
			key: 'db9dcf94-1c32-40fb-9a57-cefafea1088d',
			domainSuffix: process.env.ONE_TRUST_DOMAIN_SUFFIX || '-test',
		},
		optimizelyProjectId: '21625780072',
		paypal : {
			url: process.env.PAYPAL_URL || 'www.sandbox.paypal.com',
			environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox'
		},
		perimeterxAppId: process.env.PERIMETERX_APP_ID || 'PX5u4Lz98O',
		photoPath: process.env.PHOTO_PATH || 'https://www-dev-kiva-org.freetls.fastly.net/img/',
		publicPath: process.env.PUBLIC_PATH || `https://www.${baseUrl}/`,
		sentryURI: process.env.SENTRY_URI || 'https://7ce141b23c4a4e6091c206d08442f0e9@o7540.ingest.sentry.io/1201287',
		snowplowUri: process.env.SNOWPLOW_URI || 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		transport: 'https',
	},
	build: {
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
	},
	server: {
		disableCluster: true,
		graphqlUri: `https://gateway.${baseUrl}/graphql`,
		gzipEnabled: false,
		memcachedEnabled: true,
		memcachedServers,
		port: 8888,
		sessionUri: `https://www.${baseUrl}/start-ui-session`,
	}
}

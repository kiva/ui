const { merge } = require('webpack-merge');
var base = require('./index.js')

const transport = process.env.TRANSPORT || "http"
const monolithHostname = process.env.MONOLITH_HOSTNAME || "localhost"
const apiHostname = process.env.API_HOSTNAME || "localhost"

module.exports = merge(base, {
	app: {
		host: `${monolithHostname}`,
		transport: `${transport}`,
		publicPath: `${transport}://${monolithHostname}/ui/`,
		photoPath: `${transport}://${monolithHostname}/img/`,
		graphqlUri: `${transport}://${apiHostname}/graphql`,
		// Run federation
		// graphqlUri: 'https://api-vm.kiva.org/fed/graphql',
		// Use this to debug graphql calls in PHPStorm
		// graphqlUri: 'https://api-vm.kiva.org/graphql?XDEBUG_SESSION_START=PHPSTORM',
		// use this to override authentication
		// graphqlUri: 'https://api-vm.kiva.org/graphql?user_id=<user id>&app_id=org.kiva.www&scopes=access',
		enablePerimeterx: false,
		perimeterxAppId: '###',
		enableAnalytics: false,
		enableGTM: false,
		googleTagmanagerId: 'GTM-PXFRMT',
		enableGA: false,
		gaId: 'UA-11686022-7',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableHotjar: false,
		hotjarId: '3112979',
		enableOptimizely: false,
		enableFB: false,
		fbApplicationId: '263964058630',
		fbOgNameSpace: 'vm-kiva',
		enableSentry: false,
		sentryURI: '',
		algoliaConfig: {
			group: 'dev',
			appId: 'testingZ9YK0WNQ85',
			apiKey: '28aaa1d56e6a1688f13f6b41da0f27a5',
			defaultIndex: 'dev_fundraising_popularity',
		},
		btTokenKey: 'sandbox_q7kbtvzy_vynd473f79sfskz3',
		auth0: {
			loginRedirectUrls: {
				cNTV7eN5sBKgv9nQOxDpAz1pPfJGlBI5: `http://${monolithHostname}/login?force=1`,
				e6wSaTBDpKRkV5SV5cWw6zD6eJjd2DEk: `http://${monolithHostname}/pa2/login/login?authLevel=recent`,
				xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: `${transport}://${monolithHostname}/authenticate?authLevel=recent`,
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: `${transport}://${monolithHostname}/ui-login?force=true`,
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: `${transport}://${monolithHostname}/ui-login?force=true`,
			},
			enable: true,
			checkFakeAuth: true,
			apiAudience: 'https://api.dev.kivaws.org/graphql',
			mfaAudience: 'https://kiva-dev.auth0.com/mfa/',
			browserClientID: 'ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF',
			serverClientID: 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH',
			browserCallbackUri: `${transport}://${monolithHostname}/process-browser-auth`,
			serverCallbackUri: `${transport}://${monolithHostname}/process-ssr-auth`,
			domain: 'login.dev.kiva.org',
		},
		paypal: {
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
		graphqlUri: `${transport}://${apiHostname}/graphql`,
		// Run federation
		// graphqlUri: '${transport}://api-vm.kiva.org/fed/graphql',
		sessionUri: `${transport}://${monolithHostname}/start-ui-session`,
		memcachedEnabled: true,
		memcachedServers: 'localhost:11211',
		// disableCluster: true,
	}
})

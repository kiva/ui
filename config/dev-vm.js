const { merge } = require('webpack-merge');
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		host: 'dev-vm-01.kiva.org',
		publicPath: 'https://dev-vm-01.kiva.org/ui/',
		graphqlUri: 'https://api-vm.kiva.org/graphql',
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
		gaAlternateId: '',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableFB: false,
		fbApplicationId: '263964058630',
		fbPixelId: '108245819986414',
		fbOgNameSpace: 'vm-kiva',
		enableSentry: false,
		sentryURI: '',
		algoliaConfig: {
			enableAA: false,
			group: 'dev',
			appId: 'testingZ9YK0WNQ85',
			apiKey: '28aaa1d56e6a1688f13f6b41da0f27a5',
			defaultIndex: 'dev_fundraising_popularity',
		},
		auth0: {
			loginRedirectUrls: {
				cNTV7eN5sBKgv9nQOxDpAz1pPfJGlBI5: 'http://admin-vm.kiva.org/login?force=1',
				e6wSaTBDpKRkV5SV5cWw6zD6eJjd2DEk: 'http://partners-vm.kiva.org/pa2/login/login?authLevel=recent',
				xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: 'https://dev-vm-01.kiva.org/authenticate?authLevel=recent',
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: 'https://dev-vm-01.kiva.org/ui-login?force=true',
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: 'https://dev-vm-01.kiva.org/ui-login?force=true',
			},
			enable: true,
			apiAudience: 'https://api.dev.kivaws.org/graphql',
			browserClientID: 'ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF',
			serverClientID: 'KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH',
			browserCallbackUri: 'https://dev-vm-01.kiva.org/process-browser-auth',
			serverCallbackUri: 'https://dev-vm-01.kiva.org/process-ssr-auth',
			domain: 'login.dev.kiva.org',
		},
		federationService: {
			uri: 'https://marketplace-api.dk1.kiva.org/graphql'
		},
		intercom: {
			enable: false,
		},
		paypal : {
			url: 'www.sandbox.paypal.com',
			environment: 'sandbox'
		},
	},
	server: {
		graphqlUri: 'https://api-vm.kiva.org/graphql',
		// Run federation
		// graphqlUri: 'https://api-vm.kiva.org/fed/graphql',
		sessionUri: 'https://dev-vm-01.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'localhost:11211',
		// disableCluster: true,
	}
})

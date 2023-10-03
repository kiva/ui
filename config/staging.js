const { merge } = require('webpack-merge');
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		host: 'www.staging.kiva.org',
		publicPath: 'https://www.development.kiva.org/',
		photoPath: 'https://www-stage-kiva-org.freetls.fastly.net/img/',
		graphqlUri: 'https://gateway.staging.kiva.org/graphql',
		enablePerimeterx: false,
		perimeterxAppId: '####',
		enableAnalytics: true,
		enableGTM: true,
		googleTagmanagerId: 'GTM-K6HR28',
		enableGA: true,
		gaId: 'UA-11686022-5',
		grecaptchaSitekey: '6LcXENcmAAAAAEC4ygspn1WTm4zP4gLexXDnWuXE',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableHotjar: false,
		hotjarId: '3112979',
		enableOptimizely: false,
		enableFB: true,
		fbApplicationId: '2260431077572912',
		fbOgNameSpace: 'stage-kiva',
		enableSentry: true,
		sentryURI: 'https://7ce141b23c4a4e6091c206d08442f0e9@o7540.ingest.sentry.io/1201287',
		algoliaConfig: {
			group: 'stage',
			appId: 'testingZ9YK0WNQ85',
			apiKey: '28aaa1d56e6a1688f13f6b41da0f27a5',
			defaultIndex: 'stage_fundraising_popularity',
		},
		btTokenKey: 'sandbox_q7kbtvzy_vynd473f79sfskz3',
		auth0: {
			loginRedirectUrls: {
				iHNp5rV3XxaozU7B50oXpNye6RCAE5OD: 'https://admin.staging.kiva.org/admin/login?force=1',
				fNYmJqpKX6mWiz1Evk8b1eqbM9KoeQ45: 'https://partners.staging.kiva.org/pa2/login/login?authLevel=recent',
				'5NP78k662QLODpkk4VzMyKxP0QWTcVmB': 'https://www.staging.kiva.org/authenticate?authLevel=recent',
				Ch7rwGop9lctGpm5KfEl6VTVMrqKoWZ4: 'https://www.staging.kiva.org/ui-login?force=true',
				pK7XVUBouUjPEFm9bz5MN7sjU5HACqqe: 'https://www.staging.kiva.org/ui-login?force=true',
			},
			enable: true,
			checkFakeAuth: true,
			apiAudience: 'https://api.stage.kivaws.org/graphql',
			mfaAudience: 'https://kiva-stage.auth0.com/mfa/',
			browserClientID: 'pK7XVUBouUjPEFm9bz5MN7sjU5HACqqe',
			serverClientID: 'Ch7rwGop9lctGpm5KfEl6VTVMrqKoWZ4',
			browserCallbackUri: 'https://www.staging.kiva.org/process-browser-auth',
			serverCallbackUri: 'https://www.staging.kiva.org/process-ssr-auth',
			domain: 'login.stage.kiva.org',
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
		graphqlUri: 'https://gateway.staging.kiva.org/graphql',
		sessionUri: 'https://www.staging.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'stage-memcached-01:11211',
	}
})

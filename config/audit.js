const { merge } = require('webpack-merge');
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		host: 'www.audit.kiva.org',
		publicPath: 'https://www-audit-kiva-org.freetls.fastly.net/ui/',
		photoPath: 'https://www-audit-kiva-org.freetls.fastly.net/img/',
		graphqlUri: 'https://marketplace-api-audit.dk1.kiva.org/graphql',
		enablePerimeterx: true,
		perimeterxAppId: 'PX5u4Lz98O',
		enableAnalytics: true,
		enableGTM: true,
		googleTagmanagerId: 'GTM-PXFRMT',
		enableGA: true,
		gaId: 'UA-11686022-3',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableHotjar: false,
		hotjarId: '3112979',
		enableOptimizely: false,
		enableFB: true,
		fbApplicationId: '364044572460',
		fbOgNameSpace: 'audit-kiva',
		enableSentry: false,
		sentryURI: '',
		algoliaConfig: {
			group: 'audit',
			appId: 'testingZ9YK0WNQ85',
			apiKey: '28aaa1d56e6a1688f13f6b41da0f27a5',
			defaultIndex: 'audit_fundraising_popularity',
		},
		btTokenKey: 'sandbox_q7kbtvzy_vynd473f79sfskz3',
		auth0: {
			loginRedirectUrls: {
				A4914FJRPa71OPMzR0T106GPxVHH3q5c: 'https://admin.audit.kiva.org/admin/login?force=1',
				aXEO12lKmGd1qSDMb0V6QYMbb40He8Wd: 'https://partners.audit.kiva.org/pa2/login/login?authLevel=recent',
				lLGHlyn6iT1uzE0tbWQaoLcjdDe5u1Po: 'https://www.audit.kiva.org/authenticate?authLevel=recent',
				'372Ui67a51VX4AcSq9FjUOuQD3dfKNUt': 'https://www.audit.kiva.org/ui-login?force=true',
				Pc96rp0vzWOcAlWk5HJTozjTTP6qZyDP: 'https://www.audit.kiva.org/ui-login?force=true',
			},
			enable: true,
			apiAudience: 'https://api.audit.kivaws.org/graphql',
			mfaAudience: 'https://kiva-audit.auth0.com/mfa/',
			browserClientID: 'Pc96rp0vzWOcAlWk5HJTozjTTP6qZyDP',
			serverClientID: '372Ui67a51VX4AcSq9FjUOuQD3dfKNUt',
			browserCallbackUri: 'https://www.audit.kiva.org/process-browser-auth',
			serverCallbackUri: 'https://www.audit.kiva.org/process-ssr-auth',
			domain: 'login.audit.kiva.org',
		},
		paypal : {
			url: 'www.sandbox.paypal.com',
			environment: 'sandbox'
		},
	},
	server: {
		graphqlUri: 'https://marketplace-api-audit.dk1.kiva.org/graphql',
		sessionUri: 'https://www.audit.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'audit-memcached-01:11211',
	}
})

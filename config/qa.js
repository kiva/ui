var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://www-qa-kiva-org.global.ssl.fastly.net/ui/',
		graphqlUri: 'https://www.qa.kiva.org/ajax/graphql',
		enablePerimeterx: false,
		perimeterxAppId: '####',
		enableAnalytics: true,
		enableGTM: false,
		googleTagmanagerId: 'GTM-WXLS9B',
		enableGA: true,
		gaId: 'UA-11686022-4',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableFB: true,
		fbApplicationId: '370252743225',
		fbPixelId: '108245819986414',
		fbOgNameSpace: 'qa-kiva',
		enableSentry: false,
		sentryURI: ''
	},
	server: {
		graphqlUri: 'https://api.qa.kivaws.org/graphql',
		sessionUri: 'https://www.qa.kiva.org/start-ui-session',
		memcachedEnabled: true,
		memcachedServers: 'qa-web-01:11211',
	}
})

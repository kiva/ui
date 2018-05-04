var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://dev-vm-01.kiva.org/ui/',
		graphqlUri: 'https://dev-vm-01.kiva.org/ajax/graphql',
		googleTagmanagerId: 'GTM-PXFRMT',
		enableGA: true,
		gaId: 'UA-11686022-7',
		enableSnowplow: true,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableSentry: true,
		sentryURI: 'https://845904672b2a40048c8340268928b614@sentry.io/1201289'
	},
	server: {
		graphqlUri: 'https://api-vm.kiva.org/graphql',
		memcachedServers: ['localhost'],
	}
})

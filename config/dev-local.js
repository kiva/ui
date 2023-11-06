const { merge } = require('webpack-merge');
var base = require('./index.js')
var devVm  = require('./dev-vm.js')

module.exports = merge(base, devVm, {
	app: {
		apolloBatching: false,
		host: 'localhost',
		publicPath: '/',
		photoPath: 'https://www.development.kiva.org/img/',
		graphqlUri: 'https://gateway.development.kiva.org/graphql',
		enableAnalytics: false,
		enableSnowplow: false,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableGA: false,
		gaId: 'UA-11686022-7', // dev-vm property
		auth0: {
			loginRedirectUrls: {
				xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: 'https://www.dev.kiva.org/authenticate?authLevel=recent',
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: 'http://localhost:8888/ui-login?force=true',
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: 'http://localhost:8888/ui-login?force=true',
			},
			enable: true,
			browserCallbackUri: 'http://localhost:8888/process-browser-auth',
			serverCallbackUri: 'http://localhost:8888/process-ssr-auth',
			apiAudience: 'https://api.development.kiva.org/graphql',
		},
	},
	server: {
		graphqlUri: 'https://gateway.development.kiva.org/graphql',
		sessionUri: 'https://www.development.kiva.org/start-ui-session',
		memcachedEnabled: false,
		disableCluster: true,
	}
})

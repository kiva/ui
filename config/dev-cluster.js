const { merge } = require('webpack-merge');
var base = require('./index.js')
var devLocal  = require('./dev-local.js')

const apolloBatch = process.env.APOLLO_BATCH || true;

module.exports = merge(base, devLocal, {
	app: {
		apolloBatching: false,
		host: 'localhost',
		publicPath: '/',
		photoPath: 'https://www-dev-kiva-org.freetls.fastly.net/img/',
		graphqlUri: 'https://gateway.development.kiva.org/graphql',
		enableAnalytics: false,
		enableSnowplow: false,
		snowplowUri: 'events.fivetran.com/snowplow/v5qt54ocr2nm',
		enableGA: false,
		gaId: 'UA-11686022-7', // dev-vm property
		auth0: {
			loginRedirectUrls: {
				xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: 'https://kiva.development.kiva.org/authenticate?authLevel=recent',
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: 'http://localhost:8888/ui-login?force=true',
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: 'http://localhost:8888/ui-login?force=true',
			},
			enable: true,
			browserCallbackUri: 'http://localhost:8888/process-browser-auth',
			serverCallbackUri: 'http://localhost:8888/process-ssr-auth',
		},
	},
	server: {
		graphqlUri: 'https://gateway.development.kiva.org/graphql',
		sessionUri: 'https://kiva.development.kiva.org/start-ui-session',
		memcachedEnabled: false,
		disableCluster: true,
	}
})

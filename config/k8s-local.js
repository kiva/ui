const { merge } = require('webpack-merge');
var base = require('./index.js')
var devVm  = require('./dev-vm.js')

const transport = process.env.TRANSPORT || "https"
const monolithHostname = process.env.MONOLITH_HOSTNAME || "monolith.kiva.local"
const apiHostname = process.env.API_HOSTNAME || "api.kiva.local"

module.exports = merge(base, devVm, {
	app: {
		apolloBatching: false,
		host: `${monolithHostname}`,
		transport: `${transport}`,
		publicPath: `${transport}://${monolithHostname}/ui/`,
		photoPath: `${transport}://${monolithHostname}/img/`,
		graphqlUri: `${transport}://${apiHostname}/fed/graphql`,
		auth0: {
			loginRedirectUrls: {
				cNTV7eN5sBKgv9nQOxDpAz1pPfJGlBI5: `http://${monolithHostname}/login?force=1`,
				e6wSaTBDpKRkV5SV5cWw6zD6eJjd2DEk: `http://${monolithHostname}/pa2/login/login?authLevel=recent`,
				xOXldYg02WsLnlnn0D5xoPWI2i3aNsFD: `${transport}://${monolithHostname}/authenticate?authLevel=recent`,
				KIzjUBQjKZwMRgYSn6NvMxsUwNppwnLH: `${transport}://${monolithHostname}/ui-login?force=true`,
				ouGKxT4mE4wQEKqpfsHSE96c9rHXQqZF: `${transport}://${monolithHostname}/ui-login?force=true`,
			},
			browserCallbackUri: `${transport}://${monolithHostname}/process-browser-auth`,
			serverCallbackUri: `${transport}://${monolithHostname}/process-ssr-auth`,
		},
	},
	server: {
		graphqlUri: `${transport}://${apiHostname}/fed/graphql`,
		sessionUri: `${transport}://${monolithHostname}/start-ui-session`,
		// memcachedEnabled: false,
		memcachedEnabled: true,
		memcachedServers: 'localhost:11211',
		disableCluster: true,
	}
})

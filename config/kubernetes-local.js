const { merge } = require('webpack-merge');
var base = require('./index.js')
var devVm  = require('./dev-vm.js')

const transport = process.env.TRANSPORT || "http"
const monolithHostname = process.env.MONOLITH_HOSTNAME || "monolith.kiva.local"
const apiHostname = process.env.API_HOSTNAME || "api.kiva.local"

module.exports = merge(base, devVm, {
	app: {
		graphqlUri: `https://${apiHostname}/fed/graphql`,
	},
	server: {
		graphqlUri: `https://${apiHostname}/fed/graphql`,
		// memcachedEnabled: false,
		memcachedEnabled: true,
		memcachedServers: 'localhost:11211',
		disableCluster: true,
	}
})

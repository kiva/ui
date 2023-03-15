const { merge } = require('webpack-merge');
var base = require('./index.js')
var devVm  = require('./dev-vm.js')

const transport = process.env.TRANSPORT || "https"
const monolithHostname = process.env.MONOLITH_HOSTNAME || "dev-vm-01.kiva.org"
const apiHostname = process.env.API_HOSTNAME || "api-vm-01.kiva.org"

module.exports = merge(base, devVm, {
	app: {
		graphqlUri: `${transport}://${apiHostname}/fed/graphql`,
	},
	server: {
		graphqlUri: `${transport}://${apiHostname}/fed/graphql`,
		memcachedEnabled: true,
		memcachedServers: 'localhost:11211',
		disableCluster: true,
	}
})

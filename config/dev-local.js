const { merge } = require('webpack-merge');
var base = require('./index.js')
var devVm  = require('./dev-vm.js')

module.exports = merge(base, devVm, {
	app: {
		graphqlUri: 'https://api-vm.kiva.org/fed/graphql',
	},
	server: {
		graphqlUri: 'https://api-vm.kiva.org/fed/graphql',
		// memcachedEnabled: false,
		memcachedEnabled: true,
		memcachedServers: 'memcached:11211',
		disableCluster: true,
	}
})

var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://dev-vm-01.kiva.org/ui/',
		graphqlUri: 'https://dev-vm-01.kiva.org/ajax/graphql',
		googleTagmanagerId: 'GTM-PXFRMT',
	},
	server: {
		graphqlUri: 'https://api-vm.kiva.org/graphql',
		memcachedServers: ['localhost'],
	}
})

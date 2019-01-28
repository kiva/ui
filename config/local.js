var merge = require('webpack-merge')
var base = require('./dev-vm.js')

module.exports = merge(base, {
	app: {
		host: 'localhost',
		publicPath: '/',
		graphqlUri: 'https://api.kivaws.org/graphql',
		algoliaConfig: {
			appId: 'H4ONVZQ2C6',
			apiKey: 'a373a52c000e929706c9e02a5862a327',
			defaultIndex: 'dev_all_loans',
			fundraisingIndex: 'dev_fundraising_loans',
		},
	},
	server: {
		graphqlUri: 'https://api.kivaws.org/graphql',
		sessionUri: '',
		memcachedEnabled: false,
		memcachedServers: '',
	},
})

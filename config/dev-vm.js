var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	server: {
		graphqlUri: 'https://api-vm.kiva.org/graphql?app_id=org.kiva.www&scopes=access&user_id=1017419'
	}
})

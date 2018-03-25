var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://www-qa-kiva-org.global.ssl.fastly.net/ui/',
		graphqlUri: 'https://www.qa.kiva.org/ajax/graphql',
		googleTagmanagerId: 'GTM-WXLS9B',
	}
})

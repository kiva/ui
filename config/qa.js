var merge = require('webpack-merge')
var base = require('./index.js')

module.exports = merge(base, {
	app: {
		cdnDomain: 'www-qa-kiva-org.global.ssl.fastly.net',
		graphqlUri: 'https://www.qa.kiva.org/ajax/graphql',
		googleTagmanagerId: 'GTM-WXLS9B',
	}
})

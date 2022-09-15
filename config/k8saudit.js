const { merge } = require('webpack-merge');
var base = require('./audit.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://www-audit-kiva-org.freetls.fastly.net/',
	},
	server: {
		memcachedEnabled: true,
		memcachedServers: 'audit-elasticache-01.knmtma.0001.usw2.cache.amazonaws.com:11211',
	}
})

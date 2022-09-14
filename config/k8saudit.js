const { merge } = require('webpack-merge');
var base = require('./audit.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://www-audit-kiva-org.freetls.fastly.net/',
	},
	server: {
		memcachedEnabled: true,
		memcachedServers: 'audit-memcached-01:11211',
	}
})

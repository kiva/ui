const { merge } = require('webpack-merge');
var base = require('./audit.js')

module.exports = merge(base, {
	app: {
		publicPath: 'https://www-audit-kiva-org.freetls.fastly.net/',
	},
	server: {
		memcachedEnabled: true,
		memcachedServers: 'marketplace-k8s-ui-audit.knmtma.cfg.usw2.cache.amazonaws.com:11211',
		disableCluster: true,
	}
})

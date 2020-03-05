var merge = require('webpack-merge')
var dev  = require('./dev.js')

module.exports = merge(dev, {
	app: {
		// removes 'ui' path segment
		publicPath: 'https://www-dev-kiva-org.freetls.fastly.net/',
	}
})

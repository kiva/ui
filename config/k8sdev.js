var merge = require('webpack-merge')
var dev  = require('./dev.js')

module.exports = merge(dev, {
	app: {
		// removes 'ui' path segment
		publicPath: 'http://ui-dev.dk1.kiva.org.global.prod.fastly.net/',
	}
})

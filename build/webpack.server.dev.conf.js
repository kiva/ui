var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.server.base.conf')

module.exports = merge(baseWebpackConfig, {
	name: 'server',
})

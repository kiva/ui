process.env.NODE_ENV = 'production'

const { merge } = require('webpack-merge');
var baseWebpackConfig = require('./webpack.client.base.conf');

module.exports = merge(baseWebpackConfig, {
	mode: 'production'
});

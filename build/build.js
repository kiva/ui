require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackClientConfig = require('./webpack.client.prod.conf')
var webpackServerConfig = require('./webpack.server.prod.conf')

var spinner = ora('building for production...')
spinner.start()

//path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm(config.build.assetsRoot, err => {
	if (err) throw err
	webpack([webpackClientConfig, webpackServerConfig], function (err, stats) {
		spinner.stop()
		if (err) throw err
		process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n\n')

		console.log(chalk.cyan('  Build complete.\n'))
		console.log(chalk.yellow(
			'  Tip: built files are meant to be served over an HTTP server.\n' +
			'  Opening index.html over file:// won\'t work.\n'
		))
	})
})

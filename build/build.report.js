require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackClientConfig = require('./webpack.client.report.conf')

var spinner = ora('building for production...')
spinner.start()

rm(config.build.assetsRoot, err => {
	if (err) throw err
	// NOTE this only runs on the client config
	webpack([webpackClientConfig], function (err, stats) {
		spinner.stop()
		if (err) throw err
		process.stdout.write(stats.toString({
			colors: true
		}) + '\n\n')

		console.log(chalk.cyan('  Build complete.\n'))
	})
})

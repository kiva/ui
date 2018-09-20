/* eslint-disable import/no-dynamic-require, global-require */
const fs = require('fs');
const path = require('path');

module.exports = function selectConfig(env = 'index') {
	const configPath = path.resolve(__dirname, `./${env}.js`);
	if (fs.existsSync(configPath)) {
		return require(configPath);
	}
	throw new Error(`Unknown environment '${env}'`);
};

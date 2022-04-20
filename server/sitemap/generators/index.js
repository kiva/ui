/* eslint-disable import/no-dynamic-require, global-require */
const fs = require('fs');

// Find every other file in this directory and export it as a module
fs.readdirSync(__dirname).forEach(filename => {
	const name = filename.replace('.js', '');

	if (name !== 'index') {
		exports[name] = require(`./${name}`);
	}
});

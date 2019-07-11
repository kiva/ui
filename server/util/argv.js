const minimist = require('minimist');

const processArgv = process.argv.slice(2);

module.exports = minimist(processArgv, {
	string: ['config'],
	boolean: ['mock'],
	alias: {
		config: ['c'],
		mock: ['m'],
		port: ['p'],
	},
});

import minimist from 'minimist';

const processArgv = process.argv.slice(2);

export default minimist(processArgv, {
	string: ['config'],
	boolean: ['mock'],
	alias: {
		config: ['c'],
		mock: ['m'],
		port: ['p'],
	},
});

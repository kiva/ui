import argv from './argv.js';
import selectConfig from '../../config/selectConfig.js';

const config = {};

export async function initConfig() {
	Object.assign(config, await selectConfig(argv.config));
}

export default config;

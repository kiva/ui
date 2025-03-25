import argv from './argv.js';
import selectConfig from '../../config/selectConfig.js';

const config = await selectConfig(argv.config);

export default config;

import fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export default async function selectConfig(env = 'dynamic') {
	const configPath = resolve(dirname(fileURLToPath(import.meta.url)), `./${env}.js`);
	if (fs.existsSync(configPath)) {
		return (await import(configPath)).default;
	}
	throw new Error(`Unknown config file '${env}'`);
}

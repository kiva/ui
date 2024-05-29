import { workerData } from 'worker_threads';
import vueRender from './vue-render.js';
// eslint-disable-next-line import/no-unresolved
import serverEntry from '../dist/server/server-entry.js';

const {
	ssrManifest,
	serverConfig,
	template,
} = workerData;

export default async function render(context) {
	const result = vueRender({
		context,
		serverConfig,
		serverEntry,
		ssrManifest,
		template,
	});
	return result;
}

import get from 'lodash/get.js';
import argv from './argv.js';
import selectConfig from '../../config/selectConfig.js';
import fetch from './fetch.js';
import { trace } from './ddTrace.js';

// Make a graphql query <request> and return the results found at <resultPath>
export default (async function fetchGraphQL(request, resultPath) {
	return trace('fetchGraphQL', async () => {
		const config = await selectConfig(argv.config);
		const endpoint = config.app.graphqlUri;
		const response = await trace('fetch', async () => {
			return fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(request),
			});
		});
		const result = await trace('response.json', async () => response.json());
		return trace('lodash.get', () => get(result, resultPath));
	});
});

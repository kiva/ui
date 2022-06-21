const get = require('lodash/get');
const argv = require('./argv');
const config = require('../../config/selectConfig')(argv.config);
const fetch = require('./fetch');
const tracer = require('./ddTrace');

// Make a graphql query <request> and return the results found at <resultPath>
module.exports = async function fetchGraphQL(request, resultPath) {
	return tracer.trace('fetchGraphQL', async () => {
		const endpoint = config.app.graphqlUri;
		const response = await tracer.trace('fetch', async () => {
			return fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(request),
			});
		});
		const result = await tracer.trace('response.json', async () => response.json());
		return tracer.trace('lodash.get', () => get(result, resultPath));
	});
};

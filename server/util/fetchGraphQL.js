const get = require('lodash/get');
const argv = require('./argv');
const config = require('../../config/selectConfig')(argv.config);
const fetch = require('./fetch');

// Make a graphql query <request> and return the results found at <resultPath>
module.exports = async function fetchGraphQL(request, resultPath) {
	const endpoint = config.app.graphqlUri;
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(request),
	});
	const result = await response.json();
	return get(result, resultPath);
};

const fetch = require('./fetch');

function fetchGqlFragments(url, cache) {
	return fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query: '{ __schema { types { kind name possibleTypes { name } } } }'
		}),
	})
		.then(result => result.json())
		.then(result => {
			// eslint-disable-next-line no-underscore-dangle
			const fragmentTypes = result.data.__schema.types.filter(t => t.possibleTypes !== null);

			cache.set('ui-gql-fragment-types', JSON.stringify(fragmentTypes), 24 * 60 * 60, (error, success) => {
				if (error) console.error(`MemJS Error Setting Cache for ui-gql-fragment-types, Error: ${error}`);
				if (success) console.info(`MemJS Success Setting Cache for ui-gql-fragment-types, Success: ${success}`);
			});

			return fragmentTypes;
		});
}

function getGqlFragmentsFromCache(cache) {
	return new Promise(resolve => {
		cache.get('ui-gql-fragment-types', (error, data) => {
			let parsedData = [];
			if (error) console.error(`MemJS Error Getting ui-gql-fragment-types, Error: ${error}`);
			if (data) parsedData = JSON.parse(data);
			resolve(parsedData);
		});
	});
}

module.exports = function getGqlFragmentTypes(url, cache) {
	return getGqlFragmentsFromCache(cache).then(data => {
		if (data.length) {
			return data;
		}
		return fetchGqlFragments(url, cache);
	});
};

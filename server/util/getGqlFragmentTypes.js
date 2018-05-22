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

			cache.set('ui-gql-fragment-types', fragmentTypes, 24 * 60 * 60, err => {
				if (err) console.error(`gql fragment cache error : ${err}`);
			});

			return fragmentTypes;
		});
}

function getGqlFragmentsFromCache(cache) {
	return new Promise(resolve => {
		cache.get('ui-gql-fragment-types', data => {
			resolve(data || []);
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

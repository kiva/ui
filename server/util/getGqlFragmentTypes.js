const fetch = require('./fetch');

let cacheInstance;

function fetchGqlFragments(url) {
	return new Promise((resolve, reject) => {
		fetch(url, {
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

				cacheInstance.set('ui-gql-fragment-types', fragmentTypes, 5000, err => {
					if (err) console.error(`gql fragment cache error : ${err}`);
				});
				resolve(fragmentTypes);
			})
			.catch(err => reject(err));
	});
}

function getGqlFragmentsFromCache(url) {
	return new Promise((resolve, reject) => {
		cacheInstance.get('ui-gql-fragment-types', (err, data) => {
			if (data) {
				resolve(data);
			} else {
				fetchGqlFragments(url)
					.then(result => {
						resolve(result);
					})
					.catch(error => {
						console.error(error);
						reject(error);
					});
			}
		});
	});
}

module.exports = function getGqlFragmentTypes(url, cache) {
	// share cache instance
	cacheInstance = cache;

	return new Promise((resolve, reject) => {
		getGqlFragmentsFromCache(url)
			.then(data => {
				resolve(data);
			})
			.catch(error => {
				console.error(error);
				reject(error);
			});
	});
};

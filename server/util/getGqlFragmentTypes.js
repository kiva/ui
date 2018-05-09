const fetch = require('./fetch');

let fragmentTypes = []; // store in local memory for now. TODO: use memcached

module.exports = function getGqlFragmentTypes(url) {
	return new Promise((resolve, reject) => {
		if (fragmentTypes.length) {
			resolve(fragmentTypes);
		} else {
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
					fragmentTypes = result.data.__schema.types.filter(t => t.possibleTypes !== null);
					resolve(fragmentTypes);
				})
				.catch(err => reject(err));
		}
	});
};

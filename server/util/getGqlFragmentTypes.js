const fetch = require('isomorphic-fetch');
const https = require('https');
const { getCache } = require('./initMemcached');

let cache;

function getGqlFragmentsFromCache() {
	console.log('started getGqlFragmentsFromCache');
	return new Promise((resolve, reject) => {
		console.log('promise called');
		cache.get('ui-gql-fragment-types', (err, data) => {
			if (data) {
				console.log('gql fragment cache data :');
				console.log(String(data));
				resolve(data);
			} else {
				console.error('gql fragment cache error : ');
				console.error(String(err));
				reject(err);
			}
		});
	});
}

function fetchGqlFragments(url) {
	return new Promise((resolve, reject) => {
		fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: '{ __schema { types { kind name possibleTypes { name } } } }'
			}),
			agent: new https.Agent({
				// fix request blocked b/c of self-signed certificate on dev-vm. TODO: maybe do a prod check?
				rejectUnauthorized: false
			})
		})
			.then(result => result.json())
			.then(result => {
				// eslint-disable-next-line no-underscore-dangle
				const fragmentTypes = result.data.__schema.types.filter(t => t.possibleTypes !== null);

				cache.set('ui-gql-fragment-types', fragmentTypes, 5000, err => {
					if (err) console.error(`gql fragment cache error : ${err}`);

					console.log(`set gql fragment cache data : ${fragmentTypes}`);
				});
				resolve(fragmentTypes);
			})
			.catch(err => reject(err));
	});
}

module.exports = function getGqlFragmentTypes(url) {
	// Get cache instance
	cache = getCache();

	console.log('gql fragement types >>>>>>> ');

	return new Promise((resolve, reject) => {
		getGqlFragmentsFromCache()
			.then(data => {
				console.log('Resolving getGqlFragmentsFromCache promise with :');
				console.log(data);
				if (data.length) {
					resolve(data);
				} else {
					console.log('data has no length, moving on to fetchGqlFragments');
					fetchGqlFragments(url)
						.then(result => {
							console.log('Resolving fetchGqlFragments promise with :');
							console.log(data);
							resolve(result);
						})
						.catch(error => {
							console.error(error);
							reject(error);
						});
				}
			})
			.catch(error => {
				console.log(error);
				console.log('Catch scenario attempting to get cache :');
				fetchGqlFragments(url)
					.then(result => {
						console.log('Resolving fetchGqlFragments promise with :');
						console.log(result);
						resolve(result);
					})
					.catch(err => {
						console.error(err);
						reject(err);
					});
			});
	});
};

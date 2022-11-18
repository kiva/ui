const fetch = require('./fetch');
const { log } = require('./log');
const tracer = require('./ddTrace');

const GQL_BUILT_IN_TYPES = [
	'__Schema',
	'__Type',
	'__TypeKind',
	'__Field',
	'__InputValue',
	'__EnumValue',
	'__Directive'
];

function fetchGqlPossibleTypes(url, cache) {
	return fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			// eslint-disable-next-line max-len
			query: '{ __schema { queryType { name } mutationType { name } subscriptionType { name } types { name fields { name } possibleTypes { name } } } }'
		}),
	})
		.then(result => result.json())
		// eslint-disable-next-line no-underscore-dangle
		.then(result => result?.data?.__schema ?? {})
		.then(({
			types, queryType, mutationType, subscriptionType
		}) => {
			const possibleTypes = { Mergable: [] };
			types?.forEach(type => {
				// Skip adding possible types for built-in GraphQL types and root types
				if (GQL_BUILT_IN_TYPES.includes(type.name)
					|| type.name === queryType?.name
					|| type.name === mutationType?.name
					|| type.name === subscriptionType?.name
				) {
					return;
				}
				// If this type has possible types, include them in the possibleTypes
				// object as { Typename: ['PossibleTypenameA', 'PossibleTypenameB'] }
				if (type.possibleTypes && type.possibleTypes.length) {
					possibleTypes[type.name] = type.possibleTypes.map(({ name }) => name);
				}
				// If this type doesn't have an ID field, declare it as mergeable.
				// See https://github.com/apollographql/apollo-client/pull/7070#issue-708438002
				if (type.fields && type.fields.length && !type.fields.some(field => field.name === 'id')) {
					possibleTypes.Mergable.push(type.name);
				}
			});

			cache.set(
				'ui-gql-possible-types',
				JSON.stringify(possibleTypes),
				{ expires: 24 * 60 * 60 },
				(error, success) => {
					if (error) {
						log(`MemJS Error Setting Cache for ui-gql-fragment-types, Error: ${error}`, 'error');
					}
					if (success) {
						log(`MemJS Success Setting Cache for ui-gql-fragment-types, Success: ${success}`);
					}
				}
			);

			return possibleTypes;
		});
}

function getGqlPossibleTypesFromCache(cache) {
	return new Promise(resolve => {
		cache.get('ui-gql-possible-types', (error, data) => {
			let parsedData = [];
			if (error) {
				log(`MemJS Error Getting ui-gql-fragment-types, Error: ${error}`, 'error');
			}
			if (data) parsedData = JSON.parse(data);
			resolve(parsedData);
		});
	});
}

module.exports = function getGqlPossibleTypes(url, cache) {
	return tracer.trace('getGqlFragmentTypes', () => {
		return tracer.trace('getGqlFragmentsFromCache', () => {
			return getGqlPossibleTypesFromCache(cache).then(data => {
				if (data.length) {
					return data;
				}
				return tracer.trace('fetchGqlFragments', () => fetchGqlPossibleTypes(url, cache));
			});
		});
	});
};

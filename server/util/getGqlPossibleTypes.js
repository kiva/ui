import fetch from './fetch.js';
import { getFromCache, setToCache } from './memJsUtils.js';

const GQL_BUILT_IN_TYPES = [
	'__Schema',
	'__Type',
	'__TypeKind',
	'__Field',
	'__InputValue',
	'__EnumValue',
	'__Directive'
];

async function fetchSchema(url) {
	const result = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			// eslint-disable-next-line max-len
			query: '{ __schema { queryType { name } mutationType { name } subscriptionType { name } types { name fields { name } possibleTypes { name } } } }'
		}),
	});
	const data = await result.json();
	// eslint-disable-next-line no-underscore-dangle
	return data?.data?.__schema ?? {};
}

async function fetchGqlPossibleTypes(url, cache) {
	// Get types from schema
	const {
		types, queryType, mutationType, subscriptionType
	} = await fetchSchema(url);

	// Construct possible types object
	const possibleTypes = { Mergable: [] };
	types?.forEach(type => {
		// Skip adding possible types for built-in GraphQL types and root types
		if (GQL_BUILT_IN_TYPES.includes(type.name)
			|| type.name === queryType?.name
			|| type.name === mutationType?.name
			|| type.name === subscriptionType?.name) {
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

	const typesJSON = JSON.stringify(possibleTypes);
	if (typesJSON) {
		// Cache the possible types in the local process
		process.env.FETCHED_GQL_TYPES = typesJSON;
		// Cache the possible types for 24 hours for other processes
		await setToCache('ui-gql-possible-types', typesJSON, 24 * 60 * 60, cache);
	}

	return possibleTypes;
}

async function getGqlPossibleTypesFromCache(cache) {
	// If the possible types have already been fetched in this process, return them
	if (process.env.FETCHED_GQL_TYPES) {
		return JSON.parse(process.env.FETCHED_GQL_TYPES);
	}

	// Otherwise, check the cache
	const data = await getFromCache('ui-gql-possible-types', cache);
	if (data) {
		return JSON.parse(data);
	}
}

export default (async function getGqlPossibleTypes(url, cache) {
	const data = await getGqlPossibleTypesFromCache(cache);
	if (data) {
		return data;
	}
	return fetchGqlPossibleTypes(url, cache);
});

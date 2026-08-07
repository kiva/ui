import fetch from './fetch.js';
import { error } from './log.js';
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

const CACHE_KEY = 'ui-gql-possible-types';

/**
 * A usable possible types payload always has at least one Mergable type: the API schema has
 * hundreds of types without an `id` field. An empty `Mergable` array therefore means the
 * introspection call failed or returned nothing, not that the schema changed shape.
 *
 * Serving an empty payload to the Apollo cache is not a degraded-but-working state. Without the
 * Mergable list, types with no `id` are replaced rather than merged on write, so a query for one
 * loan evicts every other loan from `ROOT_QUERY.lend`; and without the interface map, fragments
 * like `loanCardFields on LoanBasic` never match the cached `LoanPartner`. Either way a cache read
 * can never complete, every cache broadcast sends the watch query back to the network, and the
 * page melts down into thousands of refetches.
 *
 * @param {object} possibleTypes - Possible types payload to check
 * @returns {boolean} True when the payload is safe to use and to cache
 */
export function isValidPossibleTypes(possibleTypes) {
	return !!possibleTypes
		&& typeof possibleTypes === 'object'
		&& Array.isArray(possibleTypes.Mergable)
		&& possibleTypes.Mergable.length > 0;
}

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
	// A GraphQL error response still parses as JSON, so it would otherwise be swallowed by the
	// `?? {}` below and cached as an empty result.
	if (data?.errors?.length) {
		error('GraphQL errors while introspecting possible types', { errors: data.errors });
	}
	// The gateway answers an outage with a plain `{ code, message }` body rather than a GraphQL
	// envelope, e.g. `{ "code": "503", "message": "Service Unavailable" }`. That parses as JSON
	// too, so name the failure instead of reporting it as an empty schema further down.
	if (!data?.data && (data?.code || data?.message)) {
		error('Non-GraphQL error response while introspecting possible types', {
			status: result.status,
			code: data.code,
			message: data.message,
		});
	}
	// eslint-disable-next-line no-underscore-dangle
	return data?.data?.__schema ?? {};
}

function buildPossibleTypes({
	types, queryType, mutationType, subscriptionType
}) {
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
	return possibleTypes;
}

async function fetchGqlPossibleTypes(url, cache) {
	// Get types from schema
	const schema = await fetchSchema(url);

	// Construct possible types object
	const possibleTypes = buildPossibleTypes(schema);

	// Never persist an invalid payload. Caching it would pin every pod reading the shared cache
	// entry to a broken Apollo cache for the full 24 hour TTL, and pin this process for its
	// lifetime. Returning it uncached means the next request retries the introspection call.
	if (!isValidPossibleTypes(possibleTypes)) {
		error('Refusing to cache invalid GraphQL possible types', {
			typeCount: schema?.types?.length ?? 0,
		});
		return possibleTypes;
	}

	const typesJSON = JSON.stringify(possibleTypes);
	// Cache the possible types in the local process
	process.env.FETCHED_GQL_TYPES = typesJSON;
	// Cache the possible types for 24 hours for other processes
	await setToCache(CACHE_KEY, typesJSON, 24 * 60 * 60, cache);

	return possibleTypes;
}

/**
 * Parse a cached possible types payload, discarding anything unusable so a poisoned cache entry
 * written before these guards existed heals on the next request instead of persisting.
 */
function parseCachedPossibleTypes(data, source) {
	let parsed;
	try {
		parsed = JSON.parse(data);
	} catch (e) {
		error('Discarding unparseable cached GraphQL possible types', { source, message: e.message });
		return null;
	}
	if (!isValidPossibleTypes(parsed)) {
		error('Discarding invalid cached GraphQL possible types', { source });
		return null;
	}
	return parsed;
}

async function getGqlPossibleTypesFromCache(cache) {
	// If the possible types have already been fetched in this process, return them
	if (process.env.FETCHED_GQL_TYPES) {
		const fromProcess = parseCachedPossibleTypes(process.env.FETCHED_GQL_TYPES, 'process');
		if (fromProcess) {
			return fromProcess;
		}
		// Clear it so this process stops reusing a value it has already rejected
		delete process.env.FETCHED_GQL_TYPES;
	}

	// Otherwise, check the cache
	const data = await getFromCache(CACHE_KEY, cache);
	if (data) {
		return parseCachedPossibleTypes(data, 'memjs');
	}

	return null;
}

export default (async function getGqlPossibleTypes(url, cache) {
	const data = await getGqlPossibleTypesFromCache(cache);
	if (data) {
		return data;
	}
	return fetchGqlPossibleTypes(url, cache);
});

import merge from 'deepmerge';
import _isEqual from 'lodash/isEqual';

/**
 * Applies new data to the Apollo cache, merging it with existing data.
 *
 * @param {ApolloClient} apolloClient - The Apollo Client instance.
 * @param {Object} newData - The new data to apply to the cache.
 */
export function applyStateToCache(apolloClient, newData) {
	const entityStore = apolloClient.cache.data;
	// Same implementation as EntityStore.replace without the deletion of existing data
	// Ref: https://github.com/apollographql/apollo-client/blob/main/src/cache/inmemory/entityStore.ts#L401
	const { __META, ...rest } = newData;
	Object.keys(rest).forEach(dataId => {
		entityStore.merge(dataId, rest[dataId]);
	});
	if (__META) {
		__META.extraRootIds.forEach(entityStore.retain, entityStore);
	}
}

// Key fields by typename for types that use key fields other than 'id', '_id', or 'key'
export const keyFields = {
	Country: 'isoCode',
};

/**
 * Finds the index of an item in the target array that has the same key field as the given item.
 *
 * @param {Array} target - The array to search in.
 * @param {Object} item - The item to find in the target array.
 * @returns {number} - The index of the item in the target array, or -1 if not found.
 */
export function findIndexWithSameKeyField(target, item) {
	/* eslint-disable no-underscore-dangle */
	const customKeyField = keyFields[item.__typename];
	const keyField = Object.keys(item).find(key => {
		// If the item has a custom key field, use it to find existing items
		if (key === customKeyField) {
			return true;
		}
		// Otherwise, use the default 'id', '_id', or 'key' fields
		return ['id', '_id', 'key'].includes(key);
	});

	// If no key field is found, return -1 to indicate no match
	if (!keyField) return -1;

	// Find the index of the item in the target array that matches the key field and typename
	return target.findIndex(targetItem => {
		return targetItem[keyField] === item[keyField] && targetItem.__typename === item.__typename;
	});
	/* eslint-enable no-underscore-dangle */
}

/**
 * Merges multiple state objects into one, handling arrays by merging items with the same key field.
 *
 * @param {...Object} states - The state objects to merge.
 * @returns {Object} - The merged state object.
 */
export function mergeStateObjects(...states) {
	return merge.all(states, {
		// Custom merge function for arrays of apollo cache entities
		arrayMerge: (target, source, options) => {
			// Make shallow copy of the target array
			const destination = target.slice();
			// Attempt to merge each item from the source array into the target array
			source.forEach(item => {
				if (options.isMergeableObject(item)) {
					// Find if an item with the same key exists in the target array
					const existingIndex = findIndexWithSameKeyField(target, item);
					if (existingIndex > -1) {
						// If an item with the same key exists in the target array, merge with that item
						destination[existingIndex] = merge(target[existingIndex], item, options);
						return;
					}
				}
				if (!target.some(targetItem => _isEqual(targetItem, item))) {
					// If the array has no equivalent item already, add the item
					destination.push(options.cloneUnlessOtherwiseSpecified(item, options));
				}
			});
			return destination;
		},
	});
}

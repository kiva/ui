export function mergeApolloCacheData(apolloClient, newData) {
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

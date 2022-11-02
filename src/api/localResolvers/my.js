import hasEverLoggedInQuery from '@/graphql/query/shared/hasEverLoggedIn.graphql';

export default ({ cookieStore, kvAuth0 }) => {
	return {
		typePolicies: {
			My: {
				lastLoginTimestamp() {
					return kvAuth0.getLastLogin();
				}
			},
			Query: {
				hasEverLoggedIn(obj, args, { cache }) {
					// Return true if the user is currently logged in
					if (kvAuth0.getKivaId()) {
						return true;
					}
					// Return true if the user has a kvu cookie
					if (cookieStore.get('kvu')) {
						return true;
					}

					try {
						// Return the previously cached value for this field
						const cacheData = cache.readQuery({ query: hasEverLoggedInQuery });
						return !!cacheData?.hasEverLoggedIn;
					} catch (e) {
						// Return false if there wasn't a previously cached value
						return false;
					}
				},
			}
		},
	};
};

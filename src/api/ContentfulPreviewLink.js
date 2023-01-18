import { ApolloLink } from '@apollo/client/core';

export default ({ cookieStore }) => {
	return new ApolloLink((operation, forward) => {
		// Only do this on contentful queries
		if (operation.operationName.includes('contentful')) {
			// Fetch contentfulPreview value from cookie
			const isPreview = cookieStore.get('contentfulPreview');
			// Add the preview variable to the current query
			if (!operation?.variables?.preview && isPreview === 'true') {
				// eslint-disable-next-line no-param-reassign
				operation.variables.preview = true;
			}
		}

		return forward(operation);
	});
};

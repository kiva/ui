import { ApolloLink } from '@apollo/client/core/index';

export default ({ route }) => {
	return new ApolloLink((operation, forward) => {
		// Only do this on contentful queries
		if (route && operation.operationName.includes('contentful')) {
			// Fetch preview value from route query
			const isPreview = route?.query?.preview === 'true';
			// Add the preview variable to the current query
			if (!operation?.variables?.preview && isPreview) {
				// eslint-disable-next-line no-param-reassign
				operation.variables.preview = true;
			}
		}

		return forward(operation);
	});
};

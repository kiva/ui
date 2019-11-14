import { GraphQLJSONObject } from 'graphql-type-json';

const contentful = require('contentful');
const appConfig = require('../../../config/index');

const contentfulClient = contentful.createClient({
	accessToken: appConfig.app.contentful.accessToken,
	space: appConfig.app.contentful.space
});
/**
 * ContentfulCMS resolvers
 */
export default () => {
	return {
		resolvers: {
			JSONObject: GraphQLJSONObject,
			Query: {
				contentfulCMS(_, { contentKey, contentType }) {
					// contentType is a required parameter
					const contentfulQueryParams = {
						content_type: contentType
					};
					// if contentKey is a param contentful will only return content
					// for that key, otherwise, all keys in the contentType are returned
					if (contentKey) {
						contentfulQueryParams['fields.key'] = contentKey;
					}
					return contentfulClient.getEntries(contentfulQueryParams).then(entries => {
						const items = entries.items.map(entry => entry.fields);
						return {
							items,
							__typename: 'ContentfulCMS',
						};
					});
				},
			},
		}
	};
};

import { GraphQLJSONObject } from 'graphql-type-json';
import { createClient } from 'contentful';

/**
 * ContentfulCMS resolvers
 */
export default context => {
	const contentfulClient = createClient({
		accessToken: context.appConfig.contentful.accessToken,
		space: context.appConfig.contentful.space,
		environment: context.appConfig.contentful.environment
	});
	return {
		resolvers: {
			JSONObject: GraphQLJSONObject,
			Query: {
				/**
				 * Get data from contentful CMS
				 *
				 * contentKey and contentType correspond to the values in contentful.
				 * contentType is required, if contentKey is omitted, all content
				 * is returned for that type. If contentKey is present, only the content
				 * that matches that key is returned. contentKey is a custom contentful
				 * field on objects of that type which corresponds to ['fields.key']
				 *
				 * Returns: Array of contentKey object in the form:
				 * [{
				 * 		fields: { <Contentful Fields for that contentType> }
				 *		sys: { <Contentful Metadata> }
				 * }]
				 *
				 * @param {string} contentKey, contentType
				 * @returns {array}
				 */
				contentfulCMS(_, { contentKey, contentType }) {
					const contentfulQueryParams = {
						content_type: contentType
					};
					if (contentKey) {
						contentfulQueryParams['fields.key'] = contentKey;
					}
					return contentfulClient.getEntries(contentfulQueryParams).then(contentfulResponse => {
						const items = contentfulResponse.items.map(entry => entry.fields);
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

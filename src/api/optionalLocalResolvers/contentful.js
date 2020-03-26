import { GraphQLJSONObject } from 'graphql-type-json';
import { createApolloFetch } from 'apollo-fetch';

const fetch = createApolloFetch({
	uri: 'https://marketplace-api.dk1.kiva.org/graphql',
});

/**
 * Contentful resolvers
 */
export default () => {
	return {
		resolvers: {
			JSONObject: GraphQLJSONObject,
			Query: {
				contentful(_, payload) {
					return {
						...payload,
						__typename: 'Contentful'
					};
				}
			},
			Contentful: {
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

				entries(_, { contentKey, contentType }) {
					fetch({
						query: `query ContentfulFromGQLFederation($contentType: String!, $contentKey: String!) {
								contentful {
									entries(contentType: $contentType, contentKey: $contentKey)
								}
							}`,
						variables: { contentType, contentKey },
					}).then(res => {
						return res.data;
					});
				},
			},
		}
	};
};

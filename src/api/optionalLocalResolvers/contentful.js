import { GraphQLJSONObject } from 'graphql-type-json';
import { createApolloFetch } from 'apollo-fetch';
import _get from 'lodash/get';

/**
 * Contentful resolvers
 */
export default context => {
	let apolloFetch;
	if (_get(context, 'appConfig.contentful.useLocalResolver')) {
		// Use the app config graphqlUri for the contentful request, except for the dev-vm
		// in the dev-vm force the federation endpoint
		apolloFetch = createApolloFetch({
			uri: 'https://marketplace-api.dk1.kiva.org/graphql',
		});
	} else {
		apolloFetch = createApolloFetch({
			uri: context.appConfig.graphqlUri,
		});
	}
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
				 * Returns: object in the form:
				 * {
				 *	"data": {
				 *		"contentful": {
				 *			"entries": {
				 *				"sys": { <Contentful Metadata> },
				 *				"total": 1,
				 *				"skip": 0,
				 *				"limit": 100,
				 *				"items": [
				 *					{
				 *						"sys": { <Contentful Metadata> },
				 *						"fields": { <Contentful Fields for that contentType> }
				 *					}
				 *				],
				 *				"includes": {
				 *					"Entry": [
				 *						{
				 *							"sys": { <Contentful Metadata> },
				 *							"fields": { <Contentful Fields for that contentType> }
				 *						}
				 *					]
				 *				}
				 *			}
				 *		}
				 *	}
				 *
				 * @param {string} contentKey, contentType
				 * @returns {object}
				 */

				entries(_, { contentKey, contentType }) {
					return apolloFetch({
						query: `query ContentfulFromGQLFederation($contentType: String!, $contentKey: String!) {
								contentful {
									entries(contentType: $contentType, contentKey: $contentKey)
								}
							}`,
						variables: { contentType, contentKey },
					}).then(res => {
						return _get(res, 'data.contentful.entries');
					});
				},
			},
		}
	};
};

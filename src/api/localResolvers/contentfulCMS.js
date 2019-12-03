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
					// if contentful is not enabled just return empty object without making API call
					if (!context.appConfig.contentful.enable) {
						return {};
					}

					// setup contentful params
					const contentfulQueryParams = {
						content_type: contentType
					};
					if (contentKey) {
						contentfulQueryParams['fields.key'] = contentKey;
					}

					// Use the contentful URL as the cache key to sessionStorage
					const cacheKey = 'https://cdn.contentful.com'
									+ `/spaces/${context.appConfig.contentful.space}`
									+ `/environments/${context.appConfig.contentful.environment}`
									+ `/entries?${Object.entries(contentfulQueryParams).map(entry => entry.join('=')).join('&')}`;// eslint-disable-line max-len

					const cachedResponse = localStorage.getItem(cacheKey);
					const lastContentfulCacheRefresh = localStorage.getItem('lastContentfulCacheRefresh');
					const ageOfContentfulCacheInMinutes = !lastContentfulCacheRefresh ? 0 : (new Date().getTime() - lastContentfulCacheRefresh) / (1000 * 60); // eslint-disable-line max-len

					// if cachedResponse exists and is fresher then 30 minutes, return from cache
					if (cachedResponse !== null && lastContentfulCacheRefresh !== null && ageOfContentfulCacheInMinutes < 30) { // eslint-disable-line max-len
						return {
							items: JSON.parse(cachedResponse),
							__typename: 'ContentfulCMS',
						};
					}

					// get new contentful data
					return contentfulClient.getEntries(contentfulQueryParams).then(contentfulResponse => {
						const items = contentfulResponse.items.map(entry => entry.fields);
						// store timestamp and results in localStorage
						localStorage.setItem('lastContentfulCacheRefresh', new Date().getTime());
						localStorage.setItem(cacheKey, JSON.stringify(items));
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

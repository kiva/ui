import fetchGraphQL from '../../util/fetchGraphQL.js';
import { info } from '../../util/log.js';

async function fetchCategories() {
	// Get the server-defined url for all the "popular" categories
	const result = await fetchGraphQL({
		query: `{
			lend {
				loanChannels(offset:0, limit:1000, popular: true) {
					values {
						url
					}
				}
			}
		}`
	}, 'data.lend.loanChannels.values');
	const values = result ?? [];
	// Return only the last part of the url path, the category slug
	return values.map(({ url }) => url.split('/').pop());
}

export async function lendingCategoriesRouteGenerator() {
	info('Sitemap: lendingCategoriesRouteGenerator: fetching categories');
	const categories = await fetchCategories();
	info('Sitemap: lendingCategoriesRouteGenerator: found categories', { categories });
	return categories.map(category => `/lend-by-category/${category}`);
}

const fetchGraphQL = require('../../util/fetchGraphQL');
const { info } = require('../../util/log');

// Fetch all pages from contentful
async function fetchContentfulPages() {
	const result = await fetchGraphQL({
		query: `{
			contentful {
				entries(contentType: "page", include: 0)
			}
		}`
	}, 'data.contentful.entries');
	const items = result?.items ?? [];

	// Return all the pages with only the fields.key, fields.pageType, and fields.path properties
	return items.map(({ fields }) => {
		const { key, pageType, path } = fields;
		return { key, pageType, path };
	});
}

// This sitemap generator fetches all the pages in contentful and
// adds a sitemap url for every route that is a landing page (/lp/*).
module.exports = async function contentfulRouteGenerator() {
	info('Sitemap: contentfulRouteGenerator: fetching contentful pages');
	// const pages = await fetchContentfulPages();

	// Hide landing pages for now, pending review and updates for SEO
	const landingPages = [];
	// const landingPages = pages
	// 	// Only use 'landing' page types
	// 	.filter(({ pageType }) => pageType === 'landing')
	// 	// Use '/key' as the path if no path is defined
	// 	.map(({ key, path }) => path ?? `/${key}`)
	// 	// Only use pages with '/lp/*' paths
	// 	.filter(path => path.startsWith('/lp/'));

	// Do not include corporate campaign pages in the sitemap!
	// const campaignPages = pages
	// 	.filter(({ pageType }) => pageType === 'corporate-campaign')
	// 	.map(({ key }) => `/cc/${key}`);

	info('Sitemap: contentfulRouteGenerator: found pages', { landingPages });
	return landingPages;
};

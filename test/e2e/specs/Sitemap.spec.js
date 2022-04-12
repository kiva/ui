function getUrlsFromSitemap(sitemapString) {
	return Cypress.$(sitemapString)
		// the url value will be in a <loc /> node
		.find('loc')
		// map to a js array
		.toArray()
		// get the text of the <loc /> node
		.map(el => el.innerText);
}

function parseUrl(urlString) {
	try {
		return new URL(urlString);
	} catch {
		return false;
	}
}

describe('Sitemap', () => {
	it('should consist of only secure urls', async () => {
		// fetch the sitemap content
		const response = await cy.request('sitemaps/ui.xml');

		// convert sitemap xml body to an array of urls
		const urls = getUrlsFromSitemap(response.body);

		// the sitemap should not be empty
		expect(urls.length).to.be.greaterThan(0);

		// each url should be a valid url with https protocol
		urls.forEach(urlString => {
			const url = parseUrl(urlString);
			expect(url).not.to.equal(false);
			expect(url.protocol).to.equal('https:');
		});
	});
});

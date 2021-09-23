describe('Example spec', () => {
	it('Visits the site map', () => {
		// Visit the site map
		cy.visit('/ui-site-map');

		// Assert that key elements of the site map are visible
		cy.contains('Available Routes');
		cy.get('a').contains('ui-site-map');
	});
});

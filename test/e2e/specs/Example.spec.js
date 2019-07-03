import wwwPageMock from '../fixtures/wwwPageMock';

describe('Example spec', () => {
	beforeEach(() => {
		cy.mock(wwwPageMock());
	});

	it('Visits the site map', () => {
		// Visit the site map
		cy.visit('/ui-site-map');

		// Assert that key elements of the site map are visible
		cy.contains('Available Routes');
		cy.get('a').contains('ui-site-map');
	});
});

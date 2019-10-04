import wwwPageMock from '../fixtures/wwwPageMock';

describe('Autolending', () => {
	beforeEach(() => {
		cy.mock(wwwPageMock());
		// cy.mock();
	});

	it('Visits autolending settings', () => {
		// Visit autolending settings
		cy.visit('/settings/autolending');

		// Assert that key elements of the page are visible
		cy.contains('Auto-lending preferences');
	});
});

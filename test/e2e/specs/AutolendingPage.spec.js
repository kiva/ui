import wwwPageMock from '../fixtures/wwwPageMock';

// TODO enable these tests again once these routes are active
xdescribe('Autolending Page Spec', () => {
	beforeEach(() => {
		cy.mock(wwwPageMock());
	});

	describe('Visits autolending settings page', () => {
		it('Auto lending settings page should have content', () => {
			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Prevents the window beforeunload event from getting added
			// which blocks Cypress from exiting test correctly
			cy.on('window:before:load', window => {
				const original = window.addEventListener;
				// eslint-disable-next-line no-param-reassign
				window.addEventListener = (...args) => {
					if (args && args[0] === 'beforeunload') {
						return;
					}
					return original.apply(this, args);
				};
			});

			// Assert that key elements of the page are visible
			cy.contains('Auto-lending preferences');
		});
	});
});

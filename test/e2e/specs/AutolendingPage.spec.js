import wwwPageMock from '../fixtures/wwwPageMock';


describe('Autolending Page Spec', () => {
	const userId = 42;

	beforeEach(() => {
		cy.mock(wwwPageMock(userId));
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
	});

	describe('Visits autolending settings page', () => {
		it('Auto lending settings page should have content', () => {
			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert that key elements of the page are visible
			cy.contains('Auto-lending preferences');
		});
	});

	describe('Main toggle', () => {
		it('Can be turned from on to off', () => {
			// Mock autolending as enabled
			cy.mock({
				AutolendProfile: () => ({
					isEnabled: true,
				}),
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert that toggle displays 'on'
			cy.get('.main-toggle').contains('Auto-lending on');

			// hit toggle
			// save
			// assert success banner?
			// assert save not visible?
			// assert toggle says off
		});

		it('Can be turned from off to on', () => {
			// Mock autolending as disabled
			cy.mock({
				AutolendProfile: () => ({
					isEnabled: false,
				}),
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert that toggle displays 'off'
			cy.get('.main-toggle').contains('Auto-lending off');

			// hit toggle
			// save
			// assert success banner?
			// assert save not visible?
			// assert toggle says on
		});
	});
});

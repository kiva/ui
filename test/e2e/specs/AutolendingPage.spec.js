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

		it('Redirects to credit/settings if visitor isSubscriber', () => {
			// Mock autolending as enabled
			cy.mock({
				AutoDeposit: () => ({
					isSubscriber: true,
				}),
			});

			// Attempt to Visit autolending settings
			cy.visit('/settings/autolending', {
				failOnStatusCode: false
			});
			cy.location('pathname').should('eq', '/settings/credit');
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

	describe('Autolend explanation text', () => {
		it('Verify user balance below lendable amount', () => {
			// Mock date and idle start time
			cy.mock({
				AutolendProfile: () => ({
					cIdleStartTime: null
				}),
				// Also not working
				UserAccount: () => ({
					balance: '5'
				})
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert that toggle displays 'on'
			cy.get('.autolend-explanation-text').contains(
				'Your current balance is lower'
			);
		});

		it('Verify lendable balance w/daysUntilLend > 0', () => {
			// Mock cIdleStartTime and lendAfterDaysIdle
			cy.mock({
				Date: () => cy.clock(1579651200000),
				AutolendProfile: () => ({
					cIdleStartTime: '2020-01-17T00:00:00',
					lendAfterDaysIdle: 7,
					donationPercentage: 5
				}),
				// Tried mocking data this way
				UserAccount: () => ({
					balance: '40'
				})
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert the text on the page
			cy.get('.autolend-explanation-text').contains(
				'6 days').contains('1 days—timing');
		});

		it('Verify lendable balance w/daysUntilLend <= 0', () => {
			// Mock cIdleStartTime and lendAfterDaysIdle
			cy.mock({
				Date: () => cy.clock(1579219200000),
				AutolendProfile: () => ({
					cIdleStartTime: '2019-08-17T00:00:00',
					lendAfterDaysIdle: 90,
					donationPercentage: 15
				}),
				// Also tried mocking data this way
				My: () => ({
					UserAccount: () => ({
						balance: '40'
					})
				})
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert the text on the page
			cy.get('.autolend-explanation-text').contains(
				'6 days').contains('immediately');
		});
	});
});

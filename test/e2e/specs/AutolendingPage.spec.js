import { subDays } from 'date-fns';
import wwwPageMock from '../fixtures/wwwPageMock';

function saveSettings() {
	cy.get('[data-test=save-button]').first().click();
	cy.get('[data-test=tip-message]').contains('have been saved');
}

describe('Autolending Page Spec', () => {
	beforeEach(() => {
		cy.mock(wwwPageMock({
			UserAccount: {
				id: 42,
			}
		}));
		// Mock loan count
		cy.mock({
			LoanBasicCollection: {
				totalCount: 2500,
			}
		});
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
				AutoDeposit: {
					isSubscriber: true,
				},
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
			cy.mock({
				AutolendProfile: (obj, args) => {
					// When arguments are provided, mock isEnabled with the same value that is passed in
					if (args && args.profile && typeof args.profile.isEnabled === 'boolean') {
						return { isEnabled: args.profile.isEnabled };
					}
					// Mock autolending as enabled when no arguments are provided
					return { isEnabled: true };
				},
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');
			// Assert that toggle displays 'on'
			cy.get('[data-test=main-toggle]').contains('Auto-lending on');
			// Flip the toggle
			cy.get('[data-test=main-toggle]').click();
			// Save the profile settings
			saveSettings();
			// Assert that toggle displays 'off'
			cy.get('[data-test=main-toggle]').contains('Auto-lending off');
		});

		it('Can be turned from off to on', () => {
			cy.mock({
				AutolendProfile: (obj, args) => {
					// When arguments are provided, mock isEnabled with the same value that is passed in
					if (args && args.profile && typeof args.profile.isEnabled === 'boolean') {
						return { isEnabled: args.profile.isEnabled };
					}
					// Mock autolending as disabled when no arguments are provided
					return { isEnabled: false };
				},
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');
			// Assert that toggle displays 'off'
			cy.get('[data-test=main-toggle]').contains('Auto-lending off');
			// Flip the toggle
			cy.get('[data-test=main-toggle]').click();
			// Save the profile settings
			saveSettings();
			// Assert that toggle displays 'on'
			cy.get('[data-test=main-toggle]').contains('Auto-lending on');
		});
	});

	// The following tests ensure the autolend explanation text is displaying correctly
	// based on user's balance, set autolend donation percentage and timing around when
	// autolending is eligible to occur.

	describe('Autolend explanation text', () => {
		it('Explains no autolending because balance is low', () => {
			cy.mock({
				AutolendProfile: {
					isEnabled: true,
					enableAfter: 0,
				},
				// This is setting the user's balance
				Money: '3.00'
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert that message about the auto-lend timer not starting until balance is eligible
			cy.get('[data-test=timing-explanation]').contains(
				'Your current balance is lower'
			);
		});

		it('Explains no autolending because idle start time is null', () => {
			cy.mock({
				AutolendProfile: {
					isEnabled: true,
					enableAfter: 0,
					cIdleStartTime: null,
				},
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert that message about the auto-lend timer is not shown when cIdleStartTime is null
			cy.get('[data-test=timing-explanation]').should('not.exist');
		});

		it('Explains that autolending will start in x days if user eligible and not idle', () => {
			const now = new Date();

			cy.mock({
				AutolendProfile: {
					isEnabled: true,
					enableAfter: 0,
					cIdleStartTime: subDays(now, 4),
					lendAfterDaysIdle: 7,
					donationPercentage: 5
				},
				// This is setting the user's balance
				Money: '40.05'
			});
			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert the message says the user has been idle for 4 days and lending will start in 3 days
			cy.get('[data-test=timing-explanation]').contains('for 4 days').contains('after 3 days');
		});

		it('Explains that autolending will start immediately if user eligible and idle', () => {
			const now = new Date();

			cy.mock({
				AutolendProfile: {
					isEnabled: true,
					enableAfter: 0,
					cIdleStartTime: subDays(now, 95),
					lendAfterDaysIdle: 90,
					donationPercentage: 15
				},
				// This is setting the user's balance
				Money: '40.90'
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert the message says the user has been idle over 95 days and lending will start immediately
			cy.get('[data-test=timing-explanation]').contains('over 95 days').contains('immediately');
		});
	});
});

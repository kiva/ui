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
		// Hide tracking cookie notice banner
		cy.setCookie('kvgdpr', 'true');
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

			// Assert that toggle displays 'OFF'
			cy.get('[data-test=autolending-status]').contains('on');
			// Show the modal
			cy.get('[data-test=autolending-status]').click();

			// Wait for modal
			// Select the radio
			cy.get('.autolending-status-lightbox')
				.should('be.visible')
				.find('[data-test=is-autolending-off] + label')
				.click();

			// Hit save button
			cy.get('[data-test=status-save-button]').first().click();
			// Assert that toggle displays 'on'
			cy.get('[data-test=autolending-status]').contains('off');
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
			// Assert that toggle displays 'OFF'
			cy.get('[data-test=autolending-status]').contains('off');
			// Show the modal
			cy.get('[data-test=autolending-status]').click();

			// Wait for modal
			// Select the radio
			cy.get('.autolending-status-lightbox')
				.should('be.visible')
				.find('[data-test=is-autolending-on] + label')
				.click();

			// Hit save button
			cy.get('[data-test=status-save-button]').first().click();
			// Assert that toggle displays 'on'
			cy.get('[data-test=autolending-status]').contains('on');
		});
	});

	describe('Display Autolending Status correctly', () => {
		it('Display pause status correctly', () => {
			cy.mock({
				AutolendProfile: (obj, args) => {
					// When arguments are provided, mock isEnabled with the same value that is passed in
					if (args && args.profile && typeof args.profile.isEnabled === 'boolean') {
						return { isEnabled: args.profile.isEnabled };
					}
					// Mock autolending as enabled when no arguments are provided
					return { isEnabled: true, pauseUntil: '2020-07-20T10:57:26-07:00' };
				},
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert the status is correct
			cy.get('[data-test=autolending-status]').contains('paused');
			// Assert date is formatted correctly
			cy.get('[data-test=autolending-status]').contains('until 07/20/2020');
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
					cIdleStartTime: subDays(now, 55),
					lendAfterDaysIdle: 45,
					donationPercentage: 15
				},
				// This is setting the user's balance
				Money: '40.90'
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert the message says the user has been idle over 95 days and lending will start immediately
			cy.get('[data-test=timing-explanation]').contains('over 55 days').contains('immediately');
		});

		// Special Conditions for Lenders with 90 day term at launch
		it('Explains that autolending will start on May 21th 2020 if user already eligible and idle', () => {
			const now = new Date();

			cy.mock({
				AutolendProfile: {
					isEnabled: true,
					enableAfter: 0,
					cIdleStartTime: subDays(now, 155),
					lendAfterDaysIdle: 90,
					donationPercentage: 15
				},
				// This is setting the user's balance
				Money: '40.90'
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert the message says the user will be eligible on May 21, 2020
			cy.get('[data-test=timing-explanation]')
				.contains('May 21, 2020').contains('when the first 90-day auto-loans are made');
		});

		// Special Conditions for Lenders with 90 day term at launch
		it('Explains that autolending will start in May if user becomes eligible before May 21th 2020', () => {
			const now = new Date();

			cy.mock({
				AutolendProfile: {
					isEnabled: true,
					enableAfter: 0,
					cIdleStartTime: subDays(now, 80),
					lendAfterDaysIdle: 90,
					donationPercentage: 15
				},
				// This is setting the user's balance
				Money: '40.90'
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');

			// Assert the message says the user will be eligible on May 21, 2020
			cy.get('[data-test=timing-explanation]')
				.contains('your balance will be eligible').contains('May 21, 2020');
		});
	});

	describe('Kiva Chooses toggle', () => {
		it('Can be turned from Kiva Chooses to User Chooses', () => {
			cy.mock({
				AutolendProfile: (obj, args) => {
					// When arguments are provided, mock kivaChooses with the same value that is passed in
					if (args && args.profile && typeof args.profile.kivaChooses === 'boolean') {
						return {
							isEnabled: true,
							kivaChooses: args.profile.kivaChooses,
						};
					}
					// Mock kivaChooses as enabled when no arguments are provided
					return {
						isEnabled: true,
						kivaChooses: true,
					};
				},
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');
			// Show the modal
			cy.get('[data-test=autolending-who]').first().click();
			// Wait for modal
			// Select the radio
			cy.get('.autolending-who-lightbox')
				.should('be.visible');

			// Assert that 'Let Kiva select the best loans for me' is selected
			cy.get('[data-test=kiva-chooses-true]').should('be.checked');
			// Select 'I want to set my own auto-lending criteria'
			cy.get('[data-test=kiva-chooses-false] + label').click();
			// Hit save button
			cy.get('[data-test=save-button]').first().click();
			// Assert that 'I want to set my own auto-lending criteria' is selected
			cy.get('[data-test=kiva-chooses-false]').should('be.checked');
		});

		it('Can be turned from User Chooses to Kiva Chooses', () => {
			cy.mock({
				AutolendProfile: (obj, args) => {
					// When arguments are provided, mock kivaChooses with the same value that is passed in
					if (args && args.profile && typeof args.profile.kivaChooses === 'boolean') {
						return {
							isEnabled: true,
							kivaChooses: args.profile.kivaChooses,
						};
					}
					// Mock kivaChooses as enabled when no arguments are provided
					return {
						isEnabled: true,
						kivaChooses: false,
					};
				},
			});

			// Visit autolending settings
			cy.visit('/settings/autolending');
			// Show the modal
			cy.get('[data-test=autolending-who]').first().click();
			// Wait for modal
			// Select the radio
			cy.get('.autolending-who-lightbox')
				.should('be.visible');

			// Assert that 'I want to set my own auto-lending criteria' is selected
			cy.get('[data-test=kiva-chooses-false]').should('be.checked');
			// Select 'Let Kiva select the best loans for me'
			cy.get('[data-test=kiva-chooses-true] + label').click();
			// Hit save button
			cy.get('[data-test=save-button]').first().click();
			// Assert that 'Let Kiva select the best loans for me' is selected
			cy.get('[data-test=kiva-chooses-true]').should('be.checked');
		});
	});
});

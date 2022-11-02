describe('RegisterSocial', () => {
	const registerSocialPath = '/register/social';

	describe('Form usage', () => {
		it('requires first and last names when names are needed', () => {
			// Visit to RegisterSocial page requesting names be returned (names=1)
			cy.visit(`${registerSocialPath}?state=abc&names=1`);

			// Expect only the name inputs to be displayed
			cy.contains('First name').should('be.visible');
			cy.contains('Last name').should('be.visible');
			cy.contains('I have read and agree').should('not.be.visible');
			cy.contains('I want to receive').should('not.be.visible');

			// Submit the form without entering anything
			cy.contains('Complete registration').click();

			// Expect these error messages to be displayed
			cy.contains('Enter first name.');
			cy.contains('Enter last name.');

			// Expect the url to not change
			cy.location('pathname').should('eq', registerSocialPath);

			// Enter some names into the inputs
			cy.findByLabelText('First name', { exact: false }).type('Test');
			cy.findByLabelText('Last name', { exact: false }).type('Tester');

			// Expect the error messages not to be present
			cy.contains('Enter first name.').should('not.exist');
			cy.contains('Enter last name.').should('not.exist');
		});

		it('requires terms agreement when agreement has not been given', () => {
			// Visit to RegisterSocial page requesting terms agreement be returned (terms=1)
			cy.visit(`${registerSocialPath}?state=abc&terms=1`);

			// Expect only the term input to be displayed
			cy.contains('I have read and agree').should('be.visible');
			cy.contains('First name').should('not.be.visible');
			cy.contains('Last name').should('not.be.visible');
			cy.contains('I want to receive').should('not.be.visible');

			// Submit the form without entering anything
			cy.contains('Complete registration').click();

			// Expect this error message to be displayed
			cy.contains('You must agree to the Kiva Terms of Use and Privacy Policy.');

			// Expect the url to not change
			cy.location('pathname').should('eq', registerSocialPath);

			// Check the terms checkbox
			cy.findByLabelText('I have read and agree', { exact: false }).click({ force: true });

			// Expect the error messages not to be present
			cy.contains('You must agree to the Kiva Terms of Use and Privacy Policy.').should('not.exist');
		});

		it('displays news consent option when consent has not been decided', () => {
			// Visit to RegisterSocial page requesting news consent be returned (news=1)
			cy.visit(`${registerSocialPath}?state=abc&news=1`);

			// Expect only the news input to be displayed
			cy.contains('I want to receive').should('be.visible');
			cy.contains('First name').should('not.be.visible');
			cy.contains('Last name').should('not.be.visible');
			cy.contains('I have read and agree').should('not.be.visible');
		});

		it('displays news consent and requires terms agreement and names when all are needed', () => {
			// Visit to RegisterSocial page requesting names, terms agreement, and news consent (terms=1&names=1&news=1)
			cy.visit(`${registerSocialPath}?state=abc&terms=1&names=1&news=1`);

			// Expect all inputs to be displayed
			cy.contains('First name').should('be.visible');
			cy.contains('Last name').should('be.visible');
			cy.contains('I have read and agree').should('be.visible');
			cy.contains('I want to receive').should('be.visible');

			// Submit the form without entering anything
			cy.contains('Complete registration').click();

			// Expect these error messages to be displayed
			cy.contains('Enter first name.');
			cy.contains('Enter last name.');
			cy.contains('You must agree to the Kiva Terms of Use and Privacy Policy.');

			// Expect the url to not change
			cy.location('pathname').should('eq', registerSocialPath);

			// Check the terms checkbox
			cy.findByLabelText('First name', { exact: false }).type('Test');
			cy.findByLabelText('Last name', { exact: false }).type('Tester');
			cy.findByText('I have read and agree', { exact: false }).click();

			// Expect the error messages not to be present
			cy.contains('Enter first name.').should('not.exist');
			cy.contains('Enter last name.').should('not.exist');
			cy.contains('You must agree to the Kiva Terms of Use and Privacy Policy.').should('not.exist');
		});
	});
});

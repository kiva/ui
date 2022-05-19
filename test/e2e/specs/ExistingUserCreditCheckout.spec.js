describe('Existing User Checkout with Kiva Credit', () => {
	it('Baskets a loan, proceed to checkout, log in user with credit and purchases using kiva credit', () => {
		let beginBalance;
		let newBalance;
		// Cypress.env();
		const lenderID = Cypress.env().userInfo.kivaCreditLender.userID;
		const loginCookie = `${lenderID}:recent/active/mfa`;

		// Mock log in as kivaquality7
		cy.setCookie('kvfa', loginCookie, 'domain=.kiva.org');
		// go to portfolio and get current credit for later calculations
		cy.visit('/portfolio');
		cy.get('.strong .kiva-green').invoke('text').then(fullText => {
			const number = fullText.match(/[0-9,.]+/);
			beginBalance = parseFloat(number); // text to float
		});
		// Go to lend page
		cy.visit('/lend?x');
		// Set sort to random
		cy.get('#filter-loan-sort-dropdown', { timeout: 10000 }).as('sortFilter');
		cy.wait(5000);
		cy.get('@sortFilter', { timeout: 8000 }).select('random');
		// Wait for the lend button to exist, then click it
		cy.get('.loading-overlay', { timeout: 10000 }).should('not.be.visible');
		cy.findAllByText('Lend $25', { timeout: 10000 }).first().click();
		// Wait for the checkout button to exist, then click it
		cy.findByText('Checkout now', { timeout: 10000 }).click();
		// Wait for basket to load and check for complete order button
		cy.findByText('Basket', { timeout: 5000 }).click();
		cy.reload();
		cy.findByText('Complete order', { timeout: 8000 }).click();
		// wait for order confirmation page to load
		cy.findByText('Thank you!', { timeout: 8000 });
		// expand the receipt section
		cy.findByTestId('thanks-page-button-receipt').click();
		// validate kiva credit was used and order total is correct
		cy.findAllByTestId('payment-kiva-credit-used').first().should('to.contain', 'Kiva credit:');
		cy.findAllByTestId('total-amount').first().should('to.contain', '$28.75');
		// get the order total and convert it to a float for caluations
		cy.findAllByTestId('total-amount').first().invoke('text').then(fullText => {
			const number = fullText.match(/[0-9,.]+/);
			const usedBalance = parseFloat(number); // text to float
			// subtract order total from beginning to get new balance
			newBalance = beginBalance - usedBalance;
		});
		// return to portfolio and get new balance
		cy.visit('/portfolio');
		cy.get('.strong .kiva-green').invoke('text').then(fullText => {
			const number = fullText.match(/[0-9,.]+/);
			const endBalance = parseFloat(number); // text to float
			// validate that portfolio balance is equal to expected new balance
			expect(endBalance).to.eq(newBalance);
		});
	});
});

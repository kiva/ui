describe('Existing User Checkout with Kiva Credit', () => {
	it('Logs in user with credit, baskets a loan, proceed to checkout, and purchases using kiva credit', () => {
		let beginBalance;
		let newBalance;
		// get the test user id from cypress.env.json and set the cookie variable
		const lenderID = Cypress.env().userInfo.kivaCreditLender.userID;
		const loginCookie = `${lenderID}:recent/active/mfa`;

		// Mock login our test lender
		cy.setCookie('kvfa', loginCookie, 'domain=.kiva.org');
		// go to portfolio and get current credit for later calculations
		cy.visit('/portfolio');
		cy.get('.strong .kiva-green').invoke('text').then(fullText => {
			const number = fullText.match(/[0-9,.]+/);
			beginBalance = parseFloat(number); // text to float
		});
		// Go to category page for women
		cy.visit('/lend-by-category/women');
		// // Wait for the lend or lend again button to exist, then click it
		cy.findAllByText('Lend now', { timeout: 10000 }).first().click();
		// wait for the basket add lightbox
		cy.get('.kv-lightbox', { timeout: 8000 }).should('be.visible');
		// Wait for the checkout button to exist in the lightbox, then click it
		cy.get('.button-checkout', { timeout: 8000 }).click();
		// Wait for basket to load and check for complete order button
		cy.findByText('Basket', { timeout: 5000 }).click();
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

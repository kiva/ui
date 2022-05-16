function subtract(a, b) {
	return a - b;
}

describe('Existing User Checkout with Kiva Credit', () => {
	it('Baskets a loan, proceed to checkout, log in user with credit and purchases using kiva credit', () => {
		// Mock log in
		cy.setCookie('kvfa', '1003394:recent/active/mfa', 'domain=.kiva.org');
		// go to portfolio and get current credit
		cy.visit('/portfolio');
		cy.get('.strong .kiva-green').invoke('text').then(fullText => {
			const number = fullText.match(/[0-9]+/);
			return +number; // text to numeric
		}).as('beginBalance');
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
		// Wait for basket to load and check for login  button
		cy.findByText('Basket', { timeout: 5000 }).click();
		// // Mock log in
		// cy.setCookie('kvfa', '1003394:recent/active/mfa', 'domain=.kiva.org');
		cy.reload();
		// cy.get('[data-testid="login-to-continue-button"] span span', { timeout: 8000 }).should('not.exist');
		// cy.findByText('Continue', { timeout: 8000 }).should('not.exist');
		// click the complet order button
		// cy.get('[data-testid="kiva-credit-payment-button"]', { timeout: 8000 }).should('be.enabled').click();
		cy.findByText('Complete order', { timeout: 8000 }).click();
		// wait for order confirmation page to load
		// cy.get('.thanks-page', { timeout: 10000 }).should('exist');
		cy.findByText('Thank you!', { timeout: 8000 });
		// cy.findByText('Order Confirmation').click();
		cy.findByTestId('thanks-page-button-receipt').click();
		cy.findAllByTestId('total-amount').first().should('to.contain', '$28.75');
		cy.findAllByTestId('total-amount').first().invoke('text').then(fullText => {
			const number = fullText.match(/[0-9]+/);
			return +number; // text to numeric
		})
			.as('usedBalance');
		cy.findAllByTestId('payment-kiva-credit-used').first().should('to.contain', 'Kiva credit:');
		// return to portfolio and get new balance
		cy.visit('/portfolio');
		cy.get('.strong .kiva-green').invoke('text').then(fullText => {
			const number = fullText.match(/[0-9]+/);
			return +number; // text to numeric
		}).as('endBalance');
		subtract('@beginBalance', '@usedBalance').as('newBalance');
		expect('@newBalance').to.eq('@endBalance');
	});
});

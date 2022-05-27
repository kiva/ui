import { skipOn } from '@cypress/skip-test';

describe('Existing User Checkout with Kiva Credit', () => {
	it('Logs in user with credit, baskets a loan, proceed to checkout, and purchases using kiva credit', () => {
		let beginBalance;
		let newBalance;

		// skip test if test user does not exists in the env file
		const testUsers = Cypress.env('userInfo');
		skipOn(!('kivaCreditLender' in testUsers));

		// get the test user id from cypress.env.json and set the cookie variable
		const lenderID = Cypress.env().userInfo.kivaCreditLender.userID;
		const loginCookie = `${lenderID}:recent/active/mfa`;

		// Spy on GraphQL requests
		cy.intercept('POST', '**/graphql*').as('graphqlRequest');
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

		// Wait for a lend now button to exist, then click it
		cy.get('@graphqlRequest.all');
		cy.findAllByText('Lend now').first().click();
		// wait for the basket add lightbox
		cy.get('@graphqlRequest.all');
		cy.get('.kv-lightbox').should('be.visible');
		// see that checkout button exist in the lightbox, then click it
		cy.get('.button-checkout').click();

		// Wait for basket to load and check for complete order button, click it
		cy.get('@graphqlRequest.all');
		cy.findByText('Basket').click();
		cy.findByText('Complete order').click();

		// wait for order confirmation page to load
		cy.get('@graphqlRequest.all');
		cy.findByText('Thank you!');
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

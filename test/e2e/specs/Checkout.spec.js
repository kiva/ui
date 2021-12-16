// Checkout.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
import {aliasQuery} from "../utils/graphql-test-utils";

describe('Checkout', () => {
	it('Can checkout', () => {

		cy.intercept('POST', '**/graphql*', req => {
			// Setup query alias for specific operations note use lend-by-category
			aliasQuery(req, 'lendFilterPage');
		});
		// go to lend page
		cy.visit('/lend');
		// Wait for search results request to complete. timeout to 30sec
		cy.wait('@gqllendFilterPageQuery', {timeout:30000});
		// add a loan to basket
		cy.get('.loan-card-group').contains('Lend now').click();
		// go to checkout
		cy.contains('Checkout now').click();
		// choose checkout as guest
		cy.contains('Continue as guest').click();

	});
});

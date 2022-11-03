import { aliasQuery } from '../utils/graphql-test-utils';

describe('Header Navigation', () => {
	it('Goes to the results page for loan search suggestions that are clicked', () => {
		// Spy on API requests
		cy.intercept('POST', '**/graphql*', req => {
			// Setup query alias for specific operations
			aliasQuery(req, 'loanSearchSuggestions');
		});
		cy.intercept('GET', '**/v2/loans*').as('sirenLoansRequest');

		// Go to the home page
		cy.visit('/');
		// Type 'f' in the search bar
		cy.findByPlaceholderText('Search all loans').type('f');
		// Wait for search results request to complete
		cy.wait('@gqlloanSearchSuggestionsQuery');
		// Click on the "Fabrics" tag in the search results
		cy.contains('Fabrics').click();
		// Expect to visit the lend page
		cy.location('pathname').should('eq', '/lend');
		// Wait for loan results to load
		cy.wait('@sirenLoansRequest');
		// Expect "Fabrics" filter element to exist
		cy.contains('Fabrics').should('exist');
	});
});

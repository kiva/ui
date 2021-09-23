describe('Header Navigation', () => {
	it('Goes to the results page for loan search suggestions that are clicked', () => {
		// Spy on API requests
		cy.intercept('POST', '**/graphql*').as('graphQLRequest');
		cy.intercept('GET', '**/v2/loans*').as('sirenLoansRequest');

		// Go to the home page
		cy.visit('/');
		// Open the search bar in the header
		cy.contains('Open Search').click();
		// Type 'f' in the currently focused element (the search bar)
		cy.focused().type('f');
		// Wait for search results request to complete
		cy.wait('@graphQLRequest');
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

describe('Aliasing and waiting on API queries', () => {
	// it('Wait for a specific GraphQL request to finish', () => {
	// 	// Spy on the loanSearchSuggestions query
	// 	cy.intercept('POST', '**/graphql*', req => {
	// 		// Setup query alias for specific operations
	// 		aliasQuery(req, 'loanSearchSuggestions');
	// 		// Call aliasQuery again here to spy on other queries
	// 	});

	// 	// Go to the home page
	// 	cy.visit('/');
	// 	// Type 'f' in the search bar
	// 	cy.findByPlaceholderText('Search all loans').type('f');
	// 	// Wait for search results request to complete
	// 	cy.wait('@gqlloanSearchSuggestionsQuery');
	// 	// Find "Fabrics" tag in the search results
	// 	cy.contains('Fabrics');
	// });

	it('Wait for all GraphQL requests to finish', () => {
		// Spy on every GraphQL request
		cy.intercept('POST', '**/graphql*').as('graphqlRequest');

		// Go to all categories page
		cy.visit('/categories-beta');

		// Wait for a page buttons to exist
		cy.get('@graphqlRequest.all');
		cy.findAllByText('View all loans');
		cy.findAllByText('View loan');
		cy.findAllByText('Get started');
	});
});

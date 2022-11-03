import { aliasQuery } from '../utils/graphql-test-utils';

describe('Testing the Categories Beta page elements', () => {
	it('Checks that the buttons and category tiles appear correctly', () => {
		// Spy on every GraphQL request
		cy.intercept('POST', '**/graphql*').as('graphqlRequest');

		// Go to all categories beta page
		cy.visit('/categories-beta');

		// Wait for page buttons to exist
		cy.get('@graphqlRequest.all');
		cy.findAllByText('View all loans');
		cy.findAllByText('Get started');

		// check that 13 category tiles appear on the screen that no categories are out of loans
		cy.get('[data-testid="all-categories-tiles"]').should('have.length', 13);
		cy.get('[data-testid="all-categories-tiles"]').each(element => {
			cy.wrap(element).within(() => {
				cy.get('h4').invoke('text').should('not.eq', '0 loans');
			});
		});
	});

	it('Checks that the spotlight loan has an image and loan information', () => {
		cy.intercept('POST', '**/graphql*', req => {
			aliasQuery(req, 'spotlightLoanQuery');
		});

		// Go to all categories beta page
		cy.visit('/categories-beta');

		cy.wait('@gqlspotlightLoanQueryQuery');
		// Wait for spotlight loan button to exist
		cy.findAllByText('View loan');

		// check that the spotlight loan has a location, description, and image
		cy.get('[data-testid="all-categories-loan-spotlight"]').within(() => {
			cy.get('h3').invoke('text').should('not.be.empty');
			cy.get('p').invoke('text').should('not.be.empty');
			cy.get('picture.spotlight-loan-image').within(() => {
				cy.get('img').invoke('attr', 'src').should('not.be.empty');
			});
		});
	});
});

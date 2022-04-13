describe('Meta information', () => {
	it('Homepage', () => {
		cy.visit('/');

		cy.title().should('eq', 'Make a loan, change a life | Kiva');
		cy.document().get('head meta[name="description"]')
			.should('have.attr', 'content', "Kiva is the world's first online lending platform. "
					+ 'For as little as $25 you can lend to an entrepreneur around the world. Learn more here.');
	});

	it('Covid 19 Response Page', () => {
		cy.visit('/covid19response');

		cy.title().should('eq', "Join Kiva's Global COVID-19 Response | Kiva");
		cy.document().get('head meta[name="description"]')
			.should('have.attr', 'content', 'Help provide relief to small businesses impacted by COVID-19. '
			+ 'For as little as $25, you can contribute—and get repaid so you can lend again. Find out more here.');
	});

	it('Lend By Category Page', () => {
		cy.visit('/lend-by-category');

		cy.title().should('eq', 'See loans by category | Kiva');
		cy.document().get('head meta[name="description"]')
			.should('have.attr', 'content', 'Choose a category, lend to borrowers, and make an impact. '
					+ 'Each Kiva loan helps people build a better future for themselves and their families.');
	});

	it('Lend By Women Category', () => {
		cy.visit('/lend-by-category/women');

		cy.title().should('eq', 'Loan to women around the world | Kiva');
	});
});

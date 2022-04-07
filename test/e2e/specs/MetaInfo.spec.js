describe('Meta information', () => {
	it('Homepage', () => {
		cy.visit('/');

		cy.title().should('eq', 'Make a loan, change a life | Kiva');
		cy.document().get('head meta[name="description"]')
			.should('have.attr', 'content', "Kiva is the world's first online lending platform. "
					+ 'For as little as $25 you can lend to an entrepreneur around the world. Learn more here.');
	});

	it('Homepage', () => {
		cy.visit('/covid19response');

		cy.title().should('eq', "Join Kiva's Global COVID-19 Response | Kiva");
		cy.document().get('head meta[name="description"]')
			.should('have.attr', 'content', 'Help provide relief to small businesses impacted by COVID-19. '
			+ 'For as little as $25, you can contribute—and get repaid so you can lend again. Find out more here.');
	});
});

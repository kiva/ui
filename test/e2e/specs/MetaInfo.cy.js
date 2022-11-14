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

	it('Auto Deposit Landing Page', () => {
		cy.visit('/auto-deposit');

		cy.title().should('eq', 'Set up an Auto Deposit | Kiva');
		cy.document().get('head meta[name="description"]')
			.should('have.attr', 'content', 'With Auto Deposit, your funds are automatically added into your '
				+ 'Kiva lending account, so you can continue to change lives without even thinking about it.');
	});

	it('Monthly Good Landing Page', () => {
		cy.visit('/monthlygood');

		cy.title().should('eq', 'Make an impact with Monthly Good | Kiva');
		cy.document().get('head meta[name="description"]')
			.should('have.attr', 'content', 'Monthly good allows you to support borrowers worldwide with as '
			+ 'little as $5 a month. 100% of your loan goes to the field - make a difference today!');
	});

	it('Donate Support Kiva Page', () => {
		cy.visit('/donate/support-kiva');

		cy.title().should('eq', 'Donate to Kiva and support our mission! | Kiva');
		cy.document().get('head meta[name="description"]')
			.should('have.attr', 'content', 'Your generous donations help Kiva continue and grow our mission of financial inclusivity.'
						+ ' Click here to learn more and make a difference.');
	});

	it('Categories Page', () => {
		cy.visit('/categories');

		cy.title().should('eq', 'Choose a category and fund a loan | Kiva');
		cy.document().get('head meta[name="description"]')
			.should('have.attr', 'content', 'Find and lend to the categories that you\'re passionate about, '
					+ 'from women to refugees to climate, and more. With as little as $25 you can support '
					+ 'entrepreneurs around the world on Kiva.');
	});
});

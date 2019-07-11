// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('lunar', method => {
	cy.request('POST', `/__lunar/${method}`);
});

Cypress.Commands.add('mock', mocks => {
	const serializedMocks = Object.keys(mocks).reduce(
		(packet, key) => Object.assign(packet, { [key]: mocks[key].toString() }),
		{}
	);

	cy.request('POST', '/__lunar/mock', serializedMocks);
});

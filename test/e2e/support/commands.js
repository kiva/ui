// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands';

// Cypress.Commands.add('lunar', method => {
// 	cy.request('POST', `/__lunar/${method}`);
// });
//
// Cypress.Commands.add('mock', mocks => {
// 	const serializedMocks = Object.keys(mocks).reduce(
// 		(packet, key) => {
// 			let mock = mocks[key];
// 			if (typeof mock !== 'function') {
// 				// eslint-disable-next-line no-new-func
// 				mock = new Function(`return ${JSON.stringify(mocks[key])};`);
// 			}
// 			return Object.assign(packet, { [key]: mock.toString() });
// 		},
// 		{}
// 	);
//
// 	cy.request('POST', '/__lunar/mock', serializedMocks);
// });

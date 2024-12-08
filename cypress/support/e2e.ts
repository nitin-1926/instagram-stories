import '@testing-library/cypress/add-commands';

Cypress.Commands.add('getByTestId', (testId: string) => {
	return cy.get(`[data-testid="${testId}"]`);
});

export {};

// Update: 2024-12-08 20:00

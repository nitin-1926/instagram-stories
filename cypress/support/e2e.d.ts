/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		/**
		 * Custom command to select DOM element by data-testid attribute.
		 * @example cy.getByTestId('greeting')
		 */
		getByTestId(value: string): Chainable<JQuery<HTMLElement>>;
	}
}
// Update: 2024-12-24 20:00

// Update: 2024-12-24 20:00

// Update: 2024-12-15 20:00

// Update: 2024-12-25 20:00

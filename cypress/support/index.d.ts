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

// Update: 2024-12-06 20:01

// Update: 2024-12-08 20:03

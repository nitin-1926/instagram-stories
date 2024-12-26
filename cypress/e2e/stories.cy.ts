describe('Instagram Stories', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('should display the stories list', () => {
		cy.contains('Instagram').should('be.visible');
		cy.get('img').should('have.length.at.least', 6); // At least 6 story avatars
	});

	it('should open story viewer when clicking a story', () => {
		// Click the first story
		cy.get('img').first().click();

		// Verify story viewer is open
		cy.get('img[alt="nature_lover"]').should('be.visible');
		cy.contains('nature_lover').should('be.visible');
	});

	it('should navigate through stories using touch areas', () => {
		// Open first story
		cy.get('img').first().click();

		// Store the initial story image source
		cy.get('[data-testid="story-viewer"] img')
			.invoke('attr', 'src')
			.then(initialSrc => {
				// Click right side to move to next story
				cy.get('[data-testid="story-viewer"]').click('right');

				// Wait for the next story to load
				cy.wait(7000);

				// Verify the story image source has changed
				cy.get('[data-testid="story-viewer"] img')
					.invoke('attr', 'src')
					.should('not.equal', initialSrc);

				// Store the new story image source
				cy.get('[data-testid="story-viewer"] img')
					.invoke('attr', 'src')
					.then(() => {
						// Click left side to move back to the previous story
						cy.get('[data-testid="story-viewer"]').click('left');

						// Verify the story image source has changed back to the initial
						cy.get('[data-testid="story-viewer"] img')
							.invoke('attr', 'src')
							.should('equal', initialSrc);
					});
			});
	});

	it('should close story viewer when clicking close button', () => {
		// Open first story
		cy.get('img').first().click();

		// Click close button
		cy.get('[aria-label="Close story"]').click();

		// Verify we're back to the stories list
		cy.contains('Instagram').should('be.visible');
		cy.get('img').should('have.length.at.least', 6);
	});

	it('should mark stories as viewed', () => {
		// Open first story
		cy.get('img').first().click();

		// Wait for story to complete
		cy.wait(15000);

		// Close story
		cy.get('[aria-label="Close story"]').click();

		// Verify story is marked as viewed
		cy.get('[data-testid="story-ring"]')
			.first()
			.should('have.css', 'background')
			.and('include', 'rgb(209, 213, 219)');
	});
});

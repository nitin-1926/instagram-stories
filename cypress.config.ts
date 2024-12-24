import { defineConfig } from 'cypress';

// Use export default instead of module.exports
export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:5173',
		viewportWidth: 375,
		viewportHeight: 812,
		setupNodeEvents(on, config) {
			return config;
		},
	},
});

// Update: 2024-12-07 20:00

// Update: 2024-12-24 20:01

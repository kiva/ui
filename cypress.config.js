/* eslint-disable global-require */
const { defineConfig } = require('cypress');

module.exports = defineConfig({
	fixturesFolder: 'test/e2e/fixtures',
	screenshotsFolder: 'test/e2e/screenshots',
	video: false,
	videosFolder: 'test/e2e/videos',
	reporter: 'cypress-multi-reporters',
	reporterOptions: {
		configFile: 'reporter-config.json',
	},
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			return require('./test/e2e/plugins')(on, config);
		},
		specPattern: 'test/e2e/specs/**/*.cy.{js,jsx,ts,tsx}',
		supportFile: 'test/e2e/support/index.js',
	},
});

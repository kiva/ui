/**
 * @jest-environment node
 */

import SearchEngine from '#src/util/searchEngine';

describe('SearchEngine', () => {
	let engine;

	beforeEach(() => {
		engine = new SearchEngine();
	});

	it('should not try to search if it has not been (re)set with data', async () => {
		let finished = false;

		// Start the search, and expect to complete only after reset()
		const searchPromise = engine.search('test');

		// Use setImmediate to force this to execute after the async search.
		setImmediate(() => {
			finished = true;
			engine.reset([]);
		});

		// Wait for the search to complete
		await searchPromise;
		expect(finished).toBe(true);
	});
});

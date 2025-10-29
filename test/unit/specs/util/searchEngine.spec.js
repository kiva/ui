/**
 * @jest-environment node
 */

import SearchEngine from '../../../../src/util/searchEngine';

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

	it('should initialize with data when provided to constructor', async () => {
		const data = [
			{ label: 'Apple', keywords: ['fruit'] },
			{ label: 'Banana', keywords: ['fruit'] },
		];
		const engineWithData = new SearchEngine(data);

		// Should be able to search immediately
		const results = await engineWithData.search('App');
		expect(results.length).toBeGreaterThan(0);
		expect(results[0].label).toBe('Apple');
	});

	it('should handle empty data array in constructor', () => {
		const emptyEngine = new SearchEngine([]);
		expect(emptyEngine).toBeDefined();
	});

	it('should reset with new data after initialization', async () => {
		const initialData = [{ label: 'Orange', keywords: ['fruit'] }];
		const newData = [{ label: 'Carrot', keywords: ['vegetable'] }];

		const testEngine = new SearchEngine(initialData);
		testEngine.reset(newData);

		const results = await testEngine.search('Carrot');
		expect(results.length).toBeGreaterThan(0);
		expect(results[0].label).toBe('Carrot');
	});
});

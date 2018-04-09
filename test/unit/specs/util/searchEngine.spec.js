import SearchEngine from '@/util/searchEngine';

describe('SearchEngine', () => {
	let engine;

	beforeEach(() => {
		engine = new SearchEngine();
	});

	it('should not try to search if it has not been (re)set with data', done => {
		let finished = false;

		// Start the search, and expect to complete only after reset()
		engine.search('test').then(() => {
			expect(finished).toBe(true);
			done();
		});

		// Use setImmediate to force this to execute after the async search.
		setImmediate(() => {
			finished = true;
			engine.reset([]);
		});
	});
});

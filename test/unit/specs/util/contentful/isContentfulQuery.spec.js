import { isContentfulQuery } from '#src/util/contentful/isContentfulQuery';

describe('isContentfulQuery', () => {
	it('should return true for valid Contentful query', () => {
		const queryAST = {
			definitions: [
				{
					operation: 'query',
					selectionSet: {
						selections: [
							{
								name: {
									value: 'contentful'
								}
							}
						]
					}
				}
			]
		};

		expect(isContentfulQuery(queryAST)).toBe(true);
	});

	it('should return false for non-query operation', () => {
		const queryAST = {
			definitions: [
				{
					operation: 'mutation',
					selectionSet: {
						selections: [
							{
								name: {
									value: 'contentful'
								}
							}
						]
					}
				}
			]
		};

		expect(isContentfulQuery(queryAST)).toBe(false);
	});

	it('should return false for query with non-contentful selection', () => {
		const queryAST = {
			definitions: [
				{
					operation: 'query',
					selectionSet: {
						selections: [
							{
								name: {
									value: 'myQuery'
								}
							}
						]
					}
				}
			]
		};

		expect(isContentfulQuery(queryAST)).toBe(false);
	});

	it('should return false for subscription operation', () => {
		const queryAST = {
			definitions: [
				{
					operation: 'subscription',
					selectionSet: {
						selections: [
							{
								name: {
									value: 'contentful'
								}
							}
						]
					}
				}
			]
		};

		expect(isContentfulQuery(queryAST)).toBe(false);
	});

	it('should return false when definitions is undefined', () => {
		const queryAST = {};

		expect(isContentfulQuery(queryAST)).toBe(false);
	});

	it('should return false when definitions is empty array', () => {
		const queryAST = {
			definitions: []
		};

		expect(isContentfulQuery(queryAST)).toBe(false);
	});

	it('should return false when operation is missing', () => {
		const queryAST = {
			definitions: [
				{
					selectionSet: {
						selections: [
							{
								name: {
									value: 'contentful'
								}
							}
						]
					}
				}
			]
		};

		expect(isContentfulQuery(queryAST)).toBe(false);
	});

	it('should return false when selectionSet is missing', () => {
		const queryAST = {
			definitions: [
				{
					operation: 'query'
				}
			]
		};

		expect(isContentfulQuery(queryAST)).toBe(false);
	});

	it('should return false when selections is missing', () => {
		const queryAST = {
			definitions: [
				{
					operation: 'query',
					selectionSet: {}
				}
			]
		};

		expect(isContentfulQuery(queryAST)).toBe(false);
	});

	it('should return false when name is missing', () => {
		const queryAST = {
			definitions: [
				{
					operation: 'query',
					selectionSet: {
						selections: [
							{}
						]
					}
				}
			]
		};

		expect(isContentfulQuery(queryAST)).toBe(false);
	});

	it('should return false when value is missing', () => {
		const queryAST = {
			definitions: [
				{
					operation: 'query',
					selectionSet: {
						selections: [
							{
								name: {}
							}
						]
					}
				}
			]
		};

		expect(isContentfulQuery(queryAST)).toBe(false);
	});

	it('should return false when queryAST is null', () => {
		expect(isContentfulQuery(null)).toBe(false);
	});

	it('should return false when no argument is provided', () => {
		expect(isContentfulQuery()).toBe(false);
	});

	it('should handle deeply nested missing properties gracefully', () => {
		const queryAST = {
			definitions: [
				{
					operation: 'query',
					selectionSet: {
						selections: [
							{
								name: {
									value: null
								}
							}
						]
					}
				}
			]
		};

		expect(isContentfulQuery(queryAST)).toBe(false);
	});

	it('should handle exception during parsing', () => {
		// Create a query AST that might cause an error if not handled properly
		const malformedQuery = {
			get definitions() {
				throw new Error('Test error');
			}
		};

		expect(isContentfulQuery(malformedQuery)).toBe(false);
	});
});

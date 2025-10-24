import usingTouchResolver from '#src/api/localResolvers/usingTouch';

describe('usingTouch.js', () => {
	let resolver;
	let mockCache;

	beforeEach(() => {
		mockCache = {
			writeQuery: vi.fn(),
			readQuery: vi.fn(),
		};
		resolver = usingTouchResolver();
	});

	describe('defaults', () => {
		it('should set initial usingTouch state to false', () => {
			resolver.defaults(mockCache);

			expect(mockCache.writeQuery).toHaveBeenCalledTimes(1);
			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				data: { usingTouch: false },
			});
		});
	});

	describe('updateUsingTouch mutation', () => {
		it('should update usingTouch state to true', () => {
			const context = { cache: mockCache };
			const result = resolver.resolvers.Mutation.updateUsingTouch(
				null,
				{ usingTouch: true },
				context
			);

			expect(mockCache.writeQuery).toHaveBeenCalledTimes(1);
			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				data: { usingTouch: true },
			});
			expect(result).toBe(true);
		});

		it('should update usingTouch state to false', () => {
			const context = { cache: mockCache };
			const result = resolver.resolvers.Mutation.updateUsingTouch(
				null,
				{ usingTouch: false },
				context
			);

			expect(mockCache.writeQuery).toHaveBeenCalledTimes(1);
			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				data: { usingTouch: false },
			});
			expect(result).toBe(true);
		});

		it('should default to false when no usingTouch argument is provided', () => {
			const context = { cache: mockCache };
			const result = resolver.resolvers.Mutation.updateUsingTouch(
				null,
				{},
				context
			);

			expect(mockCache.writeQuery).toHaveBeenCalledTimes(1);
			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				data: { usingTouch: false },
			});
			expect(result).toBe(true);
		});
	});
});

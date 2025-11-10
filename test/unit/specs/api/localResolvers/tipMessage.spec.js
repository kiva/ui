import tipMessageResolver from '#src/api/localResolvers/tipMessage';

describe('tipMessage.js', () => {
	let resolver;
	let mockCache;

	beforeEach(() => {
		mockCache = {
			writeQuery: vi.fn(),
			readQuery: vi.fn(),
		};
		resolver = tipMessageResolver();
	});

	describe('defaults', () => {
		it('should set initial tip message state', () => {
			resolver.defaults(mockCache);

			expect(mockCache.writeQuery).toHaveBeenCalledTimes(1);
			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				data: {
					tip: {
						id: 0,
						message: '',
						persist: false,
						type: '',
						visible: false,
						__typename: 'TipMessage',
					}
				},
			});
		});
	});

	describe('showTipMessage mutation', () => {
		beforeEach(() => {
			mockCache.readQuery.mockReturnValue({
				tip: {
					id: 0,
					message: '',
					persist: false,
					type: '',
					visible: false,
					__typename: 'TipMessage',
				}
			});
		});

		it('should show a tip message with provided values', () => {
			const context = { cache: mockCache };
			const result = resolver.resolvers.Mutation.showTipMessage(
				null,
				{ message: 'Test message', persist: true, type: 'success' },
				context
			);

			expect(mockCache.readQuery).toHaveBeenCalledTimes(1);
			expect(mockCache.writeQuery).toHaveBeenCalledTimes(1);
			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				data: {
					tip: {
						id: 0,
						message: 'Test message',
						persist: true,
						type: 'success',
						visible: true,
						__typename: 'TipMessage',
					}
				},
			});
			expect(result).toBe(true);
		});

		it('should show a tip message with default values when no arguments provided', () => {
			const context = { cache: mockCache };
			const result = resolver.resolvers.Mutation.showTipMessage(
				null,
				{},
				context
			);

			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				data: {
					tip: {
						id: 0,
						message: '',
						persist: false,
						type: '',
						visible: true,
						__typename: 'TipMessage',
					}
				},
			});
			expect(result).toBe(true);
		});

		it('should preserve existing id and __typename', () => {
			mockCache.readQuery.mockReturnValue({
				tip: {
					id: 5,
					message: 'Old message',
					persist: false,
					type: 'info',
					visible: false,
					__typename: 'TipMessage',
				}
			});

			const context = { cache: mockCache };
			resolver.resolvers.Mutation.showTipMessage(
				null,
				{ message: 'New message', type: 'warning' },
				context
			);

			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				data: {
					tip: {
						id: 5,
						message: 'New message',
						persist: false,
						type: 'warning',
						visible: true,
						__typename: 'TipMessage',
					}
				},
			});
		});
	});

	describe('closeTipMessage mutation', () => {
		beforeEach(() => {
			mockCache.readQuery.mockReturnValue({
				tip: {
					id: 1,
					message: 'Test message',
					persist: true,
					type: 'success',
					visible: true,
					__typename: 'TipMessage',
				}
			});
		});

		it('should close the tip message by setting visible to false', () => {
			const context = { cache: mockCache };
			const result = resolver.resolvers.Mutation.closeTipMessage(
				null,
				{},
				context
			);

			expect(mockCache.readQuery).toHaveBeenCalledTimes(1);
			expect(mockCache.writeQuery).toHaveBeenCalledTimes(1);
			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				data: {
					tip: {
						id: 1,
						message: 'Test message',
						persist: true,
						type: 'success',
						visible: false,
						__typename: 'TipMessage',
					}
				},
			});
			expect(result).toBe(true);
		});

		it('should preserve all other tip properties when closing', () => {
			mockCache.readQuery.mockReturnValue({
				tip: {
					id: 42,
					message: 'Important message',
					persist: false,
					type: 'error',
					visible: true,
					__typename: 'TipMessage',
				}
			});

			const context = { cache: mockCache };
			resolver.resolvers.Mutation.closeTipMessage(
				null,
				{},
				context
			);

			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: expect.anything(),
				data: {
					tip: {
						id: 42,
						message: 'Important message',
						persist: false,
						type: 'error',
						visible: false,
						__typename: 'TipMessage',
					}
				},
			});
		});
	});
});

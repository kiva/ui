import createVerificationLightboxResolver from '#src/api/localResolvers/verificationLightbox';

describe('verificationLightbox resolver', () => {
	let resolver;
	let mockCache;

	beforeEach(() => {
		mockCache = {
			writeQuery: vi.fn(),
		};
		resolver = createVerificationLightboxResolver();
	});

	describe('defaults', () => {
		it('should initialize verificationLightbox state with visible false', () => {
			resolver.defaults(mockCache);

			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: expect.any(Object),
				data: {
					verificationLightbox: {
						id: 0,
						visible: false,
						__typename: 'VerificationLightbox',
					},
				},
			});
		});

		it('should write query with verificationLightbox @client query', () => {
			resolver.defaults(mockCache);

			const call = mockCache.writeQuery.mock.calls[0][0];
			expect(call.query.loc.source.body).toContain('verificationLightbox @client');
		});
	});

	describe('resolvers', () => {
		describe('showVerificationLightbox mutation', () => {
			it('should set visible to true', () => {
				const context = { cache: mockCache };

				const result = resolver.resolvers.Mutation.showVerificationLightbox(
					null,
					{},
					context
				);

				expect(mockCache.writeQuery).toHaveBeenCalledWith({
					query: expect.any(Object),
					data: {
						verificationLightbox: {
							id: 0,
							visible: true,
							__typename: 'VerificationLightbox',
						},
					},
				});
				expect(result).toBe(true);
			});
		});

		describe('closeVerificationLightbox mutation', () => {
			it('should set visible to false', () => {
				const context = { cache: mockCache };

				const result = resolver.resolvers.Mutation.closeVerificationLightbox(
					null,
					{},
					context
				);

				expect(mockCache.writeQuery).toHaveBeenCalledWith({
					query: expect.any(Object),
					data: {
						verificationLightbox: {
							id: 0,
							visible: false,
							__typename: 'VerificationLightbox',
						},
					},
				});
				expect(result).toBe(true);
			});
		});

		describe('mutation sequence', () => {
			it('should handle show then close sequence', () => {
				const context = { cache: mockCache };

				// Show lightbox
				resolver.resolvers.Mutation.showVerificationLightbox(null, {}, context);
				expect(mockCache.writeQuery).toHaveBeenLastCalledWith({
					query: expect.any(Object),
					data: {
						verificationLightbox: {
							id: 0,
							visible: true,
							__typename: 'VerificationLightbox',
						},
					},
				});

				// Close lightbox
				resolver.resolvers.Mutation.closeVerificationLightbox(null, {}, context);
				expect(mockCache.writeQuery).toHaveBeenLastCalledWith({
					query: expect.any(Object),
					data: {
						verificationLightbox: {
							id: 0,
							visible: false,
							__typename: 'VerificationLightbox',
						},
					},
				});

				expect(mockCache.writeQuery).toHaveBeenCalledTimes(2);
			});
		});
	});

	describe('return structure', () => {
		it('should return object with defaults and resolvers', () => {
			expect(resolver).toHaveProperty('defaults');
			expect(resolver).toHaveProperty('resolvers');
			expect(typeof resolver.defaults).toBe('function');
			expect(typeof resolver.resolvers).toBe('object');
		});

		it('should have Mutation resolvers', () => {
			expect(resolver.resolvers).toHaveProperty('Mutation');
			expect(resolver.resolvers.Mutation).toHaveProperty('showVerificationLightbox');
			expect(resolver.resolvers.Mutation).toHaveProperty('closeVerificationLightbox');
		});
	});
});

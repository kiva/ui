import createAddToBasketInterstitialResolver from '../../../../../src/api/localResolvers/addToBasketInterstitial';

describe('addToBasketInterstitial resolver', () => {
	let resolver;
	let mockCache;
	let mockQuery;

	beforeEach(() => {
		mockCache = {
			writeQuery: vi.fn(),
		};
		resolver = createAddToBasketInterstitialResolver();
		mockQuery = expect.any(Object);
	});

	describe('defaults', () => {
		it('should initialize basketAddInterstitial state with default values', () => {
			resolver.defaults(mockCache);

			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: mockQuery,
				data: {
					basketAddInterstitial: {
						id: 0,
						active: false,
						visible: false,
						loanId: 0,
						__typename: 'BasketAddInterstitial',
					}
				},
			});
		});

		it('should write query to cache', () => {
			resolver.defaults(mockCache);

			expect(mockCache.writeQuery).toHaveBeenCalledTimes(1);
		});
	});

	describe('resolvers', () => {
		describe('updateAddToBasketInterstitial mutation', () => {
			it('should update interstitial with all provided values', () => {
				const context = { cache: mockCache };
				const args = {
					active: true,
					visible: true,
					loanId: 12345,
				};

				const result = resolver.resolvers.Mutation.updateAddToBasketInterstitial(
					null,
					args,
					context
				);

				expect(mockCache.writeQuery).toHaveBeenCalledWith({
					query: mockQuery,
					data: {
						basketAddInterstitial: {
							id: 0,
							active: true,
							visible: true,
							loanId: 12345,
							__typename: 'BasketAddInterstitial',
						}
					},
				});

				expect(result).toEqual({
					basketAddInterstitial: {
						id: 0,
						active: true,
						visible: true,
						loanId: 12345,
						__typename: 'BasketAddInterstitial',
					}
				});
			});

			it('should use default false values when no arguments provided', () => {
				const context = { cache: mockCache };
				const args = {};

				const result = resolver.resolvers.Mutation.updateAddToBasketInterstitial(
					null,
					args,
					context
				);

				expect(mockCache.writeQuery).toHaveBeenCalledWith({
					query: mockQuery,
					data: {
						basketAddInterstitial: {
							id: 0,
							active: false,
							visible: false,
							loanId: 0,
							__typename: 'BasketAddInterstitial',
						}
					},
				});

				expect(result.basketAddInterstitial.active).toBe(false);
				expect(result.basketAddInterstitial.visible).toBe(false);
				expect(result.basketAddInterstitial.loanId).toBe(0);
			});

			it('should handle active true, visible false', () => {
				const context = { cache: mockCache };
				const args = {
					active: true,
					visible: false,
					loanId: 99999,
				};

				const result = resolver.resolvers.Mutation.updateAddToBasketInterstitial(
					null,
					args,
					context
				);

				expect(result.basketAddInterstitial.active).toBe(true);
				expect(result.basketAddInterstitial.visible).toBe(false);
				expect(result.basketAddInterstitial.loanId).toBe(99999);
			});

			it('should handle active false, visible true', () => {
				const context = { cache: mockCache };
				const args = {
					active: false,
					visible: true,
					loanId: 55555,
				};

				const result = resolver.resolvers.Mutation.updateAddToBasketInterstitial(
					null,
					args,
					context
				);

				expect(result.basketAddInterstitial.active).toBe(false);
				expect(result.basketAddInterstitial.visible).toBe(true);
				expect(result.basketAddInterstitial.loanId).toBe(55555);
			});

			it('should handle partial arguments with defaults', () => {
				const context = { cache: mockCache };
				const args = {
					loanId: 777,
				};

				const result = resolver.resolvers.Mutation.updateAddToBasketInterstitial(
					null,
					args,
					context
				);

				expect(result.basketAddInterstitial.active).toBe(false);
				expect(result.basketAddInterstitial.visible).toBe(false);
				expect(result.basketAddInterstitial.loanId).toBe(777);
			});

			it('should return data after updating cache', () => {
				const context = { cache: mockCache };
				const args = {
					active: true,
					visible: true,
					loanId: 333,
				};

				const result = resolver.resolvers.Mutation.updateAddToBasketInterstitial(
					null,
					args,
					context
				);

				expect(result.basketAddInterstitial).toBeDefined();
				expect(result.basketAddInterstitial).toHaveProperty('__typename', 'BasketAddInterstitial');
			});
		});

		describe('mutation sequence', () => {
			it('should handle show then hide sequence', () => {
				const context = { cache: mockCache };

				// Show interstitial
				resolver.resolvers.Mutation.updateAddToBasketInterstitial(
					null,
					{ active: true, visible: true, loanId: 123 },
					context
				);

				expect(mockCache.writeQuery).toHaveBeenLastCalledWith({
					query: mockQuery,
					data: {
						basketAddInterstitial: {
							id: 0,
							active: true,
							visible: true,
							loanId: 123,
							__typename: 'BasketAddInterstitial',
						}
					},
				});

				// Hide interstitial
				resolver.resolvers.Mutation.updateAddToBasketInterstitial(
					null,
					{ active: false, visible: false, loanId: 0 },
					context
				);

				expect(mockCache.writeQuery).toHaveBeenLastCalledWith({
					query: mockQuery,
					data: {
						basketAddInterstitial: {
							id: 0,
							active: false,
							visible: false,
							loanId: 0,
							__typename: 'BasketAddInterstitial',
						}
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
			expect(resolver.resolvers.Mutation).toHaveProperty('updateAddToBasketInterstitial');
			expect(typeof resolver.resolvers.Mutation.updateAddToBasketInterstitial).toBe('function');
		});
	});
});

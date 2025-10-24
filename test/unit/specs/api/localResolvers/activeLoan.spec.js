import createActiveLoanResolver from '#src/api/localResolvers/activeLoan';

describe('activeLoan resolver', () => {
	let resolver;
	let mockCache;
	let mockQuery;

	beforeEach(() => {
		mockCache = {
			writeQuery: vi.fn(),
		};
		resolver = createActiveLoanResolver();
		mockQuery = expect.any(Object);
	});

	describe('defaults', () => {
		it('should initialize activeLoan state with default values', () => {
			resolver.defaults(mockCache);

			expect(mockCache.writeQuery).toHaveBeenCalledWith({
				query: mockQuery,
				data: {
					activeLoan: {
						id: 0,
						hoverLoanId: 0,
						xCoordinate: 0,
						yCoordinate: 0,
						loan: JSON.stringify({
							activity: {},
							userProperties: {},
							loanFundraisingInfo: {},
							geocode: {
								country: {},
							},
							image: {},
						}),
						tracking: JSON.stringify({}),
						__typename: 'ActiveLoan',
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
		describe('updateActiveLoan mutation', () => {
			it('should update activeLoan with provided values', () => {
				const context = { cache: mockCache };
				const args = {
					hoverLoanId: 123,
					xCoordinate: 100,
					yCoordinate: 200,
					loan: JSON.stringify({ id: 123, name: 'Test Loan' }),
					tracking: JSON.stringify({ source: 'test' }),
				};

				const result = resolver.resolvers.Mutation.updateActiveLoan(null, args, context);

				expect(mockCache.writeQuery).toHaveBeenCalledWith({
					query: mockQuery,
					data: {
						activeLoan: {
							id: 0,
							hoverLoanId: 123,
							xCoordinate: 100,
							yCoordinate: 200,
							loan: JSON.stringify({ id: 123, name: 'Test Loan' }),
							tracking: JSON.stringify({ source: 'test' }),
							__typename: 'ActiveLoan',
						}
					},
				});

				expect(result).toEqual({
					activeLoan: {
						id: 0,
						hoverLoanId: 123,
						xCoordinate: 100,
						yCoordinate: 200,
						loan: JSON.stringify({ id: 123, name: 'Test Loan' }),
						tracking: JSON.stringify({ source: 'test' }),
						__typename: 'ActiveLoan',
					}
				});
			});

			it('should use default values when no arguments provided', () => {
				const context = { cache: mockCache };
				const args = {};

				const result = resolver.resolvers.Mutation.updateActiveLoan(null, args, context);

				expect(mockCache.writeQuery).toHaveBeenCalledWith({
					query: mockQuery,
					data: {
						activeLoan: {
							id: 0,
							hoverLoanId: 0,
							xCoordinate: 0,
							yCoordinate: 0,
							loan: JSON.stringify({
								activity: {},
								userProperties: {},
								loanFundraisingInfo: {},
								geocode: {
									country: {},
								},
								image: {},
							}),
							tracking: JSON.stringify({}),
							__typename: 'ActiveLoan',
						}
					},
				});

				expect(result.activeLoan.hoverLoanId).toBe(0);
				expect(result.activeLoan.xCoordinate).toBe(0);
				expect(result.activeLoan.yCoordinate).toBe(0);
			});

			it('should handle partial arguments with defaults', () => {
				const context = { cache: mockCache };
				const args = {
					hoverLoanId: 456,
					xCoordinate: 50,
				};

				const result = resolver.resolvers.Mutation.updateActiveLoan(null, args, context);

				expect(result.activeLoan.hoverLoanId).toBe(456);
				expect(result.activeLoan.xCoordinate).toBe(50);
				expect(result.activeLoan.yCoordinate).toBe(0);
			});

			it('should handle zero coordinate values', () => {
				const context = { cache: mockCache };
				const args = {
					hoverLoanId: 789,
					xCoordinate: 0,
					yCoordinate: 0,
				};

				const result = resolver.resolvers.Mutation.updateActiveLoan(null, args, context);

				expect(result.activeLoan.xCoordinate).toBe(0);
				expect(result.activeLoan.yCoordinate).toBe(0);
			});

			it('should preserve loan and tracking JSON strings', () => {
				const context = { cache: mockCache };
				const loanData = {
					id: 999,
					activity: { name: 'Farming' },
					userProperties: { lenderCount: 5 },
				};
				const trackingData = { source: 'category_page', position: 3 };
				const args = {
					hoverLoanId: 999,
					loan: JSON.stringify(loanData),
					tracking: JSON.stringify(trackingData),
				};

				const result = resolver.resolvers.Mutation.updateActiveLoan(null, args, context);

				expect(result.activeLoan.loan).toBe(JSON.stringify(loanData));
				expect(result.activeLoan.tracking).toBe(JSON.stringify(trackingData));
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
			expect(resolver.resolvers.Mutation).toHaveProperty('updateActiveLoan');
			expect(typeof resolver.resolvers.Mutation.updateActiveLoan).toBe('function');
		});
	});
});

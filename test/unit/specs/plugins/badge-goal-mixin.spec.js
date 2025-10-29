import badgeGoalMixin from '../../../../src/plugins/badge-goal-mixin';

vi.mock('#src/util/injectionCheck', () => ({
	default: vi.fn()
}));

describe('badge-goal-mixin.js', () => {
	let context;
	let mockApollo;

	beforeEach(() => {
		mockApollo = {
			mutate: vi.fn().mockResolvedValue({
				data: {
					my: {
						createUserPreferences: {
							id: 1,
							preferences: ''
						},
						updateUserPreferences: {
							id: 1,
							preferences: '{"goal":"lender"}'
						}
					}
				}
			})
		};

		// Create a mock context simulating a Vue component
		context = {
			apollo: mockApollo,
			cookieStore: {}
		};

		// Bind methods
		Object.assign(context, badgeGoalMixin.methods);
	});

	describe('createUserPreferences', () => {
		it('should call apollo.mutate with createUserPreferences mutation', async () => {
			await context.createUserPreferences();

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.anything(),
				variables: {
					preferences: ''
				}
			});
		});

		it('should return mutation result', async () => {
			const result = await context.createUserPreferences();

			expect(result).toEqual({
				data: {
					my: {
						createUserPreferences: {
							id: 1,
							preferences: ''
						},
						updateUserPreferences: {
							id: 1,
							preferences: '{"goal":"lender"}'
						}
					}
				}
			});
		});
	});

	describe('storeGoal', () => {
		it('should call apollo.mutate with correct variables', async () => {
			const userPreferences = {
				id: 5,
				preferences: {
					existingKey: 'existingValue'
				}
			};
			const badgeName = 'lender';

			await context.storeGoal({ userPreferences, badgeName });

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.anything(),
				variables: {
					updateUserPreferencesId: 5,
					preferences: '{"existingKey":"existingValue","goal":"lender"}'
				}
			});
		});

		it('should preserve existing preferences when adding goal', async () => {
			const userPreferences = {
				id: 10,
				preferences: {
					theme: 'dark',
					language: 'en'
				}
			};
			const badgeName = 'borrower';

			await context.storeGoal({ userPreferences, badgeName });

			const call = mockApollo.mutate.mock.calls[0][0];
			const storedPreferences = JSON.parse(call.variables.preferences);

			expect(storedPreferences).toEqual({
				theme: 'dark',
				language: 'en',
				goal: 'borrower'
			});
		});

		it('should handle empty existing preferences', async () => {
			const userPreferences = {
				id: 3,
				preferences: {}
			};
			const badgeName = 'trustee';

			await context.storeGoal({ userPreferences, badgeName });

			const call = mockApollo.mutate.mock.calls[0][0];
			const storedPreferences = JSON.parse(call.variables.preferences);

			expect(storedPreferences).toEqual({
				goal: 'trustee'
			});
		});

		it('should throw error when mutation fails', async () => {
			mockApollo.mutate.mockRejectedValue(new Error('Mutation failed'));

			const userPreferences = {
				id: 1,
				preferences: {}
			};
			const badgeName = 'lender';

			await expect(
				context.storeGoal({ userPreferences, badgeName })
			).rejects.toThrow('Mutation failed');
		});

		it('should throw error when JSON.stringify fails', async () => {
			// Create circular reference to cause JSON.stringify to fail
			const circularPreferences = {};
			circularPreferences.self = circularPreferences;

			const userPreferences = {
				id: 1,
				preferences: circularPreferences
			};
			const badgeName = 'lender';

			try {
				await context.storeGoal({ userPreferences, badgeName });
				// If we get here, the test should fail
				expect(true).toBe(false);
			} catch (error) {
				// The error message should contain the circular reference error
				expect(error.message).toContain('Converting circular structure to JSON');
			}
		});

		it('should return mutation result on success', async () => {
			const userPreferences = {
				id: 1,
				preferences: {}
			};
			const badgeName = 'lender';

			const result = await context.storeGoal({ userPreferences, badgeName });

			expect(result).toEqual({
				data: {
					my: {
						createUserPreferences: {
							id: 1,
							preferences: ''
						},
						updateUserPreferences: {
							id: 1,
							preferences: '{"goal":"lender"}'
						}
					}
				}
			});
		});
	});
});

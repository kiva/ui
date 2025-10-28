import { render, waitFor } from '@testing-library/vue';
import useGivingFund from '#src/composables/useGivingFund';

// Mock dependencies
vi.mock('#src/util/logFormatter');

describe('useGivingFund', () => {
	let mockApollo;
	let composable;

	beforeEach(() => {
		mockApollo = {
			query: vi.fn(),
		};
		composable = useGivingFund(mockApollo);
	});

	describe('getFundTargetDisplayNounFromName', () => {
		it('should return null for null or undefined input', () => {
			expect(composable.getFundTargetDisplayNounFromName(null)).toBe(null);
			expect(composable.getFundTargetDisplayNounFromName(undefined)).toBe(null);
		});

		it('should return "climate action" for "climate-threatened people"', () => {
			expect(composable.getFundTargetDisplayNounFromName('climate-threatened people')).toBe('climate action');
		});

		it('should return "U.S. small businesses" for "U.S. entrepreneurs"', () => {
			expect(composable.getFundTargetDisplayNounFromName('U.S. entrepreneurs')).toBe('U.S. small businesses');
		});

		it('should return the original category name for unmapped categories', () => {
			expect(composable.getFundTargetDisplayNounFromName('women')).toBe('women');
			expect(composable.getFundTargetDisplayNounFromName('refugees')).toBe('refugees');
		});
	});

	describe('getFundTargetSupportedPeoplePhraseFromName', () => {
		it('should return null for null or undefined input', () => {
			expect(composable.getFundTargetSupportedPeoplePhraseFromName(null)).toBe(null);
			expect(composable.getFundTargetSupportedPeoplePhraseFromName(undefined)).toBe(null);
		});

		it('should return specific category names for mapped categories', () => {
			expect(composable.getFundTargetSupportedPeoplePhraseFromName('women')).toBe('women');
			expect(composable.getFundTargetSupportedPeoplePhraseFromName('refugees')).toBe('refugees');
			expect(composable.getFundTargetSupportedPeoplePhraseFromName('U.S. entrepreneurs'))
				.toBe('U.S. entrepreneurs');
		});

		it('should return "people" for unmapped categories', () => {
			expect(composable.getFundTargetSupportedPeoplePhraseFromName('climate-threatened people')).toBe('people');
			expect(composable.getFundTargetSupportedPeoplePhraseFromName('farmers')).toBe('people');
		});
	});

	describe('fetchGivingFundDonationData', () => {
		it('should call apollo.query with correct default parameters', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 5,
							values: [],
						},
					},
				},
			});

			await composable.fetchGivingFundDonationData();

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				fetchPolicy: 'network-only',
				variables: {
					limit: 20,
					offset: 0,
				},
			});
		});

		it('should include fundIds filter when provided', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 5,
							values: [],
						},
					},
				},
			});

			await composable.fetchGivingFundDonationData([123, 456], 10, 20);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				fetchPolicy: 'network-only',
				variables: {
					limit: 10,
					offset: 20,
					filter: {
						fundIds: [123, 456],
					},
				},
			});
		});

		it('should return query result data', async () => {
			const mockData = {
				givingFundParticipation: {
					totalCount: 2,
					values: [{ fundId: 1 }, { fundId: 2 }],
				},
			};
			mockApollo.query.mockResolvedValue({
				data: {
					my: mockData,
				},
			});

			const result = await composable.fetchGivingFundDonationData();

			expect(result).toEqual(mockData);
		});

		it('should handle errors gracefully', async () => {
			mockApollo.query.mockRejectedValue(new Error('Network error'));

			const result = await composable.fetchGivingFundDonationData();

			expect(result).toBeUndefined();
		});
	});

	describe('fetchFullGivingFundDonationData', () => {
		it('should call apollo.query with correct parameters', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 5,
							values: [],
						},
					},
				},
			});

			await composable.fetchFullGivingFundDonationData([789], 15, 30);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				fetchPolicy: 'network-only',
				variables: {
					limit: 15,
					offset: 30,
					filter: {
						fundIds: [789],
					},
				},
			});
		});

		it('should return query result data', async () => {
			const mockData = {
				givingFundParticipation: {
					totalCount: 1,
					values: [{ givingFund: { id: 1, name: 'Test Fund' } }],
				},
			};
			mockApollo.query.mockResolvedValue({
				data: {
					my: mockData,
				},
			});

			const result = await composable.fetchFullGivingFundDonationData([1]);

			expect(result).toEqual(mockData);
		});

		it('should handle errors gracefully', async () => {
			mockApollo.query.mockRejectedValue(new Error('GraphQL error'));

			const result = await composable.fetchFullGivingFundDonationData();

			expect(result).toBeUndefined();
		});
	});

	describe('getDonationTotalsForFund', () => {
		it('should return 0 for null or undefined fundId', async () => {
			const result = await composable.getDonationTotalsForFund(null);
			expect(result).toBe(0);

			const result2 = await composable.getDonationTotalsForFund(undefined);
			expect(result2).toBe(0);
		});

		it('should return total donated amount for single page result', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 3,
							values: [
								{ amountDonated: 25 },
								{ amountDonated: 50 },
								{ amountDonated: 25 },
							],
						},
					},
				},
			});

			const result = await composable.getDonationTotalsForFund(123);

			expect(result).toBe(100);
		});

		it('should return 0 when no donations exist', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 0,
							values: [],
						},
					},
				},
			});

			const result = await composable.getDonationTotalsForFund(123);

			expect(result).toBe(0);
		});

		it('should handle pagination for large result sets', async () => {
			// First call returns 25 total count with first 20 items
			mockApollo.query.mockResolvedValueOnce({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 25,
							values: Array(20).fill({ amountDonated: 10 }),
						},
					},
				},
			});

			// Second call for offset 20
			mockApollo.query.mockResolvedValueOnce({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 5,
							values: Array(5).fill({ amountDonated: 10 }),
						},
					},
				},
			});

			const result = await composable.getDonationTotalsForFund(123);

			// First call fetches initial data, second call fetches remaining with offset
			expect(mockApollo.query).toHaveBeenCalledTimes(3); // Initial + 2 pagination calls
			expect(result).toBe(250); // 25 donations * 10 each
		});
	});

	describe('getFundsContributedToIds', () => {
		it('should return empty array when no donations exist', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 0,
							values: [],
						},
					},
				},
			});

			const result = await composable.getFundsContributedToIds();

			expect(result).toEqual([]);
		});

		it('should extract unique fund IDs from donations', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 3,
							values: [
								{ givingFund: { id: 1, owner: { id: 100 } } },
								{ givingFund: { id: 2, owner: { id: 101 } } },
								{ givingFund: { id: 1, owner: { id: 100 } } }, // duplicate
							],
						},
					},
				},
			});

			const result = await composable.getFundsContributedToIds();

			expect(result).toEqual([1, 2]);
		});

		it('should filter out funds without owner', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 2,
							values: [
								{ givingFund: { id: 1, owner: { id: 100 } } },
								{ givingFund: { id: 2, owner: null } },
							],
						},
					},
				},
			});

			const result = await composable.getFundsContributedToIds();

			expect(result).toEqual([1]);
		});

		it('should filter out funds owned by current user', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 3,
							values: [
								{ givingFund: { id: 1, owner: { id: 100 } } },
								{ givingFund: { id: 2, owner: { id: 999 } } }, // current user
								{ givingFund: { id: 3, owner: { id: 101 } } },
							],
						},
					},
				},
			});

			const result = await composable.getFundsContributedToIds(999);

			expect(result).toEqual([1, 3]);
		});

		it('should handle string ownerId conversion', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 2,
							values: [
								{ givingFund: { id: 1, owner: { id: 100 } } },
								{ givingFund: { id: 2, owner: { id: 999 } } },
							],
						},
					},
				},
			});

			const result = await composable.getFundsContributedToIds('999');

			expect(result).toEqual([1]);
		});
	});

	describe('getDedupedFundsContributedToEntries', () => {
		it('should return empty array when no donations exist', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 0,
							values: [],
						},
					},
				},
			});

			const result = await composable.getDedupedFundsContributedToEntries([1, 2]);

			expect(result).toEqual([]);
		});

		it('should return unique fund entries', async () => {
			const fund1 = { id: 1, name: 'Fund 1' };
			const fund2 = { id: 2, name: 'Fund 2' };
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 3,
							values: [
								{ givingFund: fund1 },
								{ givingFund: fund2 },
								{ givingFund: fund1 }, // duplicate
							],
						},
					},
				},
			});

			const result = await composable.getDedupedFundsContributedToEntries([1, 2]);

			expect(result).toEqual([fund1, fund2]);
		});

		it('should pass fundIds to query', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 0,
							values: [],
						},
					},
				},
			});

			await composable.getDedupedFundsContributedToEntries([123, 456]);

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object),
				fetchPolicy: 'network-only',
				variables: {
					limit: 20,
					offset: 0,
					filter: {
						fundIds: [123, 456],
					},
				},
			});
		});
	});

	describe('component-mounted context', () => {
		it('should work when rendered in a component context', async () => {
			const TestComponent = {
				template: '<div><span data-testid="test">{{ result }}</span></div>',
				setup() {
					const givingFund = useGivingFund(mockApollo);
					return {
						result: givingFund.getFundTargetDisplayNounFromName('women'),
					};
				},
			};

			const { getByTestId } = render(TestComponent);

			await waitFor(() => {
				expect(getByTestId('test').textContent).toBe('women');
			});
		});

		it('should handle async operations in component context', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: {
						givingFundParticipation: {
							totalCount: 0,
							values: [],
						},
					},
				},
			});

			const TestComponent = {
				template: '<div><span data-testid="test">{{ result }}</span></div>',
				setup() {
					const givingFund = useGivingFund(mockApollo);
					const result = { value: 'loading' };

					givingFund.getFundsContributedToIds().then(ids => {
						result.value = ids.length;
					});

					return { result };
				},
			};

			render(TestComponent);

			await waitFor(() => {
				expect(mockApollo.query).toHaveBeenCalled();
			});
		});
	});
});

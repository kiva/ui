import { render, waitFor } from '@testing-library/vue';
import useBorrowerProfileData from '#src/composables/useBorrowerProfileData';
import { watchLoanData } from '#src/util/loanUtils';

// Mock dependencies
vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

vi.mock('#src/util/loanUtils', () => ({
	watchLoanData: vi.fn()
}));

vi.mock('#src/graphql/query/postCheckoutAchievements.graphql', () => ({
	default: 'postCheckoutAchievementsQuery'
}));

vi.mock('#src/graphql/query/borrowerProfileSideSheet.graphql', () => ({
	default: 'borrowerProfileSideSheetQuery'
}));

describe('useBorrowerProfileData.js', () => {
	let mockApollo;
	let mockCookieStore;
	let mockWatchedQuery;

	beforeEach(() => {
		mockApollo = {
			query: vi.fn().mockResolvedValue({ data: {} })
		};
		mockCookieStore = {};
		mockWatchedQuery = {
			subscription: {
				unsubscribe: vi.fn()
			}
		};
		watchLoanData.mockReturnValue(mockWatchedQuery);
		vi.clearAllMocks();
	});

	describe('initialization', () => {
		it('should throw error if apolloClient is not provided', () => {
			expect(() => useBorrowerProfileData(null, mockCookieStore)).toThrow('ApolloClient is required');
		});

		it('should throw error if cookieStore is not provided', () => {
			expect(() => useBorrowerProfileData(mockApollo, null)).toThrow('CookieStore is required');
		});

		it('should initialize with proper structure when both params provided', () => {
			const TestComponent = {
				template: '<div data-testid="test">{{ loading }}</div>',
				setup() {
					return useBorrowerProfileData(mockApollo, mockCookieStore);
				}
			};

			const { getByTestId } = render(TestComponent);

			// Should be loading initially (no bpData yet)
			expect(getByTestId('test').textContent).toBe('true');
		});
	});

	describe('computed properties', () => {
		it('should compute loading state correctly', () => {
			const TestComponent = {
				template: '<div><span data-testid="loading">{{ loading }}</span></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					return { loading: composable.loading };
				}
			};

			const { getByTestId } = render(TestComponent);

			// Initially loading (no data)
			expect(getByTestId('loading').textContent).toBe('true');
		});

		it('should compute isGuest correctly when no user data', () => {
			const TestComponent = {
				template: '<div><span data-testid="guest">{{ isGuest }}</span></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					return { isGuest: composable.isGuest };
				}
			};

			const { getByTestId } = render(TestComponent);

			// Should be guest when no bpData.my
			expect(getByTestId('guest').textContent).toBe('true');
		});

		it('should compute loanId correctly with default value', () => {
			const TestComponent = {
				template: '<div><span data-testid="loanId">{{ loanId }}</span></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					return { loanId: composable.loanId };
				}
			};

			const { getByTestId } = render(TestComponent);

			// Default loanId is 0
			expect(getByTestId('loanId').textContent).toBe('0');
		});

		it('should return default values for all loan properties', () => {
			const TestComponent = {
				template: `<div>
					<span data-testid="name">{{ name }}</span>
					<span data-testid="country">{{ country }}</span>
					<span data-testid="borrowerCount">{{ borrowerCount }}</span>
					<span data-testid="loanAmount">{{ loanAmount }}</span>
				</div>`,
				setup() {
					return useBorrowerProfileData(mockApollo, mockCookieStore);
				}
			};

			const { getByTestId } = render(TestComponent);

			// All should have default values
			expect(getByTestId('name').textContent).toBe('');
			expect(getByTestId('country').textContent).toBe('');
			expect(getByTestId('borrowerCount').textContent).toBe('0');
			expect(getByTestId('loanAmount').textContent).toBe('0');
		});

		it('should compute fundraisingPercent with default value', () => {
			const TestComponent = {
				template: '<div><span data-testid="percent">{{ fundraisingPercent }}</span></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					return { fundraisingPercent: composable.fundraisingPercent };
				}
			};

			const { getByTestId } = render(TestComponent);

			expect(getByTestId('percent').textContent).toBe('0');
		});

		it('should compute inPfp with default value false', () => {
			const TestComponent = {
				template: '<div><span data-testid="pfp">{{ inPfp }}</span></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					return { inPfp: composable.inPfp };
				}
			};

			const { getByTestId } = render(TestComponent);

			expect(getByTestId('pfp').textContent).toBe('false');
		});
	});

	describe('loadBPData', () => {
		it('should not load data when loanDataId is falsy', () => {
			const TestComponent = {
				template: '<div></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					composable.loadBPData(null);
					composable.loadBPData(undefined);
					composable.loadBPData(0);
					return {};
				}
			};

			render(TestComponent);

			// watchLoanData should not be called for falsy IDs
			expect(watchLoanData).not.toHaveBeenCalled();
		});

		it('should not load data when loanDataId is not a number', () => {
			const TestComponent = {
				template: '<div></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					composable.loadBPData('123');
					composable.loadBPData({});
					composable.loadBPData([]);
					return {};
				}
			};

			render(TestComponent);

			expect(watchLoanData).not.toHaveBeenCalled();
		});

		it('should call watchLoanData with correct parameters', async () => {
			const TestComponent = {
				template: '<div></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					composable.loadBPData(12345);
					return {};
				}
			};

			render(TestComponent);

			await waitFor(() => {
				expect(watchLoanData).toHaveBeenCalledWith(
					expect.objectContaining({
						apollo: mockApollo,
						cookieStore: mockCookieStore,
						loanId: 12345,
						loanQuery: 'borrowerProfileSideSheetQuery',
						callback: expect.any(Function)
					})
				);
			});
		});

		it('should query postCheckoutAchievements with loanId', async () => {
			const TestComponent = {
				template: '<div></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					composable.loadBPData(67890);
					return {};
				}
			};

			render(TestComponent);

			await waitFor(() => {
				expect(mockApollo.query).toHaveBeenCalledWith({
					query: 'postCheckoutAchievementsQuery',
					variables: { loanIds: [67890] }
				});
			});
		});

		it('should handle callback from watchLoanData', async () => {
			let callbackFn;
			watchLoanData.mockImplementation(({ callback }) => {
				callbackFn = callback;
				return mockWatchedQuery;
			});

			const TestComponent = {
				template: '<div><span data-testid="loanName">{{ name }}</span></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					composable.loadBPData(111);
					return { name: composable.name };
				}
			};

			const { getByTestId } = render(TestComponent);

			// Initially empty
			expect(getByTestId('loanName').textContent).toBe('');

			// Simulate callback with loan data
			await waitFor(() => {
				expect(callbackFn).toBeDefined();
			});

			callbackFn({
				data: {
					lend: {
						loan: {
							id: 111,
							name: 'Test Borrower'
						}
					}
				}
			});

			// Should update computed name
			await waitFor(() => {
				expect(getByTestId('loanName').textContent).toBe('Test Borrower');
			});
		});

		it('should handle errors in loadBPData', () => {
			watchLoanData.mockImplementation(() => {
				throw new Error('Watch error');
			});

			const TestComponent = {
				template: '<div></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					// Should not throw
					composable.loadBPData(123);
					return {};
				}
			};

			expect(() => render(TestComponent)).not.toThrow();
		});
	});

	describe('clearBPData', () => {
		it('should unsubscribe and clear all data', async () => {
			const TestComponent = {
				template: `<div>
					<span data-testid="loading">{{ loading }}</span>
					<button @click="clear" data-testid="clearBtn">Clear</button>
				</div>`,
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					composable.loadBPData(999);
					return {
						loading: composable.loading,
						clear: composable.clearBPData
					};
				}
			};

			const { getByTestId } = render(TestComponent);

			// Load data first
			await waitFor(() => {
				expect(watchLoanData).toHaveBeenCalled();
			});

			// Click clear button
			getByTestId('clearBtn').click();

			// Should unsubscribe
			await waitFor(() => {
				expect(mockWatchedQuery.subscription.unsubscribe).toHaveBeenCalled();
			});

			// Should be loading again (data cleared)
			expect(getByTestId('loading').textContent).toBe('true');
		});

		it('should handle clearBPData when no subscription exists', () => {
			const TestComponent = {
				template: '<div></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);
					// Should not throw when clearing without loading
					composable.clearBPData();
					return {};
				}
			};

			expect(() => render(TestComponent)).not.toThrow();
		});
	});

	describe('return value structure', () => {
		it('should return all expected properties and methods', () => {
			const TestComponent = {
				template: '<div></div>',
				setup() {
					const composable = useBorrowerProfileData(mockApollo, mockCookieStore);

					// Verify key properties exist
					expect(composable).toHaveProperty('loadBPData');
					expect(composable).toHaveProperty('clearBPData');
					expect(composable).toHaveProperty('loading');
					expect(composable).toHaveProperty('isGuest');
					expect(composable).toHaveProperty('loan');
					expect(composable).toHaveProperty('loanId');
					expect(composable).toHaveProperty('name');
					expect(composable).toHaveProperty('country');
					expect(composable).toHaveProperty('loanAmount');
					expect(composable).toHaveProperty('fundraisingPercent');

					return {};
				}
			};

			render(TestComponent);
		});
	});
});

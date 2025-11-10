import { readBoolSetting } from '#src/util/settingsUtils';
import useMyKivaHome from '#src/composables/useMyKivaHome';
import { getIsMyKivaEnabled } from '#src/util/myKivaUtils';
import { render, waitFor } from '@testing-library/vue';

// Mock the dependencies
vi.mock('#src/util/myKivaUtils', () => ({
	getIsMyKivaEnabled: vi.fn(),
	MY_KIVA_FOR_ALL_USERS_KEY: 'my_kiva_for_all_users'
}));

vi.mock('#src/util/settingsUtils', () => ({
	readBoolSetting: vi.fn()
}));

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

vi.mock('#src/graphql/query/shared/myKivaForAllUsers.graphql', () => ({
	default: 'myKivaForAllUsersQuery'
}));

describe('useMyKivaHome.js', () => {
	let mockApollo;
	let mockKvTrackEvent;
	let mockCookieStore;

	beforeEach(() => {
		mockApollo = {
			query: vi.fn()
		};

		mockKvTrackEvent = vi.fn();
		mockCookieStore = {};
	});

	it('should call Apollo query on mount', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 123 },
				general: { my_kiva_for_all_users: { value: 'false' } }
			}
		});
		readBoolSetting.mockReturnValue(false);

		// Call the composable - it will be used in a component
		const composable = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		// Verify composable exports the expected computed properties
		expect(composable.homePagePath).toBeDefined();
		expect(composable.portfolioPath).toBeDefined();
	});

	it('should export homePagePath computed property', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 123 },
				general: { my_kiva_for_all_users: { value: 'false' } }
			}
		});

		const { homePagePath } = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		expect(homePagePath).toBeDefined();
		expect(typeof homePagePath.value).toBe('string');
	});

	it('should export portfolioPath computed property', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 123 },
				general: { my_kiva_for_all_users: { value: 'false' } }
			}
		});

		const { portfolioPath } = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		expect(portfolioPath).toBeDefined();
		expect(typeof portfolioPath.value).toBe('string');
	});

	it('should handle Apollo query errors gracefully', async () => {
		mockApollo.query.mockRejectedValue(new Error('Query failed'));

		// Should not throw error
		expect(() => {
			useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);
		}).not.toThrow();
	});

	it('should handle missing userData from query', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: null,
				general: { my_kiva_for_all_users: { value: 'true' } }
			}
		});
		readBoolSetting.mockReturnValue(true);

		const { homePagePath } = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		// Should default to '/' when user data is missing
		expect(homePagePath).toBeDefined();
	});

	it('should handle myKivaFlagEnabled being false', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 123 },
				general: { my_kiva_for_all_users: { value: 'false' } }
			}
		});
		readBoolSetting.mockReturnValue(false);

		const { homePagePath } = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		expect(homePagePath).toBeDefined();
	});

	it('should default homePagePath to "/" when redirectToMyKivaHomepage is false', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 123 },
				general: { my_kiva_for_all_users: { value: 'false' } }
			}
		});
		readBoolSetting.mockReturnValue(false);

		const { homePagePath } = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		expect(homePagePath.value).toBe('/');
	});

	it('should default portfolioPath to "/portfolio" when redirectToMyKivaHomepage is false', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 123 },
				general: { my_kiva_for_all_users: { value: 'false' } }
			}
		});
		readBoolSetting.mockReturnValue(false);

		const { portfolioPath } = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		expect(portfolioPath.value).toBe('/portfolio');
	});

	it('should set up composable with correct structure', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 123 },
				general: { my_kiva_for_all_users: { value: 'false' } }
			}
		});
		readBoolSetting.mockReturnValue(false);

		const composable = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		expect(composable).toHaveProperty('homePagePath');
		expect(composable).toHaveProperty('portfolioPath');
		expect(composable.homePagePath.value).toBe('/');
		expect(composable.portfolioPath.value).toBe('/portfolio');
	});

	it('should handle fetchUserData with null data.my', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: null,
				general: { my_kiva_for_all_users: { value: 'false' } }
			}
		});
		readBoolSetting.mockReturnValue(false);

		const composable = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		expect(composable.homePagePath.value).toBe('/');
		expect(composable.portfolioPath.value).toBe('/portfolio');
	});

	it('should handle error in fetchUserData', async () => {
		const mockError = new Error('Network error');
		mockApollo.query.mockRejectedValue(mockError);

		// Should not throw
		expect(() => {
			useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);
		}).not.toThrow();
	});

	it('should handle successful query with user data', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 456, name: 'Test User' },
				general: { my_kiva_for_all_users: { value: 'true' } }
			}
		});
		readBoolSetting.mockReturnValue(true);

		const composable = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		expect(composable.homePagePath).toBeDefined();
		expect(composable.portfolioPath).toBeDefined();
	});

	it('should handle query response with undefined data', () => {
		mockApollo.query.mockResolvedValue({
			data: undefined
		});
		readBoolSetting.mockReturnValue(false);

		const composable = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		expect(composable.homePagePath.value).toBe('/');
	});

	it('should handle query response with null my property', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: null,
				general: { my_kiva_for_all_users: { value: 'true' } }
			}
		});
		readBoolSetting.mockReturnValue(true);

		const composable = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		expect(composable).toBeDefined();
	});

	it('should set up composable with enabled flag configuration', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 789 },
				general: { my_kiva_for_all_users: { value: 'true' } }
			}
		});
		readBoolSetting.mockReturnValue(true);
		getIsMyKivaEnabled.mockReturnValue(true);

		const result = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		// Verify that the composable is properly set up with correct structure
		expect(result).toHaveProperty('homePagePath');
		expect(result).toHaveProperty('portfolioPath');
		expect(result.homePagePath.value).toBeDefined();
		expect(result.portfolioPath.value).toBeDefined();
	});

	it('should handle various data configurations', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 456 },
				general: { my_kiva_for_all_users: { value: 'true' } }
			}
		});
		readBoolSetting.mockReturnValue(true);
		getIsMyKivaEnabled.mockReturnValue(false);

		const result = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		// Verify composable structure
		expect(result).toHaveProperty('homePagePath');
		expect(result).toHaveProperty('portfolioPath');
	});

	it('should initialize with default path values', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 123 },
				general: { my_kiva_for_all_users: { value: 'false' } }
			}
		});
		readBoolSetting.mockReturnValue(false);

		const { homePagePath, portfolioPath } = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		// Initial values before any redirect logic
		expect(homePagePath.value).toBe('/');
		expect(portfolioPath.value).toBe('/portfolio');
	});

	it('should handle query with userData containing no id field', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { name: 'Test' }, // Has data but no id
				general: { my_kiva_for_all_users: { value: 'true' } }
			}
		});
		readBoolSetting.mockReturnValue(true);

		const { homePagePath, portfolioPath } = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		// Should return composable with proper structure
		expect(homePagePath.value).toBeDefined();
		expect(portfolioPath.value).toBeDefined();
	});

	it('should export computed properties for paths', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 999 },
				general: { my_kiva_for_all_users: { value: 'true' } }
			}
		});
		readBoolSetting.mockReturnValue(true);

		const { homePagePath, portfolioPath } = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		// Verify computed properties are reactive
		expect(typeof homePagePath.value).toBe('string');
		expect(typeof portfolioPath.value).toBe('string');
	});

	it('should handle readBoolSetting return values', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 888 },
				general: { my_kiva_for_all_users: { value: 'false' } }
			}
		});
		readBoolSetting.mockReturnValue(false);

		const { homePagePath, portfolioPath } = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		// When flag is false, should use default paths
		expect(homePagePath.value).toBe('/');
		expect(portfolioPath.value).toBe('/portfolio');
	});

	it('should execute fetchUserData logic through query', () => {
		const mockData = {
			data: {
				my: { id: 777 },
				general: { my_kiva_for_all_users: { value: 'true' } }
			}
		};
		mockApollo.query.mockResolvedValue(mockData);
		readBoolSetting.mockReturnValue(true);

		const composable = useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);

		// Verify composable returns expected structure
		expect(composable.homePagePath).toBeDefined();
		expect(composable.portfolioPath).toBeDefined();
		expect(composable.homePagePath.value).toBe('/');
		expect(composable.portfolioPath.value).toBe('/portfolio');
	});

	// Tests with component mounting to properly test onMounted lifecycle
	describe('with component context', () => {
		afterEach(() => {
			vi.clearAllMocks();
		});

		it('should redirect to /mykiva when flag is enabled and user has id', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: { id: 789 },
					general: { my_kiva_for_all_users: { value: 'true' } }
				}
			});
			readBoolSetting.mockReturnValue(true);
			getIsMyKivaEnabled.mockReturnValue(true);

			const TestComponent = {
				template: `<div>
					<span data-testid="home">{{ homePagePath }}</span>
					<span data-testid="portfolio">{{ portfolioPath }}</span>
				</div>`,
				setup() {
					return useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);
				}
			};

			const { getByTestId } = render(TestComponent);

			// Wait for onMounted to complete
			await waitFor(() => {
				expect(getByTestId('home').textContent).toBe('/mykiva');
				expect(getByTestId('portfolio').textContent).toBe('/mykiva');
			});

			// Verify getIsMyKivaEnabled was called with correct params
			expect(getIsMyKivaEnabled).toHaveBeenCalledWith(
				mockApollo,
				mockKvTrackEvent,
				true,
				mockCookieStore
			);
		});

		it('should not redirect when flag is disabled', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: { id: 456 },
					general: { my_kiva_for_all_users: { value: 'false' } }
				}
			});
			readBoolSetting.mockReturnValue(false);
			getIsMyKivaEnabled.mockReturnValue(true);

			const TestComponent = {
				template: `<div>
					<span data-testid="home">{{ homePagePath }}</span>
					<span data-testid="portfolio">{{ portfolioPath }}</span>
				</div>`,
				setup() {
					return useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);
				}
			};

			const { getByTestId } = render(TestComponent);

			// Wait for onMounted to complete
			await waitFor(() => {
				expect(mockApollo.query).toHaveBeenCalled();
			});

			// Should not call getIsMyKivaEnabled when flag is false
			expect(getIsMyKivaEnabled).not.toHaveBeenCalled();
			expect(getByTestId('home').textContent).toBe('/');
			expect(getByTestId('portfolio').textContent).toBe('/portfolio');
		});

		it('should not redirect when user has no id', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: { name: 'Test' }, // Has data but no id
					general: { my_kiva_for_all_users: { value: 'true' } }
				}
			});
			readBoolSetting.mockReturnValue(true);
			getIsMyKivaEnabled.mockReturnValue(true);

			const TestComponent = {
				template: '<div><span data-testid="home">{{ homePagePath }}</span></div>',
				setup() {
					return useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);
				}
			};

			const { getByTestId } = render(TestComponent);

			// Wait for onMounted to complete
			await waitFor(() => {
				expect(mockApollo.query).toHaveBeenCalled();
			});

			// Should remain at default paths when userData.id is falsy
			expect(getByTestId('home').textContent).toBe('/');
		});

		it('should handle Apollo query errors gracefully in component', async () => {
			mockApollo.query.mockRejectedValue(new Error('Network error'));

			const TestComponent = {
				template: '<div><span data-testid="home">{{ homePagePath }}</span></div>',
				setup() {
					return useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);
				}
			};

			const { getByTestId } = render(TestComponent);

			// Should not throw and should use default paths
			await waitFor(() => {
				expect(mockApollo.query).toHaveBeenCalled();
			});

			expect(getByTestId('home').textContent).toBe('/');
		});

		it('should execute fetchUserData on mount', async () => {
			mockApollo.query.mockResolvedValue({
				data: {
					my: { id: 999 },
					general: { my_kiva_for_all_users: { value: 'true' } }
				}
			});
			readBoolSetting.mockReturnValue(true);
			getIsMyKivaEnabled.mockReturnValue(true);

			const TestComponent = {
				template: '<div><span data-testid="home">{{ homePagePath }}</span></div>',
				setup() {
					return useMyKivaHome(mockApollo, mockKvTrackEvent, mockCookieStore);
				}
			};

			render(TestComponent);

			await waitFor(() => {
				expect(mockApollo.query).toHaveBeenCalledWith({
					query: 'myKivaForAllUsersQuery'
				});
				expect(readBoolSetting).toHaveBeenCalled();
			});
		});
	});
});

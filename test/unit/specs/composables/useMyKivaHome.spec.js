import useMyKivaHome from '#src/composables/useMyKivaHome';
import { render, waitFor } from '@testing-library/vue';

// Mock the dependencies
vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn()
}));

vi.mock('#src/graphql/query/userId.graphql', () => ({
	default: 'userIdQuery'
}));

describe('useMyKivaHome.js', () => {
	let mockApollo;

	beforeEach(() => {
		mockApollo = {
			query: vi.fn()
		};
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should return homePagePath and portfolioPath computed properties', () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 123 }
			}
		});

		const composable = useMyKivaHome(mockApollo);

		expect(composable.homePagePath).toBeDefined();
		expect(composable.portfolioPath).toBeDefined();
	});

	it('should default homePagePath to "/" when redirectToMyKivaHomepage is false', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: null
			}
		});

		const TestComponent = {
			template: '<div><span data-testid="home">{{ homePagePath }}</span></div>',
			setup() {
				return useMyKivaHome(mockApollo);
			}
		};

		const { getByTestId } = render(TestComponent);

		await waitFor(() => {
			expect(getByTestId('home').textContent).toBe('/');
		});
	});

	it('should default portfolioPath to "/portfolio" when redirectToMyKivaHomepage is false', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: null
			}
		});

		const TestComponent = {
			template: '<div><span data-testid="portfolio">{{ portfolioPath }}</span></div>',
			setup() {
				return useMyKivaHome(mockApollo);
			}
		};

		const { getByTestId } = render(TestComponent);

		await waitFor(() => {
			expect(getByTestId('portfolio').textContent).toBe('/portfolio');
		});
	});

	it('should set homePagePath to "/mykiva" when user has an id', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 456 }
			}
		});

		const TestComponent = {
			template: '<div><span data-testid="home">{{ homePagePath }}</span></div>',
			setup() {
				return useMyKivaHome(mockApollo);
			}
		};

		const { getByTestId } = render(TestComponent);

		await waitFor(() => {
			expect(getByTestId('home').textContent).toBe('/mykiva');
		});
	});

	it('should set portfolioPath to "/mykiva" when user has an id', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 456 }
			}
		});

		const TestComponent = {
			template: '<div><span data-testid="portfolio">{{ portfolioPath }}</span></div>',
			setup() {
				return useMyKivaHome(mockApollo);
			}
		};

		const { getByTestId } = render(TestComponent);

		await waitFor(() => {
			expect(getByTestId('portfolio').textContent).toBe('/mykiva');
		});
	});

	it('should call apollo.query with userIdQuery on mount', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 789 }
			}
		});

		const TestComponent = {
			template: '<div></div>',
			setup() {
				return useMyKivaHome(mockApollo);
			}
		};

		render(TestComponent);

		await waitFor(() => {
			expect(mockApollo.query).toHaveBeenCalledWith({
				query: 'userIdQuery'
			});
		});
	});

	it('should handle query errors gracefully', async () => {
		mockApollo.query.mockRejectedValue(new Error('Network error'));

		const TestComponent = {
			template: '<div><span data-testid="home">{{ homePagePath }}</span></div>',
			setup() {
				return useMyKivaHome(mockApollo);
			}
		};

		const { getByTestId } = render(TestComponent);

		await waitFor(() => {
			expect(mockApollo.query).toHaveBeenCalled();
		});

		// Should default to '/' on error
		expect(getByTestId('home').textContent).toBe('/');
	});

	it('should handle missing user data (my is null)', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: null
			}
		});

		const TestComponent = {
			template: '<div><span data-testid="home">{{ homePagePath }}</span></div>',
			setup() {
				return useMyKivaHome(mockApollo);
			}
		};

		const { getByTestId } = render(TestComponent);

		await waitFor(() => {
			expect(getByTestId('home').textContent).toBe('/');
		});
	});

	it('should handle user data without id field', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { name: 'Test User' }
			}
		});

		const TestComponent = {
			template: '<div><span data-testid="home">{{ homePagePath }}</span></div>',
			setup() {
				return useMyKivaHome(mockApollo);
			}
		};

		const { getByTestId } = render(TestComponent);

		await waitFor(() => {
			expect(getByTestId('home').textContent).toBe('/');
		});
	});

	it('should handle query response with undefined data', async () => {
		mockApollo.query.mockResolvedValue({
			data: undefined
		});

		const TestComponent = {
			template: '<div><span data-testid="home">{{ homePagePath }}</span></div>',
			setup() {
				return useMyKivaHome(mockApollo);
			}
		};

		const { getByTestId } = render(TestComponent);

		await waitFor(() => {
			expect(getByTestId('home').textContent).toBe('/');
		});
	});

	it('should have reactive computed properties', async () => {
		mockApollo.query.mockResolvedValue({
			data: {
				my: { id: 999 }
			}
		});

		const { homePagePath, portfolioPath } = useMyKivaHome(mockApollo);

		// Before mount completes, should be false
		expect(homePagePath.value).toBe('/');
		expect(portfolioPath.value).toBe('/portfolio');
	});
});

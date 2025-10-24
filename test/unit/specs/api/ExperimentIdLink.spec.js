import { setContext } from '@apollo/client/link/context/index';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import createExperimentIdLink from '#src/api/ExperimentIdLink';

vi.mock('@apollo/client/link/context/index');

describe('ExperimentIdLink', () => {
	let mockCookieStore;
	let mockSetContextHandler;
	let mockPreviousContext;
	let mockOperation;

	beforeEach(() => {
		mockSetContextHandler = null;
		setContext.mockImplementation(handler => {
			mockSetContextHandler = handler;
			return 'mockContextLink';
		});

		mockCookieStore = {
			get: vi.fn(),
		};

		mockPreviousContext = {
			headers: {
				'Content-Type': 'application/json',
			},
			cache: {
				readFragment: vi.fn(),
			},
		};

		mockOperation = {
			operationName: 'TestQuery',
		};
	});

	describe('Link creation', () => {
		it('should create a context link using setContext', () => {
			const link = createExperimentIdLink({ cookieStore: mockCookieStore });
			expect(setContext).toHaveBeenCalledWith(expect.any(Function));
			expect(link).toBe('mockContextLink');
		});
	});

	describe('Context handler', () => {
		it('should return previous context when cookieStore is not provided', () => {
			createExperimentIdLink({ cookieStore: null });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);
			expect(result).toBe(mockPreviousContext);
		});

		it('should initialize new context with headers object when headers are undefined', () => {
			const contextWithoutHeaders = { cache: mockPreviousContext.cache };
			createExperimentIdLink({ cookieStore: mockCookieStore });
			const result = mockSetContextHandler(mockOperation, contextWithoutHeaders);
			expect(result.headers).toEqual({});
		});

		it('should preserve existing headers', () => {
			createExperimentIdLink({ cookieStore: mockCookieStore });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);
			expect(result.headers['Content-Type']).toBe('application/json');
		});
	});

	describe('Experiment header building', () => {
		it('should add X-Experiments header with experiment assignments', () => {
			mockPreviousContext.cache.readFragment
				.mockReturnValueOnce({ version: 'v1' })
				.mockReturnValueOnce({ version: 'v2' });

			createExperimentIdLink({ cookieStore: mockCookieStore });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			const expected = 'EXP-ML-Service-Bandit-LendByCategory;v1,EXP-FLSS-Ongoing-Sitewide-3;v2';
			expect(result.headers['X-Experiments']).toBe(expected);
		});

		it('should read experiment fragments from cache for target IDs', () => {
			mockPreviousContext.cache.readFragment
				.mockReturnValueOnce({ version: 'v1' })
				.mockReturnValueOnce({ version: 'v2' });

			createExperimentIdLink({ cookieStore: mockCookieStore });
			mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(mockPreviousContext.cache.readFragment).toHaveBeenCalledWith({
				id: 'Experiment:EXP-ML-Service-Bandit-LendByCategory',
				fragment: experimentVersionFragment,
			});
			expect(mockPreviousContext.cache.readFragment).toHaveBeenCalledWith({
				id: 'Experiment:EXP-FLSS-Ongoing-Sitewide-3',
				fragment: experimentVersionFragment,
			});
		});

		it('should skip experiments without version', () => {
			mockPreviousContext.cache.readFragment
				.mockReturnValueOnce({ version: 'v1' })
				.mockReturnValueOnce({});

			createExperimentIdLink({ cookieStore: mockCookieStore });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result.headers['X-Experiments']).toBe('EXP-ML-Service-Bandit-LendByCategory;v1');
		});

		it('should handle null experiment data from cache', () => {
			mockPreviousContext.cache.readFragment
				.mockReturnValueOnce(null)
				.mockReturnValueOnce({ version: 'v2' });

			createExperimentIdLink({ cookieStore: mockCookieStore });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result.headers['X-Experiments']).toBe('EXP-FLSS-Ongoing-Sitewide-3;v2');
		});

		it('should not add X-Experiments header when no experiments have versions', () => {
			mockPreviousContext.cache.readFragment
				.mockReturnValueOnce({})
				.mockReturnValueOnce({});

			createExperimentIdLink({ cookieStore: mockCookieStore });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			expect(result.headers['X-Experiments']).toBeUndefined();
		});

		it('should handle undefined cache', () => {
			const contextWithoutCache = {
				headers: { 'Content-Type': 'application/json' },
			};

			createExperimentIdLink({ cookieStore: mockCookieStore });
			const result = mockSetContextHandler(mockOperation, contextWithoutCache);

			expect(result.headers['X-Experiments']).toBeUndefined();
		});

		it('should handle multiple experiments with mixed versions', () => {
			mockPreviousContext.cache.readFragment
				.mockReturnValueOnce({ version: 'control' })
				.mockReturnValueOnce({ version: 'variant-a' });

			createExperimentIdLink({ cookieStore: mockCookieStore });
			const result = mockSetContextHandler(mockOperation, mockPreviousContext);

			const expected = 'EXP-ML-Service-Bandit-LendByCategory;control,EXP-FLSS-Ongoing-Sitewide-3;variant-a';
			expect(result.headers['X-Experiments']).toBe(expected);
		});
	});
});

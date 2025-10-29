import createBasketLink from '../../../../src/api/BasketLink';

vi.mock('@apollo/client/core/index', () => ({
	ApolloLink: vi.fn(handler => ({ handler, request: handler }))
}));

describe('BasketLink.js', () => {
	let mockCookieStore;
	let mockOperation;
	let mockForward;

	beforeEach(() => {
		mockCookieStore = {
			get: vi.fn()
		};

		mockOperation = {
			variables: {}
		};

		mockForward = vi.fn(op => op);

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should create an ApolloLink', () => {
		const link = createBasketLink({ cookieStore: mockCookieStore });

		expect(link).toBeDefined();
		expect(link.handler).toBeDefined();
	});

	it('should add basketId to operation variables when cookie exists', () => {
		mockCookieStore.get.mockReturnValue('basket-123');
		const link = createBasketLink({ cookieStore: mockCookieStore });

		link.request(mockOperation, mockForward);

		expect(mockCookieStore.get).toHaveBeenCalledWith('kvbskt');
		expect(mockOperation.variables.basketId).toBe('basket-123');
		expect(mockForward).toHaveBeenCalledWith(mockOperation);
	});

	it('should not add basketId when cookie does not exist', () => {
		mockCookieStore.get.mockReturnValue(null);
		const link = createBasketLink({ cookieStore: mockCookieStore });

		link.request(mockOperation, mockForward);

		expect(mockOperation.variables.basketId).toBeUndefined();
		expect(mockForward).toHaveBeenCalledWith(mockOperation);
	});

	it('should not override existing basketId in variables', () => {
		mockOperation.variables.basketId = 'existing-basket';
		mockCookieStore.get.mockReturnValue('basket-123');
		const link = createBasketLink({ cookieStore: mockCookieStore });

		link.request(mockOperation, mockForward);

		expect(mockOperation.variables.basketId).toBe('existing-basket');
		expect(mockForward).toHaveBeenCalledWith(mockOperation);
	});

	it('should forward operation when cookieStore is not provided', () => {
		const link = createBasketLink({});

		const result = link.request(mockOperation, mockForward);

		expect(result).toBe(mockOperation);
		expect(mockForward).toHaveBeenCalledWith(mockOperation);
	});
});

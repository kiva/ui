import setBasketCookie from '#src/util/basketCookie';
import { createNewBasket, hasBasketExpired } from '#src/util/basketUtils';

vi.mock('#src/util/basketUtils', () => ({
	createNewBasket: vi.fn(),
	hasBasketExpired: vi.fn().mockReturnValue(true),
}));

describe('setBasketCookie', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('creates a new basket if kvbskt cookie is missing', async () => {
		const cookieStore = { get: vi.fn().mockReturnValue(undefined) };
		const apollo = {};

		await setBasketCookie(cookieStore, apollo);

		expect(createNewBasket).toHaveBeenCalledWith({ apollo, cookieStore });
	});

	it('creates a new basket if basket has expired', async () => {
		const cookieStore = { get: vi.fn().mockReturnValue('basket123') };
		const apollo = {
			query: vi.fn().mockResolvedValue({
				errors: [
					{ extensions: { code: 'shop.invalidBasketId' } },
				],
			}),
		};

		await setBasketCookie(cookieStore, apollo);

		expect(hasBasketExpired).toHaveBeenCalledWith('shop.invalidBasketId');
		expect(createNewBasket).toHaveBeenCalledWith({ apollo, cookieStore });
	});

	it('does not create a new basket if basket is valid', async () => {
		const cookieStore = { get: vi.fn().mockReturnValue('basket123') };
		const apollo = {
			query: vi.fn().mockResolvedValue({ data: { shop: { basket: { id: 'basket123' } } } }),
		};

		await setBasketCookie(cookieStore, apollo);

		expect(hasBasketExpired).not.toHaveBeenCalled();
		expect(createNewBasket).not.toHaveBeenCalled();
	});

	it('checks error code when extensions is not available', async () => {
		const cookieStore = { get: vi.fn().mockReturnValue('basket123') };
		const apollo = {
			query: vi.fn().mockResolvedValue({
				errors: [
					{ code: 'shop.basketRequired' },
				],
			}),
		};

		await setBasketCookie(cookieStore, apollo);

		expect(hasBasketExpired).toHaveBeenCalledWith('shop.basketRequired');
		expect(createNewBasket).toHaveBeenCalledWith({ apollo, cookieStore });
	});

	it('handles null basket cookie value', async () => {
		const cookieStore = { get: vi.fn().mockReturnValue(null) };
		const apollo = {};

		await setBasketCookie(cookieStore, apollo);

		expect(createNewBasket).toHaveBeenCalledWith({ apollo, cookieStore });
	});

	it('handles empty string basket cookie value', async () => {
		const cookieStore = { get: vi.fn().mockReturnValue('') };
		const apollo = {};

		await setBasketCookie(cookieStore, apollo);

		expect(createNewBasket).toHaveBeenCalledWith({ apollo, cookieStore });
	});

	it('does not create new basket if error exists but is not expired', async () => {
		hasBasketExpired.mockReturnValue(false);

		const cookieStore = { get: vi.fn().mockReturnValue('basket123') };
		const apollo = {
			query: vi.fn().mockResolvedValue({
				errors: [
					{ extensions: { code: 'shop.someOtherError' } },
				],
			}),
		};

		await setBasketCookie(cookieStore, apollo);

		expect(hasBasketExpired).toHaveBeenCalledWith('shop.someOtherError');
		expect(createNewBasket).not.toHaveBeenCalled();
	});

	it('handles multiple errors and checks if any indicate expiration', async () => {
		hasBasketExpired.mockImplementation(code => code === 'shop.invalidBasketId');

		const cookieStore = { get: vi.fn().mockReturnValue('basket123') };
		const apollo = {
			query: vi.fn().mockResolvedValue({
				errors: [
					{ extensions: { code: 'shop.someError' } },
					{ extensions: { code: 'shop.invalidBasketId' } },
				],
			}),
		};

		await setBasketCookie(cookieStore, apollo);

		expect(createNewBasket).toHaveBeenCalledWith({ apollo, cookieStore });
	});

	it('handles undefined errors array', async () => {
		const cookieStore = { get: vi.fn().mockReturnValue('basket123') };
		const apollo = {
			query: vi.fn().mockResolvedValue({}),
		};

		await setBasketCookie(cookieStore, apollo);

		expect(createNewBasket).not.toHaveBeenCalled();
	});

	it('handles null errors array', async () => {
		const cookieStore = { get: vi.fn().mockReturnValue('basket123') };
		const apollo = {
			query: vi.fn().mockResolvedValue({ errors: null }),
		};

		await setBasketCookie(cookieStore, apollo);

		expect(createNewBasket).not.toHaveBeenCalled();
	});

	it('calls apollo.query with correct variables', async () => {
		const basketId = 'test-basket-456';
		const cookieStore = { get: vi.fn().mockReturnValue(basketId) };
		const apollo = {
			query: vi.fn().mockResolvedValue({ data: {} }),
		};

		await setBasketCookie(cookieStore, apollo);

		expect(apollo.query).toHaveBeenCalledWith({
			query: expect.any(Object),
			variables: { basketId },
		});
	});
});

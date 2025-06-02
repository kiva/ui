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
});

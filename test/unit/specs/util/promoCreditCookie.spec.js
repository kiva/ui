import {
	BANNER_COOKIE_NAME,
	setPromoCreditBannerCookie,
	clearPromoCreditBannerCookie,
	getPromoCreditBannerCookie,
} from '#src/util/promoCreditCookie';

describe('promoCreditCookie util', () => {
	it('sets the promo credit banner cookie with correct name, value, and path', () => {
		const cookieStore = {
			set: vi.fn(),
		};

		setPromoCreditBannerCookie(cookieStore);

		expect(cookieStore.set).toHaveBeenCalledWith(
			BANNER_COOKIE_NAME,
			'true',
			{ path: '/' }
		);
	});

	it('clears the promo credit banner cookie with correct name and path', () => {
		const cookieStore = {
			remove: vi.fn(),
		};

		clearPromoCreditBannerCookie(cookieStore);

		expect(cookieStore.remove).toHaveBeenCalledWith(
			BANNER_COOKIE_NAME,
			{ path: '/' }
		);
	});

	it('gets the promo credit banner cookie with correct name', () => {
		const cookieStore = {
			get: vi.fn().mockReturnValue('true'),
		};

		const result = getPromoCreditBannerCookie(cookieStore);

		expect(cookieStore.get).toHaveBeenCalledWith(BANNER_COOKIE_NAME);
		expect(result).toBe('true');
	});
});

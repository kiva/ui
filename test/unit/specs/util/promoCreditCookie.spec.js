import {
	BANNER_COOKIE_NAME,
	KIVA_LENDING_CREDIT_COOKIE_NAME,
	setPromoCreditBannerCookie,
	clearPromoCreditBannerCookie,
	getPromoCreditBannerCookie,
	getKivaLendingCreditCookie,
	clearKivaLendingCreditCookie,
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

	it('clears the kiva lending credit cookie with correct name and path', () => {
		const cookieStore = {
			remove: vi.fn(),
		};

		clearKivaLendingCreditCookie(cookieStore);

		expect(cookieStore.remove).toHaveBeenCalledWith(
			KIVA_LENDING_CREDIT_COOKIE_NAME,
			{ path: '/' }
		);
	});

	describe('getKivaLendingCreditCookie', () => {
		it('parses URL-encoded JSON cookie from monolith', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue('%7B%22amount%22%3A25%2C%22campaign_id%22%3Anull%7D'),
			};

			const result = getKivaLendingCreditCookie(cookieStore);

			expect(cookieStore.get).toHaveBeenCalledWith(KIVA_LENDING_CREDIT_COOKIE_NAME);
			expect(result).toBe(25);
		});

		it('parses plain JSON cookie', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue('{"amount":50,"campaign_id":null}'),
			};

			const result = getKivaLendingCreditCookie(cookieStore);

			expect(result).toBe(50);
		});

		it('parses plain number for backwards compatibility', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue('25'),
			};

			const result = getKivaLendingCreditCookie(cookieStore);

			expect(result).toBe(25);
		});

		it('returns 0 when cookie value is invalid', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue('invalid'),
			};

			const result = getKivaLendingCreditCookie(cookieStore);

			expect(result).toBe(0);
		});

		it('returns 0 when cookie value is undefined', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue(undefined),
			};

			const result = getKivaLendingCreditCookie(cookieStore);

			expect(result).toBe(0);
		});

		it('returns 0 when cookie value is negative', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue('-10'),
			};

			const result = getKivaLendingCreditCookie(cookieStore);

			expect(result).toBe(0);
		});

		it('returns 0 when cookie value is zero', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue('0'),
			};

			const result = getKivaLendingCreditCookie(cookieStore);

			expect(result).toBe(0);
		});

		it('parses decimal values correctly', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue('15.50'),
			};

			const result = getKivaLendingCreditCookie(cookieStore);

			expect(result).toBe(15.50);
		});

		it('returns 0 when cookie value is empty string', () => {
			const cookieStore = {
				get: vi.fn().mockReturnValue(''),
			};

			const result = getKivaLendingCreditCookie(cookieStore);

			expect(result).toBe(0);
		});
	});
});

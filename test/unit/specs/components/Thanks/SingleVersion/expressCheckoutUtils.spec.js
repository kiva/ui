import {
	clearBasketDonation,
	clearLendAfterGoalSetAttribution,
	filterOutDonations,
	hasLendAfterGoalSetAttribution,
	isLendAfterGoalSetOrder,
	hasOnlyOneDonation,
	isBasketEmpty,
	LEND_AFTER_GOAL_SET_COOKIE,
	setLendAfterGoalSetAttribution,
	shouldReopenExpressCheckout,
} from '#src/util/thanksPage/expressCheckoutUtils';

const donation = (overrides = {}) => ({
	id: overrides.id ?? 'donation-1',
	__typename: 'Donation',
	isTip: true,
	...overrides,
});

const loan = (overrides = {}) => ({
	id: overrides.id ?? 'loan-1',
	__typename: 'LoanReservation',
	...overrides,
});

describe('expressCheckoutUtils.js', () => {
	describe('isBasketEmpty', () => {
		it('returns true for an empty array', () => {
			expect(isBasketEmpty([])).toBe(true);
		});

		it('returns true when no argument is given', () => {
			expect(isBasketEmpty()).toBe(true);
		});

		it('returns true when items is null/undefined', () => {
			expect(isBasketEmpty(null)).toBe(true);
			expect(isBasketEmpty(undefined)).toBe(true);
		});

		it('returns false when the basket has at least one item', () => {
			expect(isBasketEmpty([loan()])).toBe(false);
			expect(isBasketEmpty([donation(), loan()])).toBe(false);
		});
	});

	describe('hasOnlyOneDonation', () => {
		it('returns true for a single donation item', () => {
			expect(hasOnlyOneDonation([donation()])).toBe(true);
		});

		it('returns false for an empty basket', () => {
			expect(hasOnlyOneDonation([])).toBe(false);
		});

		it('returns false when the single item is not a donation', () => {
			expect(hasOnlyOneDonation([loan()])).toBe(false);
		});

		it('returns false when the basket has more than one item, even if all are donations', () => {
			expect(hasOnlyOneDonation([donation({ id: 'd-1' }), donation({ id: 'd-2' })])).toBe(false);
		});

		it('returns false when a donation coexists with another item type', () => {
			expect(hasOnlyOneDonation([donation(), loan()])).toBe(false);
		});
	});

	describe('filterOutDonations', () => {
		it('returns an empty array when input is empty/missing', () => {
			expect(filterOutDonations([])).toEqual([]);
			expect(filterOutDonations()).toEqual([]);
			expect(filterOutDonations(null)).toEqual([]);
		});

		it('removes donations and keeps non-donation items', () => {
			const items = [donation({ id: 'd-1' }), loan({ id: 'l-1' }), donation({ id: 'd-2' })];
			expect(filterOutDonations(items)).toEqual([loan({ id: 'l-1' })]);
		});

		it('returns the original list when there are no donations', () => {
			const items = [loan({ id: 'l-1' }), loan({ id: 'l-2' })];
			expect(filterOutDonations(items)).toEqual(items);
		});

		it('does not mutate the input array', () => {
			const items = [donation(), loan()];
			const before = [...items];
			filterOutDonations(items);
			expect(items).toEqual(before);
		});
	});

	describe('clearBasketDonation', () => {
		it('calls apollo.mutate with price 0.00 and the donation isTip flag', async () => {
			const apollo = { mutate: vi.fn().mockResolvedValue({ data: {} }) };
			const tip = donation({ isTip: true });

			await clearBasketDonation({ apollo, basketId: 'basket-1', donation: tip });

			expect(apollo.mutate).toHaveBeenCalledTimes(1);
			const args = apollo.mutate.mock.calls[0][0];
			expect(args.variables).toEqual({
				price: '0.00',
				isTip: true,
				basketId: 'basket-1',
			});
			expect(args.mutation).toBeDefined();
		});

		it('forwards isTip=false when the donation is not a tip', async () => {
			const apollo = { mutate: vi.fn().mockResolvedValue({ data: {} }) };
			const nonTip = donation({ isTip: false });

			await clearBasketDonation({ apollo, basketId: 'basket-2', donation: nonTip });

			expect(apollo.mutate.mock.calls[0][0].variables.isTip).toBe(false);
		});

		it('defaults isTip to true when the donation does not declare it', async () => {
			const apollo = { mutate: vi.fn().mockResolvedValue({ data: {} }) };

			await clearBasketDonation({ apollo, basketId: 'basket-3', donation: {} });

			expect(apollo.mutate.mock.calls[0][0].variables.isTip).toBe(true);
		});

		it('throws when the mutation returns GraphQL errors', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({ errors: [{ message: 'Server boom' }] }),
			};

			await expect(
				clearBasketDonation({ apollo, basketId: 'basket-1', donation: donation() }),
			).rejects.toThrow('Server boom');
		});

		it('throws a generic message when GraphQL errors have no message', async () => {
			const apollo = {
				mutate: vi.fn().mockResolvedValue({ errors: [{}] }),
			};

			await expect(
				clearBasketDonation({ apollo, basketId: 'basket-1', donation: donation() }),
			).rejects.toThrow('Failed to clear donation');
		});

		it('propagates rejections from apollo.mutate', async () => {
			const apollo = { mutate: vi.fn().mockRejectedValue(new Error('network down')) };

			await expect(
				clearBasketDonation({ apollo, basketId: 'basket-1', donation: donation() }),
			).rejects.toThrow('network down');
		});
	});

	describe('shouldReopenExpressCheckout', () => {
		it('returns true when recommendLoanIsInBasket is set and one non-donation item remains', () => {
			const items = [loan()];
			const payload = { recommendLoanIsInBasket: true };
			expect(shouldReopenExpressCheckout(items, payload)).toBe(true);
		});

		it('returns true when a donation coexists with the recommended loan after filtering', () => {
			const items = [donation(), loan()];
			const payload = { recommendLoanIsInBasket: true };
			expect(shouldReopenExpressCheckout(items, payload)).toBe(true);
		});

		it('returns false when recommendLoanIsInBasket is missing/false', () => {
			expect(shouldReopenExpressCheckout([loan()], {})).toBe(false);
			expect(shouldReopenExpressCheckout([loan()], { recommendLoanIsInBasket: false })).toBe(false);
		});

		it('returns false when more than one non-donation item remains', () => {
			const items = [loan({ id: 'l-1' }), loan({ id: 'l-2' })];
			const payload = { recommendLoanIsInBasket: true };
			expect(shouldReopenExpressCheckout(items, payload)).toBe(false);
		});

		it('returns false when only donations remain after filtering', () => {
			const items = [donation()];
			const payload = { recommendLoanIsInBasket: true };
			expect(shouldReopenExpressCheckout(items, payload)).toBe(false);
		});

		it('handles missing/empty inputs without throwing', () => {
			expect(shouldReopenExpressCheckout()).toBe(false);
			expect(shouldReopenExpressCheckout([], {})).toBe(false);
			expect(shouldReopenExpressCheckout(null, null)).toBe(false);
		});
	});

	describe('lend-after-goal-set attribution', () => {
		const mockCookieStore = (value = undefined) => ({
			get: vi.fn(() => value),
			set: vi.fn(),
			remove: vi.fn(),
		});

		// Fixed clock so the hour the cookie expires after can be asserted exactly.
		const NOW = new Date('2026-09-15T10:00:00.000Z');
		const ONE_HOUR_LATER = new Date('2026-09-15T11:00:00.000Z');

		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(NOW);
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('records the order it was marked from, for an hour', () => {
			const cookieStore = mockCookieStore();

			setLendAfterGoalSetAttribution(cookieStore, '12345');

			expect(cookieStore.set).toHaveBeenCalledWith(
				LEND_AFTER_GOAL_SET_COOKIE,
				'12345',
				{ path: '/', expires: ONE_HOUR_LATER },
			);
		});

		it('records a placeholder when the originating order is unknown', () => {
			const cookieStore = mockCookieStore();

			setLendAfterGoalSetAttribution(cookieStore);

			expect(cookieStore.set).toHaveBeenCalledWith(
				LEND_AFTER_GOAL_SET_COOKIE,
				'none',
				{ path: '/', expires: ONE_HOUR_LATER },
			);
		});

		// An empty value would read as no cookie at all and silence the checkout event.
		it('still reports the attribution when the originating order is unknown', () => {
			const jar = {};
			const cookieStore = {
				get: vi.fn(name => jar[name]),
				set: vi.fn((name, value) => { jar[name] = value; }),
				remove: vi.fn(),
			};

			setLendAfterGoalSetAttribution(cookieStore);

			expect(hasLendAfterGoalSetAttribution(cookieStore)).toBe(true);
		});

		it('reports the attribution only while the cookie is present', () => {
			expect(hasLendAfterGoalSetAttribution(mockCookieStore('12345'))).toBe(true);
			expect(hasLendAfterGoalSetAttribution(mockCookieStore())).toBe(false);
		});

		// Back returns the lender to the thanks page of the order the marker started at,
		// which must not count as the order the flow produced.
		it.each([
			['12345', '67890', true],
			['12345', '12345', false],
			['12345', 12345, false],
			['12345', undefined, true],
			['none', '67890', true],
			['none', undefined, false],
			[undefined, '67890', false],
		])('credits cookie %s against order %s: %s', (cookieValue, transactionId, expected) => {
			expect(isLendAfterGoalSetOrder(mockCookieStore(cookieValue), transactionId)).toBe(expected);
		});

		it('clears the cookie', () => {
			const cookieStore = mockCookieStore('12345');
			clearLendAfterGoalSetAttribution(cookieStore);
			expect(cookieStore.remove).toHaveBeenCalledWith(LEND_AFTER_GOAL_SET_COOKIE, { path: '/' });
		});

		it('handles a missing cookie store without throwing', () => {
			expect(() => setLendAfterGoalSetAttribution()).not.toThrow();
			expect(() => clearLendAfterGoalSetAttribution()).not.toThrow();
			expect(hasLendAfterGoalSetAttribution()).toBe(false);
			expect(isLendAfterGoalSetOrder(undefined, '67890')).toBe(false);
		});
	});
});

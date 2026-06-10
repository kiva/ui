import {
	clearBasketDonation,
	filterOutDonations,
	hasOnlyOneDonation,
	isBasketEmpty,
	shouldReopenExpressCheckout,
} from '#src/util/thanksPage/thanksPageUtils';

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

describe('thanksPageUtils.js', () => {
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
});

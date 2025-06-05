import { basketCountData } from '#src/esiTags/globalData/basketCount';

describe('basketCountData', () => {
	it('returns correct CSS vars for normal basket', () => {
		const data = {
			shop: {
				nonTrivialItemCount: 3,
				basket: {
					totals: { itemTotal: 25 }
				}
			}
		};
		const cookieStore = { get: vi.fn().mockReturnValue(undefined) };
		const result = basketCountData(data, cookieStore);
		expect(result['basket-count']).toBe('"3"');
		expect(result['basket-number']).toBe('"3"');
		expect(result['corporate-basket-count']).toBe('"3"');
		expect(result).not.toHaveProperty('basket-count-display');
		expect(result).not.toHaveProperty('corporate-basket-count-display');
	});

	it('formats basket-number as currency if itemTotal > 500', () => {
		const data = {
			shop: {
				nonTrivialItemCount: 2,
				basket: {
					totals: { itemTotal: 1000 }
				}
			}
		};
		const cookieStore = { get: vi.fn().mockReturnValue(undefined) };
		const result = basketCountData(data, cookieStore);
		expect(result['basket-number']).toBe('"$1,000"');
	});

	it('sets display to none if basketCount is 0', () => {
		const data = {
			shop: {
				nonTrivialItemCount: 0,
				basket: {
					totals: { itemTotal: 0 }
				}
			}
		};
		const cookieStore = { get: vi.fn().mockReturnValue(undefined) };
		const result = basketCountData(data, cookieStore);
		expect(result['basket-count-display']).toBe('none');
		expect(result['corporate-basket-count']).toBe('"0"');
	});

	it('handles missing data gracefully', () => {
		const cookieStore = { get: vi.fn().mockReturnValue(undefined) };
		const result = basketCountData({}, cookieStore);
		expect(result['basket-count']).toBe('"0"');
		expect(result['basket-number']).toBe('"0"');
		expect(result['corporate-basket-count']).toBe('"0"');
		expect(result['basket-count-display']).toBe('none');
		expect(result['corporate-basket-count-display']).toBe('none');
	});

	it('subtracts lcaLoanCount from corporate-basket-count if lcaid cookie is present', () => {
		const data = {
			shop: {
				nonTrivialItemCount: 2,
				basket: {
					totals: { itemTotal: 25 }
				}
			}
		};
		const cookieStore = { get: vi.fn().mockReturnValue('some-lcaid') };
		const result = basketCountData(data, cookieStore);
		expect(result['corporate-basket-count']).toBe('"1"');
	});

	it('sets corporate-basket-count-display to none if corporate-basket-count is 0', () => {
		const data = {
			shop: {
				nonTrivialItemCount: 1,
				basket: {
					totals: { itemTotal: 25 }
				}
			}
		};
		const cookieStore = { get: vi.fn().mockReturnValue('some-lcaid') };
		const result = basketCountData(data, cookieStore);
		expect(result['corporate-basket-count']).toBe('"0"');
		expect(result['corporate-basket-count-display']).toBe('none');
	});
});

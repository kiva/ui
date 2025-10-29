import { basketCountData } from '../../../../../src/esiTags/globalData/basketCount';

describe('basketCountData', () => {
	it('returns correct CSS vars for normal basket', () => {
		const data = {
			shop: {
				nonTrivialItemCount: 3,
			}
		};
		const cookieStore = { get: vi.fn().mockReturnValue(undefined) };
		const result = basketCountData(data, cookieStore);
		expect(result).not.toHaveProperty('basket-count-display');
		expect(result).not.toHaveProperty('corporate-basket-count-display');
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
		expect(result['corporate-basket-count-display']).toBe('none');
	});

	it('handles missing data gracefully', () => {
		const cookieStore = { get: vi.fn().mockReturnValue(undefined) };
		const result = basketCountData({}, cookieStore);
		expect(result['basket-count-display']).toBe('none');
		expect(result['corporate-basket-count-display']).toBe('none');
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
		expect(result).not.toHaveProperty('basket-count-display');
		expect(result['corporate-basket-count-display']).toBe('none');
	});
});

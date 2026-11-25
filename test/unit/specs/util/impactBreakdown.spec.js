import {
	readExcludedList, filterExcluded, lentToItems, notLentToItems, getBreakdownChartValues,
} from '#src/util/impactBreakdown';

const ARTS = { id: 9, name: 'Arts' };
const FOOD = { id: 1, name: 'Food' };
const PERSONAL = { id: 13, name: 'Personal Use' };
const ALL = [FOOD, ARTS, PERSONAL];
const setting = value => ({ general: { excluded_sectors: { value } } });
const PATH = 'general.excluded_sectors.value';
const lent = (item, loanCount) => ({ ...item, loanCount });

describe('impactBreakdown', () => {
	describe('readExcludedList', () => {
		it('reads ids as numbers', () => {
			expect(readExcludedList(setting('"5, 9"'), PATH)).toEqual([5, 9]);
		});

		it('reads names as strings', () => {
			expect(readExcludedList(setting('"Arts, Personal Use"'), PATH)).toEqual(['Arts', 'Personal Use']);
		});

		it.each([
			['an empty setting', setting('""')],
			['a null setting', setting(null)],
			['a missing setting', {}],
		])('reads %s as nothing excluded', (_, data) => {
			expect(readExcludedList(data, PATH)).toEqual([]);
		});
	});

	describe('filterExcluded', () => {
		it('matches ids', () => {
			expect(filterExcluded(ALL, [9])).toEqual([FOOD, PERSONAL]);
		});

		it('matches names', () => {
			expect(filterExcluded(ALL, ['Arts', 'Personal Use'])).toEqual([FOOD]);
		});

		it('keeps everything when nothing is excluded', () => {
			expect(filterExcluded(ALL, [])).toEqual(ALL);
		});
	});

	describe('lentToItems', () => {
		it('keeps rows with loans and an item', () => {
			const values = [
				{ loanCount: 3, sector: FOOD },
				{ loanCount: 0, sector: ARTS },
				{ loanCount: 2, sector: null },
			];

			expect(lentToItems(values, 'sector')).toEqual([{ id: 1, name: 'Food', loanCount: 3 }]);
		});

		it('returns nothing for a lender with no loans', () => {
			expect(lentToItems([], 'sector')).toEqual([]);
		});
	});

	describe('notLentToItems', () => {
		it('leaves out lent-to items and sorts by name', () => {
			expect(notLentToItems([PERSONAL, FOOD, ARTS], [lent(FOOD, 3)])).toEqual([ARTS, PERSONAL]);
		});

		it('sorts items without a name instead of throwing', () => {
			const NAMELESS = { id: 2, name: null };

			expect(notLentToItems([FOOD, NAMELESS, ARTS], [])).toEqual([NAMELESS, ARTS, FOOD]);
		});

		it('returns nothing when everything is lent to', () => {
			expect(notLentToItems(ALL, ALL.map(item => lent(item, 1)))).toEqual([]);
		});

		it('counts an excluded item the lender has lent to only once', () => {
			const available = filterExcluded(ALL, [9]);
			const lentTo = lentToItems([{ loanCount: 1, sector: ARTS }], 'sector');
			const notLentTo = notLentToItems(available, lentTo);

			expect(notLentTo).toEqual([FOOD, PERSONAL]);
			expect(lentTo.length + notLentTo.length).toBe(3);
		});
	});

	describe('getBreakdownChartValues', () => {
		it('labels each item with its loan count, in the order given', () => {
			expect(getBreakdownChartValues([
				{ sector: FOOD, loanCount: 3 },
				{ sector: ARTS, loanCount: 1 },
			], 'sector')).toEqual([{ label: 'Food', value: 3 }, { label: 'Arts', value: 1 }]);
		});

		it('reads the item from the given field', () => {
			expect(getBreakdownChartValues([{ activity: { id: 41, name: 'Farming' }, loanCount: 2 }], 'activity'))
				.toEqual([{ label: 'Farming', value: 2 }]);
		});

		it('sums rows with no item name into one Other value, last', () => {
			expect(getBreakdownChartValues([
				{ sector: null, loanCount: 1 },
				{ sector: FOOD, loanCount: 3 },
				{ loanCount: 1 },
				{ sector: { id: 99 }, loanCount: 2 },
			], 'sector')).toEqual([
				{ label: 'Food', value: 3 },
				{ label: 'Other (4)', value: 4, isOther: true },
			]);
		});

		it('skips rows with no loans', () => {
			expect(getBreakdownChartValues([
				{ sector: FOOD, loanCount: 0 },
				{ sector: ARTS },
				{ sector: PERSONAL, loanCount: 1 },
			], 'sector')).toEqual([{ label: 'Personal Use', value: 1 }]);
		});

		it.each([[[]], [null], [undefined]])('returns no values for %p', values => {
			expect(getBreakdownChartValues(values, 'sector')).toEqual([]);
		});
	});
});

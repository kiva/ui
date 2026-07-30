import {
	getSectorChartValues,
	getNamedSectorCount,
	OTHER_SECTOR_LABEL,
} from '#src/util/goalInReviewSectors';

const valueFor = (values, label) => values.find(v => v.label === label)?.value;

describe('goalInReviewSectors.js', () => {
	describe('getSectorChartValues', () => {
		it('groups loans by sector name and counts them', () => {
			const achievements = [
				{
					id: 'a1',
					loanPurchases: [
						{ loan: { id: 'l1', sector: { id: 's1', name: 'Agriculture' } } },
						{ loan: { id: 'l2', sector: { id: 's1', name: 'Agriculture' } } },
						{ loan: { id: 'l3', sector: { id: 's2', name: 'Food' } } },
					],
				},
			];
			const values = getSectorChartValues(achievements);
			expect(valueFor(values, 'Agriculture')).toBe(2);
			expect(valueFor(values, 'Food')).toBe(1);
		});

		it('buckets loans with a null or missing sector into "Other"', () => {
			const achievements = [
				{
					id: 'a1',
					loanPurchases: [
						{ loan: { id: 'l1', sector: null } },
						{ loan: { id: 'l2' } }, // no sector property at all
						{ loan: { id: 'l3', sector: { id: 's1', name: 'Agriculture' } } },
					],
				},
			];
			const values = getSectorChartValues(achievements);
			expect(valueFor(values, OTHER_SECTOR_LABEL)).toBe(2);
			expect(valueFor(values, 'Agriculture')).toBe(1);
		});

		it('de-duplicates a loan that appears under multiple achievements', () => {
			const achievements = [
				{ id: 'a1', loanPurchases: [{ loan: { id: 'l1', sector: { id: 's1', name: 'Agriculture' } } }] },
				{ id: 'a2', loanPurchases: [{ loan: { id: 'l1', sector: { id: 's1', name: 'Agriculture' } } }] },
			];
			const values = getSectorChartValues(achievements);
			expect(valueFor(values, 'Agriculture')).toBe(1);
		});

		it('skips purchases with no loan or no loan id', () => {
			const achievements = [
				{
					id: 'a1',
					loanPurchases: [
						{ loan: null },
						{},
						{ loan: { sector: { id: 's1', name: 'Agriculture' } } }, // no id
						{ loan: { id: 'l1', sector: { id: 's2', name: 'Food' } } },
					],
				},
			];
			const values = getSectorChartValues(achievements);
			expect(values).toEqual([{ label: 'Food', value: 1 }]);
		});

		it('returns an empty array for empty, null, or undefined input', () => {
			expect(getSectorChartValues([])).toEqual([]);
			expect(getSectorChartValues(null)).toEqual([]);
			expect(getSectorChartValues(undefined)).toEqual([]);
		});
	});

	describe('getNamedSectorCount', () => {
		it('counts named sectors, excluding the "Other" bucket', () => {
			const values = [
				{ label: 'Agriculture', value: 3 },
				{ label: 'Food', value: 2 },
				{ label: OTHER_SECTOR_LABEL, value: 4 },
			];
			expect(getNamedSectorCount(values)).toBe(2);
		});

		it('returns 0 for empty or missing input', () => {
			expect(getNamedSectorCount([])).toBe(0);
			expect(getNamedSectorCount()).toBe(0);
		});
	});
});

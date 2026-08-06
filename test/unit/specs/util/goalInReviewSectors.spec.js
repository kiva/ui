import {
	getSectorChartValues,
	getNamedSectorCount,
	OTHER_SECTOR_LABEL,
} from '#src/util/goalInReviewSectors';

const valueFor = (values, label) => values.find(v => v.label === label)?.value;

describe('goalInReviewSectors.js', () => {
	describe('getSectorChartValues', () => {
		it('maps each sector stat to a labelled loan count', () => {
			const values = getSectorChartValues([
				{ sector: { id: 's1', name: 'Agriculture' }, loanCount: 2 },
				{ sector: { id: 's2', name: 'Food' }, loanCount: 1 },
			]);
			expect(valueFor(values, 'Agriculture')).toBe(2);
			expect(valueFor(values, 'Food')).toBe(1);
		});

		it('preserves the loan-count ordering the query returns', () => {
			const values = getSectorChartValues([
				{ sector: { name: 'Agriculture' }, loanCount: 8 },
				{ sector: { name: 'Food' }, loanCount: 3 },
				{ sector: { name: 'Retail' }, loanCount: 1 },
			]);
			expect(values.map(sector => sector.label)).toEqual(['Agriculture', 'Food', 'Retail']);
		});

		it('buckets entries with a null or missing sector into "Other", labelled with the count', () => {
			const values = getSectorChartValues([
				{ sector: null, loanCount: 1 },
				{ loanCount: 1 },
				{ sector: { name: 'Agriculture' }, loanCount: 1 },
			]);
			const other = values.find(sector => sector.isOther);
			expect(other).toMatchObject({ label: `${OTHER_SECTOR_LABEL} (2)`, value: 2 });
			expect(valueFor(values, 'Agriculture')).toBe(1);
		});

		it('appends the Other bucket last', () => {
			const values = getSectorChartValues([
				{ sector: null, loanCount: 1 },
				{ sector: { name: 'Agriculture' }, loanCount: 3 },
				{ sector: { name: 'Food' }, loanCount: 2 },
			]);
			expect(values[values.length - 1]).toEqual({ label: `${OTHER_SECTOR_LABEL} (1)`, value: 1, isOther: true });
		});

		it('omits the Other bucket entirely when every entry has a sector', () => {
			const values = getSectorChartValues([{ sector: { name: 'Agriculture' }, loanCount: 1 }]);
			expect(values.some(sector => sector.isOther)).toBe(false);
		});

		it('skips entries with no loan count', () => {
			const values = getSectorChartValues([
				{ sector: { name: 'Agriculture' }, loanCount: 0 },
				{ sector: { name: 'Retail' } },
				{ sector: { name: 'Food' }, loanCount: 1 },
			]);
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
				{ label: `${OTHER_SECTOR_LABEL} (4)`, value: 4, isOther: true },
			];
			expect(getNamedSectorCount(values)).toBe(2);
		});

		it('returns 0 for empty or missing input', () => {
			expect(getNamedSectorCount([])).toBe(0);
			expect(getNamedSectorCount()).toBe(0);
		});
	});
});

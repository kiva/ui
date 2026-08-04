import {
	getPossibleStats,
	getDisplayedStat,
	getNextStat,
	getNextSlotStat,
} from '#src/util/lendCtaStats';

const base = {
	status: 'fundraising',
	numLenders: 6,
	matchingText: 'Cisco',
	matchAtRisk: false,
	multiMatchingResolved: true,
	enableMultiMatching: false,
};

describe('lendCtaStats', () => {
	describe('getPossibleStats', () => {
		it('returns both stats for a matched fundraising loan with lenders', () => {
			expect(getPossibleStats(base)).toEqual(['lenderCount', 'matchingText']);
		});

		it.each([
			['non-fundraising status', { ...base, status: 'funded' }, []],
			['no lenders and no matching text', { ...base, numLenders: 0, matchingText: '' }, []],
			['no lenders', { ...base, numLenders: 0 }, ['matchingText']],
			['empty matching text', { ...base, matchingText: '' }, ['lenderCount']],
			['match at risk', { ...base, matchAtRisk: true }, ['lenderCount']],
			['multi matching setting unknown', { ...base, multiMatchingResolved: false }, ['lenderCount']],
			['multi matching enabled', { ...base, enableMultiMatching: true }, ['lenderCount']],
		])('handles %s', (_label, inputs, expected) => {
			expect(getPossibleStats(inputs)).toEqual(expected);
		});
	});

	describe('getDisplayedStat', () => {
		it('keeps the cycled stat while it is available', () => {
			expect(getDisplayedStat(['lenderCount', 'matchingText'], 'matchingText')).toBe('matchingText');
		});

		it('falls back to the first stat when the cycled one drops out', () => {
			expect(getDisplayedStat(['lenderCount'], 'matchingText')).toBe('lenderCount');
		});

		it('falls back to the first stat before any cycling has happened', () => {
			expect(getDisplayedStat(['lenderCount', 'matchingText'], '')).toBe('lenderCount');
		});

		it('returns an empty string when there is nothing to show', () => {
			expect(getDisplayedStat([], 'lenderCount')).toBe('');
		});
	});

	describe('getNextSlotStat', () => {
		it('locks in the first stat on the first call so it holds a full interval', () => {
			expect(getNextSlotStat(['lenderCount', 'matchingText'], '')).toBe('lenderCount');
		});

		it('advances on later calls', () => {
			expect(getNextSlotStat(['lenderCount', 'matchingText'], 'lenderCount')).toBe('matchingText');
			expect(getNextSlotStat(['lenderCount', 'matchingText'], 'matchingText')).toBe('lenderCount');
		});

		it('advances from the displayed fallback when the cycled stat dropped out', () => {
			expect(getNextSlotStat(['lenderCount'], 'matchingText')).toBe('lenderCount');
		});

		it('returns an empty string when there is nothing to show', () => {
			expect(getNextSlotStat([], '')).toBe('');
			expect(getNextSlotStat([], 'lenderCount')).toBe('');
		});
	});

	describe('getNextStat', () => {
		it('advances to the following stat', () => {
			expect(getNextStat(['lenderCount', 'matchingText'], 'lenderCount')).toBe('matchingText');
		});

		it('wraps around after the last stat', () => {
			expect(getNextStat(['lenderCount', 'matchingText'], 'matchingText')).toBe('lenderCount');
		});

		it('stays on a single stat', () => {
			expect(getNextStat(['lenderCount'], 'lenderCount')).toBe('lenderCount');
		});

		it('returns an empty string when there is nothing to show', () => {
			expect(getNextStat([], 'lenderCount')).toBe('');
		});
	});
});

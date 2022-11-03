import {
	getUpdatedNumLoansFundraising,
	getCheckboxLabel,
	transformRadioGroupOptions,
	getFilterKeyFromValue,
} from '@/util/loanSearch/filterUtils';
import { lenderRepaymentTermValueMap, EIGHT_MONTHS_KEY } from '@/util/loanSearch/filters/lenderRepaymentTerms';

describe('filterUtils.js', () => {
	describe('transformRadioGroupOptions', () => {
		it('should handle empty', () => {
			expect(transformRadioGroupOptions([], [], [])).toEqual([]);
		});

		it('should transform and sort', () => {
			const options = [{ name: 'b' }, { name: 'c' }, { name: 'a' }];

			const order = ['a', 'b', 'c'];

			const map = { A: 'AA', B: 'BB', C: 'CC' };

			const result = transformRadioGroupOptions(options, order, map);

			expect(result).toEqual([
				{ name: 'a', title: 'AA', value: 'a' },
				{ name: 'b', title: 'BB', value: 'b' },
				{ name: 'c', title: 'CC', value: 'c' }
			]);
		});
	});

	describe('getFilterKeyFromValue', () => {
		it('should return undefined when not found', () => {
			const result = getFilterKeyFromValue('asd', lenderRepaymentTermValueMap);

			expect(result).toEqual(undefined);
		});

		it('should get filter key', () => {
			const result = getFilterKeyFromValue(1, { test: 1 });

			expect(result).toEqual('test');
		});

		it('should get filter key from min max range', () => {
			const result = getFilterKeyFromValue(
				lenderRepaymentTermValueMap[EIGHT_MONTHS_KEY],
				lenderRepaymentTermValueMap
			);

			expect(result).toEqual(EIGHT_MONTHS_KEY);
		});
	});

	describe('getUpdatedNumLoansFundraising', () => {
		const mockASector = (numLoansFundraising = 6) => ({ id: 7, name: 'c', numLoansFundraising });
		const mockBSector = (numLoansFundraising = 3) => ({ id: 2, name: 'd', numLoansFundraising });
		const mockTransformedSectors = [mockASector(), mockBSector()];
		const mockATheme = (numLoansFundraising = 5) => ({ id: 6, name: 'a', numLoansFundraising });
		const mockBTheme = (numLoansFundraising = 4) => ({ id: 3, name: 'b', numLoansFundraising });

		it('should handle undefined and empty', () => {
			expect(getUpdatedNumLoansFundraising(undefined, [])).toEqual([]);
			expect(getUpdatedNumLoansFundraising([], [])).toEqual([]);
		});

		it('should update theme numLoansFundraising', () => {
			const nextA = mockATheme(9);

			const results = getUpdatedNumLoansFundraising([mockATheme(), mockBTheme()], [nextA]);

			expect(results).toEqual([nextA, mockBTheme(0)]);
		});

		it('should add missing themes', () => {
			const a = mockATheme();
			const nextB = mockBTheme();

			expect(getUpdatedNumLoansFundraising([a], [a, nextB])).toEqual([a, nextB]);
		});

		it('should update sector numLoansFundraising', () => {
			const nextA = mockASector(9);

			expect(getUpdatedNumLoansFundraising(mockTransformedSectors, [nextA])).toEqual([nextA, mockBSector(0)]);
		});

		it('should add missing sectors', () => {
			const a = mockASector();
			const nextB = mockBSector();

			expect(getUpdatedNumLoansFundraising([a], [a, nextB])).toEqual([a, nextB]);
		});

		it('should handle missing numLoansFundraising', () => {
			const a = { id: 1, name: 'a' };
			const nextA = { id: 1, name: 'a' };

			expect(getUpdatedNumLoansFundraising([a], [nextA])).toEqual([{ ...nextA }]);
		});
	});

	describe('getCheckboxLabel', () => {
		it('should handle region', () => {
			expect(getCheckboxLabel({ region: 'test', numLoansFundraising: 1 })).toBe('test (1)');
		});

		it('should handle item', () => {
			expect(getCheckboxLabel({ name: 'test', numLoansFundraising: 1 })).toBe('test (1)');
		});

		it('should handle missing numLoansFundraising', () => {
			expect(getCheckboxLabel({ name: 'test' })).toBe('test');
		});
	});
});

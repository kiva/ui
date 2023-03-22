import { loanCallouts, getDropdownPriceArray } from '@/util/loanUtils';
import mockLoanData from '../../fixtures/mockLoanData';

const loan = mockLoanData[0];

describe('loanUtils.js', () => {
	describe('loanCallouts', () => {
		it('should handle undefined', () => {
			const result = loanCallouts();

			expect(result).toEqual([]);
		});

		it('should handle undefined loan', () => {
			const result = loanCallouts(undefined, 'asd');

			expect(result).toEqual([]);
		});

		it('should handle undefined categoryPageName', () => {
			const result = loanCallouts(loan);

			expect(result).toEqual(['Dairy', 'Agriculture']);
		});

		it('should handle undefined activity', () => {
			const result = loanCallouts({ ...loan, activity: undefined });

			console.log(result);

			expect(result).toEqual(['Agriculture']);
		});

		it('should handle undefined sector', () => {
			const result = loanCallouts({ ...loan, sector: undefined });

			expect(result).toEqual(['Dairy']);
		});

		it('should handle undefined tags', () => {
			const result = loanCallouts({ ...loan, tags: undefined });

			expect(result).toEqual(['Dairy', 'Agriculture']);
		});

		it('should handle undefined themes', () => {
			const result = loanCallouts({ ...loan, themes: undefined });

			expect(result).toEqual(['Dairy', 'Agriculture']);
		});

		it('should return public tags', () => {
			const result = loanCallouts({
				...loan,
				activity: undefined,
				sector: undefined,
				tags: ['#asd', 'qwe']
			});

			expect(result).toEqual(['asd']);
		});

		it('should return eco-friendly', () => {
			let result = loanCallouts({
				...loan,
				activity: undefined,
				sector: undefined,
				tags: ['#Eco-friendly']
			});

			expect(result).toEqual(['Eco-friendly']);

			result = loanCallouts({
				...loan,
				activity: undefined,
				sector: undefined,
				tags: ['#Sustainable Ag']
			});

			expect(result).toEqual(['Eco-friendly', 'Sustainable Ag']);
		});

		it('should return Refugees and IDPs', () => {
			const result = loanCallouts({
				...loan,
				activity: undefined,
				sector: undefined,
				themes: ['Refugees/Displaced']
			});

			expect(result).toEqual(['Refugees and IDPs', 'Refugees/Displaced']);
		});

		it('should return Single Parent', () => {
			const result = loanCallouts({
				...loan,
				activity: undefined,
				sector: undefined,
				tags: ['#Single Parent']
			});

			expect(result).toEqual(['Single Parent']);
		});

		it('should return activity if not matching category', () => {
			let result = loanCallouts(loan, 'Asd');

			expect(result).toEqual(['Dairy', 'Agriculture']);

			result = loanCallouts(loan, 'Dairy');

			expect(result).toEqual(['Agriculture']);
		});

		it('should return sector if not matching category or activity', () => {
			let result = loanCallouts(loan, 'Asd');

			expect(result).toEqual(['Dairy', 'Agriculture']);

			result = loanCallouts(loan, 'Dairy');

			expect(result).toEqual(['Agriculture']);

			result = loanCallouts({ ...loan, activity: { name: 'Agriculture' } }, 'Agriculture');

			expect(result).toEqual([]);
		});

		it('should return tag if callouts still needed and not already in callouts', () => {
			let result = loanCallouts({ ...loan, tags: ['#asd'] });

			expect(result).toEqual(['Dairy', 'Agriculture']);

			result = loanCallouts({ ...loan, activity: undefined, tags: ['#asd'] });

			expect(result).toEqual(['Agriculture', 'asd']);

			result = loanCallouts({ ...loan, activity: undefined, tags: ['#agriculture'] });

			expect(result).toEqual(['Agriculture']);
		});

		it('should return theme if callouts still needed and not already in callouts', () => {
			let result = loanCallouts({ ...loan, themes: ['asd'] });

			expect(result).toEqual(['Dairy', 'Agriculture']);

			result = loanCallouts({ ...loan, activity: undefined, themes: ['asd'] });

			expect(result).toEqual(['Agriculture', 'asd']);

			result = loanCallouts({ ...loan, activity: undefined, themes: ['agriculture'] });

			expect(result).toEqual(['Agriculture']);
		});
	});
	describe('DropdownPrices', () => {
		const unreservedAmount = 2000;
		const minAmount = 25;
		const enableFiveDollarsNotes = false;

		it('should return 25 as first option', () => {
			const result = getDropdownPriceArray(unreservedAmount, minAmount, enableFiveDollarsNotes);
			expect(result[0]).toEqual('25');
		});

		it('should return 500 as last option if amount left is greater than 500', () => {
			const result = getDropdownPriceArray(unreservedAmount, minAmount, enableFiveDollarsNotes);
			const lastOption = result.length - 1;
			expect(result[lastOption]).toEqual('500');
		});

		it('should return amount left or closer $25 increment as last option if amount left is less than 500', () => {
			const unreservedAmountLess500 = 325;
			const result = getDropdownPriceArray(unreservedAmountLess500, minAmount, enableFiveDollarsNotes);
			const lastOption = result.length - 1;
			expect(result[lastOption]).toEqual('325');
		});

		it('should return 5 as first option if $5 notes test enabled', () => {
			const FiveDollarsNotes = true;
			const result = getDropdownPriceArray(unreservedAmount, minAmount, FiveDollarsNotes);
			expect(result[0]).toEqual('5');
		});

		it('should return 25 as first option if $5 notes test enabled and loan in PFP', () => {
			const FiveDollarsNotes = true;
			const inPfp = true;
			const result = getDropdownPriceArray(unreservedAmount, minAmount, FiveDollarsNotes, inPfp);
			expect(result[0]).toEqual('25');
		});
	});
});

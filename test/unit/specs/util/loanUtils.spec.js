import { getDropdownPriceArray, getDropdownPriceArrayCheckout } from '@/util/loanUtils';

describe('loanUtils.js', () => {
	describe('getDropdownPriceArray', () => {
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
			const result = getDropdownPriceArray(unreservedAmount, minAmount, true);
			expect(result[0]).toEqual('5');
		});

		it('should return 25 as first option if $5 notes test enabled and loan in PFP', () => {
			const result = getDropdownPriceArray(unreservedAmount, minAmount, true, true);
			expect(result[0]).toEqual('25');
		});

		it('should work passing a string as unreserved amount', () => {
			const result = getDropdownPriceArray('230', minAmount, enableFiveDollarsNotes);
			expect(result[0]).toEqual('25');
		});
	});
	describe('getDropdownPriceArrayCheckout', () => {
		const unreservedAmount = 2000;
		const minAmount = 25;
		const enableFiveDollarsNotes = false;

		it('should return 25 as first option', () => {
			const result = getDropdownPriceArrayCheckout(unreservedAmount, minAmount, enableFiveDollarsNotes);
			expect(result[0]).toEqual('25');
		});

		it('should return 975 as last option if amount left is greater than 975', () => {
			const result = getDropdownPriceArrayCheckout(unreservedAmount, minAmount, enableFiveDollarsNotes);
			const lastOption = result.length - 1;
			expect(result[lastOption]).toEqual('975');
		});

		it('should return amount left or closer $25 increment as last option if amount left is less than 975', () => {
			const unreservedAmountLess500 = 325;
			const result = getDropdownPriceArrayCheckout(unreservedAmountLess500, minAmount, enableFiveDollarsNotes);
			const lastOption = result.length - 1;
			expect(result[lastOption]).toEqual('325');
		});

		it('should return 5 as first option if $5 notes test enabled', () => {
			const result = getDropdownPriceArrayCheckout(unreservedAmount, minAmount, true);
			expect(result[0]).toEqual('5');
		});

		it('should work passing a string as unreserved amount', () => {
			const result = getDropdownPriceArrayCheckout('230', minAmount, enableFiveDollarsNotes);
			expect(result[0]).toEqual('25');
		});
	});
});

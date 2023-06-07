import {
	loanCallouts,
	getDropdownPriceArray,
	getDropdownPriceArrayCheckout,
	getLendCtaSelectedOption,
	ERL_COOKIE_NAME,
	TOP_UP_CAMPAIGN,
	BASE_CAMPAIGN,
} from '@/util/loanUtils';
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

	describe('getLendCtaSelectedOption', () => {
		let mockCookieStoreGet;
		let mockCookieStoreSet;
		let mockCookieStore;
		const mockTomorrow = new Date(2023, 1, 2);

		beforeEach(() => {
			mockCookieStoreGet = jest.fn();
			mockCookieStoreSet = jest.fn();
			mockCookieStore = {
				get: mockCookieStoreGet,
				set: mockCookieStoreSet,
			};
			jest.useFakeTimers('modern');
			jest.setSystemTime(new Date(2023, 1, 1));
		});

		afterEach(() => {
			jest.clearAllMocks();
			jest.useRealTimers();
		});

		it('should handle unreserved amount greater than $50 without campaign', () => {
			const result = getLendCtaSelectedOption(mockCookieStore, true, undefined, '75.00', '0.00');

			expect(result).toBe('25');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledTimes(0);
		});

		it('should handle unreserved amount between $25 and $50 without $5 notes', () => {
			const result = getLendCtaSelectedOption(mockCookieStore, true, undefined, '45.00', '0.00');

			expect(result).toBe('45');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledTimes(0);
		});

		it('should handle unreserved amount less than $25 without $5 notes', () => {
			const result = getLendCtaSelectedOption(mockCookieStore, true, undefined, '15.00', '0.00');

			expect(result).toBe('15');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledTimes(0);
		});

		it('should handle $5 notes ERL top up campaign without existing cookie', () => {
			const result = getLendCtaSelectedOption(mockCookieStore, true, TOP_UP_CAMPAIGN, '15.00', '0.00');

			expect(result).toBe('5');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledWith(
				ERL_COOKIE_NAME,
				TOP_UP_CAMPAIGN,
				{ expires: mockTomorrow }
			);
		});

		it('should handle $5 notes ERL base campaign without existing cookie', () => {
			const result = getLendCtaSelectedOption(mockCookieStore, true, BASE_CAMPAIGN, '15.00', '10.00');

			expect(result).toBe('10');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledWith(
				ERL_COOKIE_NAME,
				BASE_CAMPAIGN,
				{ expires: mockTomorrow }
			);
		});

		it('should handle $5 notes ERL base campaign max $25', () => {
			const result = getLendCtaSelectedOption(mockCookieStore, true, BASE_CAMPAIGN, '75.00', '50.00');

			expect(result).toBe('25');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledWith(
				ERL_COOKIE_NAME,
				BASE_CAMPAIGN,
				{ expires: mockTomorrow }
			);
		});

		it('should handle $5 notes ERL base campaign default to $5 with no balance', () => {
			const result = getLendCtaSelectedOption(mockCookieStore, true, BASE_CAMPAIGN, '15.00', '0.00');

			expect(result).toBe('5');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledWith(
				ERL_COOKIE_NAME,
				BASE_CAMPAIGN,
				{ expires: mockTomorrow }
			);
		});

		it('should handle $5 notes ERL base campaign default to unreserved amount when not enough', () => {
			const result = getLendCtaSelectedOption(mockCookieStore, true, BASE_CAMPAIGN, '5.00', '15.00');

			expect(result).toBe('5');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledWith(
				ERL_COOKIE_NAME,
				BASE_CAMPAIGN,
				{ expires: mockTomorrow }
			);
		});

		it('should handle $5 notes ERL top up campaign with existing cookie', () => {
			mockCookieStoreGet.mockReturnValue(TOP_UP_CAMPAIGN);

			const result = getLendCtaSelectedOption(mockCookieStore, true, undefined, '15.00', '0.00');

			expect(result).toBe('5');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledTimes(0);
		});

		it('should handle $5 notes ERL base campaign with existing cookie', () => {
			mockCookieStoreGet.mockReturnValue(BASE_CAMPAIGN);

			const result = getLendCtaSelectedOption(mockCookieStore, true, undefined, '15.00', '15.00');

			expect(result).toBe('15');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledTimes(0);
		});

		it('should handle $5 notes ERL campaign use partial string match', () => {
			const result = getLendCtaSelectedOption(mockCookieStore, true, `asd${TOP_UP_CAMPAIGN}asd`, '15.00', '0.00');

			expect(result).toBe('5');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledWith(
				ERL_COOKIE_NAME,
				TOP_UP_CAMPAIGN,
				{ expires: mockTomorrow }
			);
		});

		it('should handle $5 notes ERL campaign use case insensitive match', () => {
			const result = getLendCtaSelectedOption(
				mockCookieStore,
				true,
				`asd${TOP_UP_CAMPAIGN.toLowerCase()}asd`,
				'15.00',
				'0.00'
			);

			expect(result).toBe('5');
			expect(mockCookieStoreGet).toHaveBeenCalledWith(ERL_COOKIE_NAME);
			expect(mockCookieStoreSet).toHaveBeenCalledWith(
				ERL_COOKIE_NAME,
				TOP_UP_CAMPAIGN,
				{ expires: mockTomorrow }
			);
		});
	});
});

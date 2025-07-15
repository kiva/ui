import {
	getDropdownPriceArray,
	getDropdownPriceArrayCheckout,
	getLendCtaSelectedOption,
	ERL_COOKIE_NAME,
	TOP_UP_CAMPAIGN,
	BASE_CAMPAIGN,
	getCustomHref,
} from '#src/util/loanUtils';

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

		it('should return 2,000 as last option if amount left is greater than 1000 and huge amount enabled', () => {
			const result = getDropdownPriceArray(unreservedAmount, minAmount, enableFiveDollarsNotes, false, true);
			const lastOption = result.length - 1;
			expect(result[lastOption]).toEqual('2,000');
		});

		it('should return 865 as last option if amount left is 865 and huge amount enabled', () => {
			const result = getDropdownPriceArray('865', minAmount, enableFiveDollarsNotes, false, true);
			const lastOption = result.length - 1;
			expect(result[lastOption]).toEqual('865');
		});

		it('should return huge dropdown values between 500 and 1000', () => {
			const result = getDropdownPriceArray('650.00', 25, false, false, true);

			expect(result).toEqual([
				'25',
				'50',
				'75',
				'100',
				'125',
				'150',
				'175',
				'200',
				'225',
				'250',
				'275',
				'300',
				'325',
				'350',
				'375',
				'400',
				'425',
				'450',
				'475',
				'500',
				'600',
				'650',
			]);
		});

		it('should return huge dropdown values up to 10,000', () => {
			const result = getDropdownPriceArray('11000.00', 25, false, false, true);

			expect(result).toEqual([
				'25',
				'50',
				'75',
				'100',
				'125',
				'150',
				'175',
				'200',
				'225',
				'250',
				'275',
				'300',
				'325',
				'350',
				'375',
				'400',
				'425',
				'450',
				'475',
				'500',
				'600',
				'700',
				'800',
				'900',
				'1,000',
				'2,000',
				'3,000',
				'4,000',
				'5,000',
				'6,000',
				'7,000',
				'8,000',
				'9,000',
				'10,000',
			]);
		});

		it('should return not huge dropdown values when huge amounts disabled', () => {
			const result = getDropdownPriceArray('650.00', 25, false, false, false);

			expect(result).toEqual([
				'25',
				'50',
				'75',
				'100',
				'125',
				'150',
				'175',
				'200',
				'225',
				'250',
				'275',
				'300',
				'325',
				'350',
				'375',
				'400',
				'425',
				'450',
				'475',
				'500',
			]);
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

		it('should return 2,000 as last option if amount left is greater than 1000 and huge amount enabled', () => {
			const result = getDropdownPriceArrayCheckout(unreservedAmount, minAmount, enableFiveDollarsNotes, true);
			const lastOption = result.length - 1;
			expect(result[lastOption]).toEqual('2,000');
		});

		it('should return 865 as last option if amount left is 865 and huge amount enabled', () => {
			const result = getDropdownPriceArrayCheckout('865', minAmount, enableFiveDollarsNotes, true);
			const lastOption = result.length - 1;
			expect(result[lastOption]).toEqual('865');
		});

		it('should return huge dropdown values between 500 and 1000', () => {
			const result = getDropdownPriceArray('650.00', 25, false, false, true);

			expect(result).toEqual([
				'25',
				'50',
				'75',
				'100',
				'125',
				'150',
				'175',
				'200',
				'225',
				'250',
				'275',
				'300',
				'325',
				'350',
				'375',
				'400',
				'425',
				'450',
				'475',
				'500',
				'600',
				'650',
			]);
		});

		it('should return huge dropdown values up to 10,000', () => {
			const result = getDropdownPriceArray('11000.00', 25, false, false, true);

			expect(result).toEqual([
				'25',
				'50',
				'75',
				'100',
				'125',
				'150',
				'175',
				'200',
				'225',
				'250',
				'275',
				'300',
				'325',
				'350',
				'375',
				'400',
				'425',
				'450',
				'475',
				'500',
				'600',
				'700',
				'800',
				'900',
				'1,000',
				'2,000',
				'3,000',
				'4,000',
				'5,000',
				'6,000',
				'7,000',
				'8,000',
				'9,000',
				'10,000',
			]);
		});

		it('should return not huge dropdown values when huge amounts disabled', () => {
			const result = getDropdownPriceArray('650.00', 25, false, false, false);

			expect(result).toEqual([
				'25',
				'50',
				'75',
				'100',
				'125',
				'150',
				'175',
				'200',
				'225',
				'250',
				'275',
				'300',
				'325',
				'350',
				'375',
				'400',
				'425',
				'450',
				'475',
				'500',
			]);
		});
	});

	describe('getLendCtaSelectedOption', () => {
		let mockCookieStoreGet;
		let mockCookieStoreSet;
		let mockCookieStore;
		const mockTomorrow = new Date(2023, 1, 2);

		beforeEach(() => {
			mockCookieStoreGet = vi.fn();
			mockCookieStoreSet = vi.fn();
			mockCookieStore = {
				get: mockCookieStoreGet,
				set: mockCookieStoreSet,
			};
			vi.useFakeTimers('modern');
			vi.setSystemTime(new Date(2023, 1, 1));
		});

		afterEach(() => {
			vi.clearAllMocks();
			vi.useRealTimers();
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

		it('should handle $5 notes ERL campaign with undefined balance', () => {
			mockCookieStoreGet.mockReturnValue(BASE_CAMPAIGN);

			const result = getLendCtaSelectedOption(mockCookieStore, true, undefined, '100.00', undefined);

			expect(result).toBe('25');
			expect(mockCookieStoreGet).toHaveBeenCalledTimes(0);
			expect(mockCookieStoreSet).toHaveBeenCalledTimes(0);
		});
	});

	describe('getCustomHref', () => {
		let mockRouter;

		beforeEach(() => {
			mockRouter = {
				currentRoute: {
					value: {
						query: { foo: 'bar', baz: 'qux' }
					}
				},
				resolve: vi.fn()
			};
		});

		it('should return empty string if isBpModalEnabled is false', () => {
			const result = getCustomHref(mockRouter, '123', false);
			expect(result).toBe('');
			expect(mockRouter.resolve).not.toHaveBeenCalled();
		});

		it('should call router.resolve with merged query and loanId', () => {
			const resolvedHref = '/some/path?foo=bar&baz=qux&loanId=123';
			mockRouter.resolve.mockReturnValue({ href: resolvedHref });

			const result = getCustomHref(mockRouter, '123', true);

			expect(mockRouter.resolve).toHaveBeenCalledWith({
				query: { foo: 'bar', baz: 'qux', loanId: '123' }
			});
			expect(result).toBe(resolvedHref);
		});

		it('should override existing loanId in query', () => {
			mockRouter.currentRoute.value.query = { foo: 'bar', loanId: 'old' };
			const resolvedHref = '/some/path?foo=bar&loanId=456';
			mockRouter.resolve.mockReturnValue({ href: resolvedHref });

			const result = getCustomHref(mockRouter, '456', true);

			expect(mockRouter.resolve).toHaveBeenCalledWith({
				query: { foo: 'bar', loanId: '456' }
			});
			expect(result).toBe(resolvedHref);
		});

		it('should handle empty query object', () => {
			mockRouter.currentRoute.value.query = {};
			const resolvedHref = '/some/path?loanId=789';
			mockRouter.resolve.mockReturnValue({ href: resolvedHref });

			const result = getCustomHref(mockRouter, '789', true);

			expect(mockRouter.resolve).toHaveBeenCalledWith({
				query: { loanId: '789' }
			});
			expect(result).toBe(resolvedHref);
		});
	});
});

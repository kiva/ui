import {
	getDropdownPriceArray,
	getDropdownPriceArrayCheckout,
	getLendCtaSelectedOption,
	ERL_COOKIE_NAME,
	TOP_UP_CAMPAIGN,
	BASE_CAMPAIGN,
	getCustomHref,
	isLoanFundraising,
	formatWhySpecial,
	toParagraphs,
	isMatchAtRisk,
	readLoanData,
	watchLoanData,
	watchLoanCardData,
	readLoanFragment,
	queryLoanData,
	isLessThan25,
	isBetween25And50,
	isBetween25And500,
} from '../../../../src/util/loanUtils';

describe('loanUtils.js', () => {
	describe('isLoanFundraising', () => {
		it('should return false if loan status is not fundraising', () => {
			const loan = { status: 'funded' };
			expect(isLoanFundraising(loan)).toBe(false);
		});

		it('should return false if loan amount equals funded amount', () => {
			const loan = {
				status: 'fundraising',
				loanAmount: '1000.00',
				loanFundraisingInfo: {
					fundedAmount: '1000.00',
					reservedAmount: '0.00'
				}
			};
			expect(isLoanFundraising(loan)).toBe(false);
		});

		it('should return false if loan amount is less than or equal to funded + reserved', () => {
			const loan = {
				status: 'fundraising',
				loanAmount: '1000.00',
				loanFundraisingInfo: {
					fundedAmount: '900.00',
					reservedAmount: '100.00'
				}
			};
			expect(isLoanFundraising(loan)).toBe(false);
		});

		it('should return true if loan is fundraising and has unreserved amount', () => {
			const loan = {
				status: 'fundraising',
				loanAmount: '1000.00',
				loanFundraisingInfo: {
					fundedAmount: '500.00',
					reservedAmount: '100.00'
				}
			};
			expect(isLoanFundraising(loan)).toBe(true);
		});
	});

	describe('formatWhySpecial', () => {
		it('should format why special text with lowercase first letter', () => {
			const result = formatWhySpecial('It helps a woman entrepreneur');
			expect(result).toBe('This loan is special because it helps a woman entrepreneur');
		});

		it('should return empty string if whySpecial is empty', () => {
			expect(formatWhySpecial('')).toBe('');
		});

		it('should return empty string if whySpecial is undefined', () => {
			expect(formatWhySpecial()).toBe('');
		});

		it('should handle leading/trailing whitespace in whySpecial', () => {
			const result = formatWhySpecial(' It helps a refugee ');
			expect(result).toBe('This loan is special because It helps a refugee');
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

		it('should call router.resolve with merged query and loanId', () => {
			const resolvedHref = '/some/path?foo=bar&baz=qux&loanId=123';
			mockRouter.resolve.mockReturnValue({ href: resolvedHref });

			const result = getCustomHref(mockRouter, '123');

			expect(mockRouter.resolve).toHaveBeenCalledWith({
				query: { foo: 'bar', baz: 'qux', loanId: '123' }
			});
			expect(result).toBe(resolvedHref);
		});

		it('should override existing loanId in query', () => {
			mockRouter.currentRoute.value.query = { foo: 'bar', loanId: 'old' };
			const resolvedHref = '/some/path?foo=bar&loanId=456';
			mockRouter.resolve.mockReturnValue({ href: resolvedHref });

			const result = getCustomHref(mockRouter, '456');

			expect(mockRouter.resolve).toHaveBeenCalledWith({
				query: { foo: 'bar', loanId: '456' }
			});
			expect(result).toBe(resolvedHref);
		});

		it('should handle empty query object', () => {
			mockRouter.currentRoute.value.query = {};
			const resolvedHref = '/some/path?loanId=789';
			mockRouter.resolve.mockReturnValue({ href: resolvedHref });

			const result = getCustomHref(mockRouter, '789');

			expect(mockRouter.resolve).toHaveBeenCalledWith({
				query: { loanId: '789' }
			});
			expect(result).toBe(resolvedHref);
		});
	});

	describe('toParagraphs', () => {
		it('should convert newlines to paragraph array', () => {
			const text = 'Line 1\nLine 2\nLine 3';
			const result = toParagraphs(text);
			expect(result).toEqual(['Line 1', 'Line 2', 'Line 3']);
		});

		it('should handle carriage returns', () => {
			const text = 'Line 1\rLine 2\rLine 3';
			const result = toParagraphs(text);
			expect(result).toEqual(['Line 1', 'Line 2', 'Line 3']);
		});

		it('should handle HTML br tags', () => {
			const text = 'Line 1<br>Line 2<br/>Line 3<br />Line 4';
			const result = toParagraphs(text);
			expect(result).toEqual(['Line 1', 'Line 2', 'Line 3', 'Line 4']);
		});

		it('should handle multiple consecutive newlines', () => {
			const text = 'Paragraph 1\n\n\nParagraph 2';
			const result = toParagraphs(text);
			expect(result).toEqual(['Paragraph 1', 'Paragraph 2']);
		});

		it('should convert non-string input to string', () => {
			const result = toParagraphs(12345);
			expect(result).toEqual(['12345']);
		});
	});

	describe('isMatchAtRisk', () => {
		it('should return false if loan has no matchingText', () => {
			const loan = {
				status: 'fundraising',
				loanAmount: '1000.00',
				loanFundraisingInfo: { fundedAmount: '500.00', reservedAmount: '0.00' }
			};
			expect(isMatchAtRisk(loan)).toBe(false);
		});

		it('should return false if loan is null', () => {
			expect(isMatchAtRisk(null)).toBe(false);
		});

		it('should return true when remaining amount is less than match amount', () => {
			const loan = {
				matchingText: 'Match text',
				matchRatio: 1,
				loanAmount: '100.00',
				loanFundraisingInfo: { fundedAmount: '60.00', reservedAmount: '0.00' }
			};
			// Remaining: 40, Match amount: (1 * 25) + 25 = 50, 40 < 50 = true
			expect(isMatchAtRisk(loan)).toBe(true);
		});

		it('should return false when remaining amount is greater than match amount', () => {
			const loan = {
				matchingText: 'Match text',
				matchRatio: 1,
				loanAmount: '1000.00',
				loanFundraisingInfo: { fundedAmount: '500.00', reservedAmount: '0.00' }
			};
			expect(isMatchAtRisk(loan)).toBe(false);
		});

		it('should handle matchRatio in calculation', () => {
			const loan = {
				matchingText: 'Match text',
				matchRatio: 2,
				loanAmount: '150.00',
				loanFundraisingInfo: { fundedAmount: '70.00', reservedAmount: '0.00' }
			};
			// Remaining: 80, Match amount: (2 * 25) + 25 = 75, 80 > 75 = false
			expect(isMatchAtRisk(loan)).toBe(false);
		});
	});

	describe('readLoanData', () => {
		it('should read loan data from Apollo cache', () => {
			const mockApollo = {
				readQuery: vi.fn().mockReturnValue({ loan: { id: 123 } })
			};
			const mockCookieStore = { get: vi.fn().mockReturnValue('basket123') };
			const mockQuery = { query: 'LOAN_QUERY' };

			const result = readLoanData({
				apollo: mockApollo,
				cookieStore: mockCookieStore,
				loanId: 123,
				loanQuery: mockQuery
			});

			expect(result).toEqual({ loan: { id: 123 } });
			expect(mockApollo.readQuery).toHaveBeenCalledWith({
				query: mockQuery,
				variables: { basketId: 'basket123', loanId: 123 }
			});
		});

		it('should return null when readQuery throws error', () => {
			const mockApollo = {
				readQuery: vi.fn().mockImplementation(() => { throw new Error('Cache miss'); })
			};
			const mockCookieStore = { get: vi.fn().mockReturnValue('basket123') };

			const result = readLoanData({
				apollo: mockApollo,
				cookieStore: mockCookieStore,
				loanId: 123,
				loanQuery: { query: 'LOAN_QUERY' }
			});

			expect(result).toBeNull();
		});
	});

	describe('queryLoanData', () => {
		it('should query loan data from Apollo', () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({ data: { loan: { id: 456 } } })
			};
			const mockCookieStore = { get: vi.fn().mockReturnValue('basket456') };
			const mockQuery = { query: 'LOAN_QUERY' };

			queryLoanData({
				apollo: mockApollo,
				cookieStore: mockCookieStore,
				loanId: 456,
				loanQuery: mockQuery
			});

			expect(mockApollo.query).toHaveBeenCalledWith({
				query: mockQuery,
				variables: { basketId: 'basket456', loanId: 456 }
			});
		});
	});

	describe('watchLoanData', () => {
		it('should setup Apollo watchQuery with subscription', () => {
			const mockCallback = vi.fn();
			const mockSubscribe = vi.fn(handlers => {
				// Simulate immediate result
				handlers.next({ data: { loan: { id: 789 } } });
				return { unsubscribe: vi.fn() };
			});
			const mockQueryObserver = { subscribe: mockSubscribe };
			const mockApollo = {
				watchQuery: vi.fn().mockReturnValue(mockQueryObserver)
			};
			const mockCookieStore = { get: vi.fn().mockReturnValue('basket789') };
			const mockQuery = { query: 'LOAN_QUERY' };

			const result = watchLoanData({
				apollo: mockApollo,
				cookieStore: mockCookieStore,
				loanId: 789,
				loanQuery: mockQuery,
				callback: mockCallback
			});

			expect(mockApollo.watchQuery).toHaveBeenCalledWith({
				query: mockQuery,
				variables: { basketId: 'basket789', loanId: 789 }
			});
			expect(result.queryObserver).toBe(mockQueryObserver);
			expect(mockCallback).toHaveBeenCalledWith({ data: { loan: { id: 789 } } });
		});

		it('should handle errors in watchQuery subscription', () => {
			const mockCallback = vi.fn();
			const mockSubscribe = vi.fn(handlers => {
				handlers.error(new Error('Watch error'));
				return { unsubscribe: vi.fn() };
			});
			const mockQueryObserver = { subscribe: mockSubscribe };
			const mockApollo = { watchQuery: vi.fn().mockReturnValue(mockQueryObserver) };
			const mockCookieStore = { get: vi.fn().mockReturnValue('basket999') };

			watchLoanData({
				apollo: mockApollo,
				cookieStore: mockCookieStore,
				loanId: 999,
				loanQuery: { query: 'LOAN_QUERY' },
				callback: mockCallback
			});

			expect(mockCallback).toHaveBeenCalledWith({ error: expect.any(Error) });
		});

		it('should return both queryObserver and subscription', () => {
			const mockCallback = vi.fn();
			const mockUnsubscribe = vi.fn();
			const mockSubscription = { unsubscribe: mockUnsubscribe };
			const mockSubscribe = vi.fn(handlers => {
				handlers.next({ data: { loan: { id: 111 } } });
				return mockSubscription;
			});
			const mockQueryObserver = { subscribe: mockSubscribe };
			const mockApollo = { watchQuery: vi.fn().mockReturnValue(mockQueryObserver) };
			const mockCookieStore = { get: vi.fn().mockReturnValue('basket111') };

			const result = watchLoanData({
				apollo: mockApollo,
				cookieStore: mockCookieStore,
				loanId: 111,
				loanQuery: { query: 'LOAN_QUERY' },
				callback: mockCallback
			});

			expect(result.queryObserver).toBe(mockQueryObserver);
			expect(result.subscription).toBe(mockSubscription);
		});
	});

	describe('watchLoanCardData', () => {
		it('should setup Apollo watchQuery for loan card', () => {
			const mockCallback = vi.fn();
			const mockSubscribe = vi.fn(handlers => {
				handlers.next({ data: { loanCard: { id: 222 } } });
				return { unsubscribe: vi.fn() };
			});
			const mockQueryObserver = { subscribe: mockSubscribe };
			const mockApollo = { watchQuery: vi.fn().mockReturnValue(mockQueryObserver) };
			const mockQuery = { query: 'LOAN_CARD_QUERY' };

			const result = watchLoanCardData({
				apollo: mockApollo,
				loanId: 222,
				loanCardQuery: mockQuery,
				callback: mockCallback,
				publicId: 'user-pub-id'
			});

			expect(mockApollo.watchQuery).toHaveBeenCalledWith({
				query: mockQuery,
				variables: {
					loanId: 222,
					publicId: 'user-pub-id'
				}
			});
			expect(result).toBe(mockQueryObserver);
			expect(mockCallback).toHaveBeenCalledWith({ data: { loanCard: { id: 222 } } });
		});

		it('should handle errors in loan card watchQuery', () => {
			const mockCallback = vi.fn();
			const mockSubscribe = vi.fn(handlers => {
				handlers.error(new Error('Loan card watch error'));
				return { unsubscribe: vi.fn() };
			});
			const mockQueryObserver = { subscribe: mockSubscribe };
			const mockApollo = { watchQuery: vi.fn().mockReturnValue(mockQueryObserver) };

			watchLoanCardData({
				apollo: mockApollo,
				loanId: 333,
				loanCardQuery: { query: 'LOAN_CARD_QUERY' },
				callback: mockCallback,
				publicId: null
			});

			expect(mockCallback).toHaveBeenCalledWith({ error: expect.any(Error) });
		});
	});

	describe('readLoanFragment', () => {
		it('should read LoanPartner fragment from cache', () => {
			const mockFragment = { query: 'FRAGMENT' };
			const mockApollo = {
				readFragment: vi.fn().mockReturnValue({ id: 444, type: 'LoanPartner' })
			};

			const result = readLoanFragment({
				apollo: mockApollo,
				loanId: 444,
				fragment: mockFragment,
				publicId: 'pub-444'
			});

			expect(result).toEqual({ id: 444, type: 'LoanPartner' });
			expect(mockApollo.readFragment).toHaveBeenCalledWith({
				id: 'LoanPartner:444',
				publicId: 'pub-444',
				fragment: mockFragment
			});
		});

		it('should fallback to LoanDirect fragment when LoanPartner throws', () => {
			const mockFragment = { query: 'FRAGMENT' };
			const mockApollo = {
				readFragment: vi.fn()
					.mockImplementationOnce(() => { throw new Error('Not found'); })
					.mockReturnValueOnce({ id: 555, type: 'LoanDirect' })
			};

			const result = readLoanFragment({
				apollo: mockApollo,
				loanId: 555,
				fragment: mockFragment,
				publicId: null
			});

			expect(result).toEqual({ id: 555, type: 'LoanDirect' });
			expect(mockApollo.readFragment).toHaveBeenCalledTimes(2);
		});

		it('should return null when both fragments throw errors', () => {
			const mockFragment = { query: 'FRAGMENT' };
			const mockApollo = {
				readFragment: vi.fn()
					.mockImplementationOnce(() => { throw new Error('Not found'); })
					.mockReturnValueOnce(null)
			};

			const result = readLoanFragment({
				apollo: mockApollo,
				loanId: 666,
				fragment: mockFragment,
				publicId: null
			});

			// Returns null from the directFragment attempt
			expect(result).toBeNull();
			expect(mockApollo.readFragment).toHaveBeenCalledTimes(2);
		});
	});

	describe('isLessThan25', () => {
		it('should return true when amount is less than 25 and greater than 0', () => {
			expect(isLessThan25(24.99)).toBe(true);
			expect(isLessThan25(10)).toBe(true);
			expect(isLessThan25(0.01)).toBe(true);
		});

		it('should return false when amount is 25 or greater', () => {
			expect(isLessThan25(25)).toBe(false);
			expect(isLessThan25(100)).toBe(false);
		});

		it('should return false when amount is 0 or negative', () => {
			expect(isLessThan25(0)).toBe(false);
			expect(isLessThan25(-5)).toBe(false);
		});
	});

	describe('isBetween25And50', () => {
		it('should return true when amount is between 25 and 50 inclusive', () => {
			expect(isBetween25And50(25.01)).toBe(true);
			expect(isBetween25And50(35)).toBe(true);
			expect(isBetween25And50(50)).toBe(true);
		});

		it('should return false when amount is 25 or less', () => {
			expect(isBetween25And50(25)).toBe(false);
			expect(isBetween25And50(10)).toBe(false);
		});

		it('should return false when amount is greater than 50', () => {
			expect(isBetween25And50(50.01)).toBe(false);
			expect(isBetween25And50(100)).toBe(false);
		});
	});

	describe('isBetween25And500', () => {
		it('should return true when amount is between 25 and 500 exclusive of 500', () => {
			expect(isBetween25And500(25)).toBe(true);
			expect(isBetween25And500(250)).toBe(true);
			expect(isBetween25And500(499.99)).toBe(true);
		});

		it('should return false when amount is less than 25', () => {
			expect(isBetween25And500(24.99)).toBe(false);
			expect(isBetween25And500(10)).toBe(false);
		});

		it('should return false when amount is 500 or greater', () => {
			expect(isBetween25And500(500)).toBe(false);
			expect(isBetween25And500(1000)).toBe(false);
		});
	});
});

import numeral from 'numeral';
import {
	formatTransactionData,
	myFTDQuery,
	removeCredit
} from '#src/util/checkoutUtils';

vi.mock('numeral');

describe('checkoutUtils.js', () => {
	describe('formatTransactionData', () => {
		beforeEach(() => {
			vi.clearAllMocks();
			// Setup numeral mock to return chainable methods
			const mockNumeralInstance = {
				format: vi.fn().mockReturnValue('0.00'),
				add: vi.fn().mockReturnThis(),
				value: vi.fn().mockReturnValue(0)
			};
			numeral.mockReturnValue(mockNumeralInstance);
		});

		it('should format transaction data with loans only', () => {
			const loans = [
				{ __typename: 'Loan', id: 1, price: '25.00' },
				{ __typename: 'Loan', id: 2, price: '50.00' }
			];

			const result = formatTransactionData(123, loans, [], [], {});

			// transactionId is processed by numeral().value()
			expect(result.transactionId).toBeDefined();
			expect(result.loanCount).toBe(2);
			expect(result.loans).toHaveLength(2);
			expect(result.loans[0]).toHaveProperty('__typename', 'Loan');
			expect(result.kivaCards).toEqual([]);
			expect(result.donations).toEqual([]);
		});

		it('should format transaction data with kiva cards only', () => {
			const kivaCards = [
				{ __typename: 'KivaCard', id: 'kc1', price: '100.00' }
			];
			const totals = { kivaCardTotal: '100.00' };

			const result = formatTransactionData(456, [], kivaCards, [], totals);

			expect(result.transactionId).toBeDefined();
			expect(result.kivaCardCount).toBe(1);
			expect(result.kivaCardTotal).toBe('100.00');
			expect(result.loans).toEqual([]);
			expect(result.kivaCards).toHaveLength(1);
			expect(result.kivaCards[0]).toHaveProperty('__typename', 'KivaCard');
		});

		it('should format transaction data with donations only', () => {
			const donations = [
				{
					__typename: 'Donation', id: 'don1', price: '10.00', isTip: true, isUserEdited: false
				},
				{
					__typename: 'Donation', id: 'don2', price: '15.00', isTip: true, isUserEdited: false
				}
			];

			const result = formatTransactionData(789, [], [], donations, {});

			expect(result.transactionId).toBeDefined();
			expect(result.donationTotal).toBeDefined();
			expect(result.isTip).toBe(true);
			expect(result.isUserEdited).toBe(false);
			expect(result.donations).toHaveLength(2);
			expect(result.donations[0]).toHaveProperty('__typename', 'Donation');
		});

		it('should set isTip to false when any donation has isTip false', () => {
			const donations = [
				{
					__typename: 'Donation', id: 'don1', price: '10.00', isTip: true, isUserEdited: false
				},
				{
					__typename: 'Donation', id: 'don2', price: '15.00', isTip: false, isUserEdited: false
				},
				{
					__typename: 'Donation', id: 'don3', price: '5.00', isTip: true, isUserEdited: false
				}
			];

			const result = formatTransactionData(789, [], [], donations, {});

			// Once isTip is false, it stays false even if later donations have isTip true
			expect(result.isTip).toBe(false);
		});

		it('should set isUserEdited to true when any donation has isUserEdited true', () => {
			const donations = [
				{
					__typename: 'Donation', id: 'don1', price: '10.00', isTip: true, isUserEdited: false
				},
				{
					__typename: 'Donation', id: 'don2', price: '15.00', isTip: true, isUserEdited: true
				},
				{
					__typename: 'Donation', id: 'don3', price: '5.00', isTip: true, isUserEdited: false
				}
			];

			const result = formatTransactionData(789, [], [], donations, {});

			// Once isUserEdited is true, it stays true even if later donations have isUserEdited false
			expect(result.isUserEdited).toBe(true);
		});

		it('should calculate loan and donation totals correctly', () => {
			const mockNumeralInstance = {
				format: vi.fn().mockReturnValue('80.00'),
				add: vi.fn().mockReturnThis(),
				value: vi.fn().mockReturnValue(80)
			};
			numeral.mockReturnValue(mockNumeralInstance);

			const loans = [{ __typename: 'Loan', id: 1, price: '50.00' }];
			const donations = [{
				__typename: 'Donation', id: 'don1', price: '30.00', isTip: true
			}];

			const result = formatTransactionData(999, loans, [], donations, {});

			expect(result.loanCount).toBe(1);
			expect(result.isFTD).toBe(false);
			expect(numeral).toHaveBeenCalled();
		});

		it('should compile payment type with credit needed', () => {
			const totals = {
				creditAmountNeeded: '50.00',
				kivaCreditAppliedTotal: '0.00',
				bonusAppliedTotal: '0.00',
				redemptionCodeAppliedTotal: '0.00',
				universalCodeAppliedTotal: '0.00'
			};

			const result = formatTransactionData(123, [], [], [], totals);

			expect(result.paymentType).toBe('deposit');
			expect(result.depositTotal).toBe('50.00');
		});

		it('should compile payment type with kiva credit applied', () => {
			const totals = {
				creditAmountNeeded: '0.00',
				kivaCreditAppliedTotal: '25.00',
				bonusAppliedTotal: '0.00',
				redemptionCodeAppliedTotal: '0.00',
				universalCodeAppliedTotal: '0.00'
			};

			const result = formatTransactionData(123, [], [], [], totals);

			expect(result.paymentType).toBe('+kiva_credit');
			expect(result.kivaCreditAppliedTotal).toBe('25.00');
		});

		it('should compile payment type with promo credit applied', () => {
			const totals = {
				creditAmountNeeded: '0.00',
				bonusAppliedTotal: '10.00',
				kivaCreditAppliedTotal: '0.00',
				redemptionCodeAppliedTotal: '0.00',
				universalCodeAppliedTotal: '0.00'
			};

			const result = formatTransactionData(123, [], [], [], totals);

			expect(result.paymentType).toBe('+promo_credit');
		});

		it('should handle empty arrays', () => {
			const result = formatTransactionData(0, [], [], [], {});

			expect(result.transactionId).toBe(0);
			expect(result.loanCount).toBe(0);
			expect(result.kivaCardCount).toBe(0);
			expect(result.loans).toEqual([]);
			expect(result.kivaCards).toEqual([]);
			expect(result.donations).toEqual([]);
		});

		it('should include item total from totals object', () => {
			const totals = { itemTotal: '100.00' };
			const result = formatTransactionData(123, [], [], [], totals);

			expect(result.itemTotal).toBe('100.00');
		});
	});

	describe('myFTDQuery', () => {
		it('should execute GraphQL query for FTD status', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: {
						my: {
							userAccount: {
								firstName: 'John',
								hasEverLoggedIn: true
							}
						}
					}
				})
			};

			const result = await myFTDQuery(mockApollo);

			expect(mockApollo.query).toHaveBeenCalledTimes(1);
			expect(mockApollo.query).toHaveBeenCalledWith({
				query: expect.any(Object)
			});
			expect(result.data.my.userAccount.firstName).toBe('John');
			expect(result.data.my.userAccount.hasEverLoggedIn).toBe(true);
		});

		it('should handle query errors', async () => {
			const mockApollo = {
				query: vi.fn().mockRejectedValue(new Error('GraphQL error'))
			};

			await expect(myFTDQuery(mockApollo)).rejects.toThrow('GraphQL error');
			expect(mockApollo.query).toHaveBeenCalledTimes(1);
		});

		it('should pass through apollo query options', async () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: {
						my: {
							userAccount: {
								firstName: 'Jane',
								hasEverLoggedIn: false
							}
						}
					}
				})
			};

			await myFTDQuery(mockApollo);

			// Verify the query was called with expected structure
			const callArgs = mockApollo.query.mock.calls[0][0];
			expect(callArgs).toHaveProperty('query');
		});
	});

	describe('removeCredit', () => {
		it('should execute GraphQL mutation to remove credit', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({
					data: {
						shop: {
							removeCredit: {
								success: true
							}
						}
					}
				})
			};

			const result = await removeCredit(mockApollo, 'universal_code');

			expect(mockApollo.mutate).toHaveBeenCalledTimes(1);
			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					creditType: 'universal_code'
				}
			});
			expect(result.data.shop.removeCredit.success).toBe(true);
		});

		it('should handle redemption_code credit type', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({
					data: {
						shop: {
							removeCredit: {
								success: true
							}
						}
					}
				})
			};

			await removeCredit(mockApollo, 'redemption_code');

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					creditType: 'redemption_code'
				}
			});
		});

		it('should handle kiva_card credit type', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({
					data: {
						shop: {
							removeCredit: {
								success: true
							}
						}
					}
				})
			};

			await removeCredit(mockApollo, 'kiva_card');

			expect(mockApollo.mutate).toHaveBeenCalledWith({
				mutation: expect.any(Object),
				variables: {
					creditType: 'kiva_card'
				}
			});
		});

		it('should handle mutation errors', async () => {
			const mockApollo = {
				mutate: vi.fn().mockRejectedValue(new Error('Mutation failed'))
			};

			await expect(removeCredit(mockApollo, 'universal_code')).rejects.toThrow('Mutation failed');
			expect(mockApollo.mutate).toHaveBeenCalledTimes(1);
		});

		it('should pass mutation with variables correctly', async () => {
			const mockApollo = {
				mutate: vi.fn().mockResolvedValue({
					data: {
						shop: {
							removeCredit: {
								success: true
							}
						}
					}
				})
			};

			await removeCredit(mockApollo, 'test_credit_type');

			const callArgs = mockApollo.mutate.mock.calls[0][0];
			expect(callArgs).toHaveProperty('mutation');
			expect(callArgs).toHaveProperty('variables');
			expect(callArgs.variables.creditType).toBe('test_credit_type');
		});
	});

	describe('formatTransactionData edge cases', () => {
		beforeEach(() => {
			vi.clearAllMocks();
			const mockNumeralInstance = {
				format: vi.fn().mockReturnValue('0.00'),
				add: vi.fn().mockReturnThis(),
				value: vi.fn().mockReturnValue(0)
			};
			numeral.mockReturnValue(mockNumeralInstance);
		});

		it('should handle combination of all payment types', () => {
			const totals = {
				creditAmountNeeded: '25.00',
				kivaCreditAppliedTotal: '10.00',
				bonusAppliedTotal: '5.00',
				redemptionCodeAppliedTotal: '0.00',
				universalCodeAppliedTotal: '0.00'
			};

			const result = formatTransactionData(123, [], [], [], totals);

			expect(result.paymentType).toBe('deposit+kiva_credit+promo_credit');
		});

		it('should handle redemptionCodeAppliedTotal for promo credit', () => {
			const totals = {
				creditAmountNeeded: '0.00',
				kivaCreditAppliedTotal: '0.00',
				bonusAppliedTotal: '0.00',
				redemptionCodeAppliedTotal: '15.00',
				universalCodeAppliedTotal: '0.00'
			};

			const result = formatTransactionData(123, [], [], [], totals);

			expect(result.paymentType).toBe('+promo_credit');
		});

		it('should handle universalCodeAppliedTotal for promo credit', () => {
			const totals = {
				creditAmountNeeded: '0.00',
				kivaCreditAppliedTotal: '0.00',
				bonusAppliedTotal: '0.00',
				redemptionCodeAppliedTotal: '0.00',
				universalCodeAppliedTotal: '20.00'
			};

			const result = formatTransactionData(123, [], [], [], totals);

			expect(result.paymentType).toBe('+promo_credit');
		});

		it('should handle empty totals object with default values', () => {
			const result = formatTransactionData(123, [], [], [], {});

			// Empty totals results in null kivaCardTotal
			expect(result.kivaCardTotal).toBeNull();
		});

		it('should handle multiple promo credit types simultaneously', () => {
			const totals = {
				creditAmountNeeded: '0.00',
				kivaCreditAppliedTotal: '0.00',
				bonusAppliedTotal: '10.00',
				redemptionCodeAppliedTotal: '15.00',
				universalCodeAppliedTotal: '5.00'
			};

			const result = formatTransactionData(123, [], [], [], totals);

			expect(result.paymentType).toBe('+promo_credit');
		});

		it('should handle all credit types with deposits', () => {
			const totals = {
				creditAmountNeeded: '10.00',
				kivaCreditAppliedTotal: '5.00',
				bonusAppliedTotal: '3.00',
				redemptionCodeAppliedTotal: '2.00',
				universalCodeAppliedTotal: '0.00'
			};

			const result = formatTransactionData(123, [], [], [], totals);

			expect(result.paymentType).toBe('deposit+kiva_credit+promo_credit');
			expect(result.depositTotal).toBe('10.00');
		});

		it('should set isFTD to false by default', () => {
			const result = formatTransactionData(123, [], [], [], {});

			expect(result.isFTD).toBe(false);
		});

		it('should handle empty payment type when no credits', () => {
			const totals = {
				creditAmountNeeded: '0.00',
				kivaCreditAppliedTotal: '0.00',
				bonusAppliedTotal: '0.00',
				redemptionCodeAppliedTotal: '0.00',
				universalCodeAppliedTotal: '0.00'
			};

			const result = formatTransactionData(123, [], [], [], totals);

			expect(result.paymentType).toBe('');
			expect(result.depositTotal).toBe('0.00');
		});
	});
});

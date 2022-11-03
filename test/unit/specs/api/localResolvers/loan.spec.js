import { add, formatISO } from 'date-fns';
import loanResolverFactory from '@/api/localResolvers/loan';

describe('loan.js', () => {
	describe('LoanBasic.fundraisingPercent', () => {
		function testFundraisingPercent({ loan, expected }) {
			const { typePolicies } = loanResolverFactory();
			const result = typePolicies.LoanPartner.fundraisingPercent(loan);
			expect(result).toBe(expected);
		}

		it('Exports the same resolver for LoanDirect and LoanPartner', () => {
			const { typePolicies } = loanResolverFactory();
			expect(typePolicies.LoanDirect.fundraisingPercent).toBe(typePolicies.LoanPartner.fundraisingPercent);
		});

		it('Returns the percent funded and reserved amount of the total loan amount', () => {
			testFundraisingPercent({
				loan: {
					loanAmount: '1000.00',
					loanFundraisingInfo: {
						fundedAmount: '225.00',
						reservedAmount: '25.00'
					},
				},
				expected: 0.25,
			});
			testFundraisingPercent({
				loan: {
					loanAmount: '1000.00',
					loanFundraisingInfo: {
						fundedAmount: '100.00',
						reservedAmount: '25.00'
					},
				},
				expected: 0.125,
			});
			testFundraisingPercent({
				loan: {
					loanAmount: '1000.00',
					loanFundraisingInfo: {
						fundedAmount: '900.00',
						reservedAmount: '0.00'
					},
				},
				expected: 0.9,
			});
			testFundraisingPercent({
				loan: {
					loanAmount: '100.00',
					loanFundraisingInfo: {
						fundedAmount: '90.00',
						reservedAmount: '10.00'
					},
				},
				expected: 1,
			});
		});

		it('Always returns a number >= 0 and <= 1', () => {
			testFundraisingPercent({
				loan: {
					loanAmount: '100.00',
					loanFundraisingInfo: {
						fundedAmount: '-25.00',
						reservedAmount: '-25.00'
					},
				},
				expected: 0,
			});
			testFundraisingPercent({
				loan: {
					loanAmount: '100.00',
					loanFundraisingInfo: {
						fundedAmount: '75.00',
						reservedAmount: '75.00'
					},
				},
				expected: 1,
			});
		});

		it('Returns 1 if loan amount is zero', () => {
			testFundraisingPercent({
				loan: {
					loanAmount: '0.00',
					loanFundraisingInfo: {
						fundedAmount: '25.00',
						reservedAmount: '25.00'
					},
				},
				expected: 1,
			});
		});

		it('Returns 1 if loan is over-reserved', () => {
			testFundraisingPercent({
				loan: {
					loanAmount: '200.00',
					loanFundraisingInfo: {
						fundedAmount: '185.00',
						reservedAmount: '20.00'
					},
				},
				expected: 1,
			});
		});

		describe('Returns 0 if required fields are missing', () => {
			function testConsoleError(field) {
				expect(console.error.mock.calls.length).toBe(1);
				expect(console.error.mock.calls[0][0]).toEqual(
					expect.stringContaining(`'${field}' for LoanBasic.fundraisingPercent`)
				);
			}

			const originalError = console.error;
			beforeEach(() => {
				console.error = jest.fn();
			});

			afterEach(() => {
				console.error = originalError;
			});

			it('loanAmount missing', () => {
				testFundraisingPercent({
					loan: {
						loanFundraisingInfo: {
							fundedAmount: '25.00',
							reservedAmount: '25.00',
						},
					},
					expected: 0,
				});
				testConsoleError('loanAmount');
			});

			it('fundedAmount missing', () => {
				testFundraisingPercent({
					loan: {
						loanAmount: '100.00',
						loanFundraisingInfo: {
							reservedAmount: '25.00'
						},
					},
					expected: 0,
				});
				testConsoleError('loanFundraisingInfo.fundedAmount');
			});

			it('reservedAmount missing', () => {
				testFundraisingPercent({
					loan: {
						loanAmount: '100.00',
						loanFundraisingInfo: {
							fundedAmount: '25.00',
						},
					},
					expected: 0,
				});
				testConsoleError('loanFundraisingInfo.reservedAmount');
			});
		});
	});

	describe('LoanBasic.fundraisingTimeLeft', () => {
		function testFundraisingTimeLeft({ loan, expected }) {
			const { typePolicies } = loanResolverFactory();
			const result = typePolicies.LoanPartner.fundraisingTimeLeft(loan);
			expect(result).toBe(expected);
		}

		it('Exports the same resolver for LoanDirect and LoanPartner', () => {
			const { typePolicies } = loanResolverFactory();
			expect(typePolicies.LoanDirect.fundraisingTimeLeft).toBe(typePolicies.LoanPartner.fundraisingTimeLeft);
		});

		it('Returns the time remaining before expiration in milliseconds', () => {
			const now = new Date();
			const tenMinutes = add(now, { minutes: 10 });
			const twoHours = add(now, { hours: 2 });
			const fiveDays = add(now, { days: 5 });
			const fourtyDays = add(now, { days: 40 });

			testFundraisingTimeLeft({
				loan: { plannedExpirationDate: formatISO(tenMinutes) },
				expected: '10 minutes',
			});
			testFundraisingTimeLeft({
				loan: { plannedExpirationDate: formatISO(twoHours) },
				expected: '2 hours',
			});
			testFundraisingTimeLeft({
				loan: { plannedExpirationDate: formatISO(fiveDays) },
				expected: '5 days',
			});
			testFundraisingTimeLeft({
				loan: {
					plannedExpirationDate: formatISO(fourtyDays)
				},
				expected: '40 days',
			});
		});

		it('Returns an empty string if plannedExpirationDate is not a valid date', () => {
			testFundraisingTimeLeft({
				loan: { plannedExpirationDate: 'not a date' },
				expected: '',
			});
		});

		it('Returns an empty string if plannedExpirationDate is missing', () => {
			const originalError = console.error;
			console.error = jest.fn();

			testFundraisingTimeLeft({ loan: {}, expected: '' });
			expect(console.error.mock.calls.length).toBe(1);
			expect(console.error.mock.calls[0][0]).toEqual(
				expect.stringContaining('\'plannedExpirationDate\' for LoanBasic.fundraisingTimeLeft')
			);

			console.error = originalError;
		});
	});

	describe('LoanBasic.fundraisingTimeLeftMilliseconds', () => {
		function testFundraisingTimeLeftMilliseconds({ loan, expected }) {
			const { typePolicies } = loanResolverFactory();
			const result = typePolicies.LoanPartner.fundraisingTimeLeftMilliseconds(loan);
			expect(result).toBeCloseTo(expected, -4);
		}

		it('Exports the same resolver for LoanDirect and LoanPartner', () => {
			const { typePolicies } = loanResolverFactory();
			expect(typePolicies.LoanDirect.fundraisingTimeLeftMilliseconds)
				.toBe(typePolicies.LoanPartner.fundraisingTimeLeftMilliseconds);
		});

		it('Returns the time remaining before expiration in milliseconds', () => {
			const now = new Date();
			const tenMinutes = add(now, { minutes: 10 });
			const twoHours = add(now, { hours: 2 });
			const fiveDays = add(now, { hours: 120 });

			testFundraisingTimeLeftMilliseconds({
				loan: { plannedExpirationDate: formatISO(tenMinutes) },
				expected: 10 * 60000,
			});
			testFundraisingTimeLeftMilliseconds({
				loan: { plannedExpirationDate: formatISO(twoHours) },
				expected: 120 * 60000,
			});
			testFundraisingTimeLeftMilliseconds({
				loan: { plannedExpirationDate: formatISO(fiveDays) },
				expected: 1440 * 5 * 60000, // 5 days in milliseconds
			});
		});

		it('Returns an empty string if plannedExpirationDate is not a valid date', () => {
			const { typePolicies } = loanResolverFactory();
			const result = typePolicies.LoanPartner.fundraisingTimeLeftMilliseconds(
				{ plannedExpirationDate: 'not a date' }
			);
			expect(result).toBe('');
		});

		it('Returns an empty string if plannedExpirationDate is missing', () => {
			const originalError = console.error;
			console.error = jest.fn();

			const { typePolicies } = loanResolverFactory();
			const result = typePolicies.LoanPartner.fundraisingTimeLeftMilliseconds({});
			expect(result).toBe('');

			expect(console.error.mock.calls.length).toBe(1);
			expect(console.error.mock.calls[0][0]).toEqual(
				expect.stringContaining('\'plannedExpirationDate\' for LoanBasic.fundraisingTimeLeftMilliseconds')
			);

			console.error = originalError;
		});
	});

	describe('LoanBasic.unreservedAmount', () => {
		function testUnreservedAmount({ loan, expected }) {
			const { typePolicies } = loanResolverFactory();
			const result = typePolicies.LoanPartner.unreservedAmount(loan);
			expect(result).toBe(expected);
		}

		it('Exports the same resolver for LoanDirect and LoanPartner', () => {
			const { typePolicies } = loanResolverFactory();
			expect(typePolicies.LoanDirect.unreservedAmount).toBe(typePolicies.LoanPartner.unreservedAmount);
		});

		it('Returns the unreserved amount for this loan as a string', () => {
			testUnreservedAmount({
				loan: {
					loanAmount: '1000.00',
					loanFundraisingInfo: {
						fundedAmount: '225.00',
						reservedAmount: '25.00'
					},
				},
				expected: '750.00',
			});
			testUnreservedAmount({
				loan: {
					loanAmount: '1000.00',
					loanFundraisingInfo: {
						fundedAmount: '100.00',
						reservedAmount: '25.00'
					},
				},
				expected: '875.00',
			});
			testUnreservedAmount({
				loan: {
					loanAmount: '1000.00',
					loanFundraisingInfo: {
						fundedAmount: '900.00',
						reservedAmount: '0.00'
					},
				},
				expected: '100.00',
			});
			testUnreservedAmount({
				loan: {
					loanAmount: '100.00',
					loanFundraisingInfo: {
						fundedAmount: '90.00',
						reservedAmount: '10.00'
					},
				},
				expected: '0.00',
			});
		});

		it('Returns the 0.00 if loan is over-reserved', () => {
			testUnreservedAmount({
				loan: {
					loanAmount: '200.00',
					loanFundraisingInfo: {
						fundedAmount: '185.00',
						reservedAmount: '20.00'
					},
				},
				expected: '0.00',
			});
		});

		describe('Returns "0.00" if required fields are missing', () => {
			function testConsoleError(field) {
				expect(console.error.mock.calls.length).toBe(1);
				expect(console.error.mock.calls[0][0]).toEqual(
					expect.stringContaining(`'${field}' for LoanBasic.unreservedAmount`)
				);
			}

			const originalError = console.error;
			beforeEach(() => {
				console.error = jest.fn();
			});

			afterEach(() => {
				console.error = originalError;
			});

			it('loanAmount missing', () => {
				testUnreservedAmount({
					loan: {
						loanFundraisingInfo: {
							fundedAmount: '25.00',
							reservedAmount: '25.00',
						},
					},
					expected: '0.00',
				});
				testConsoleError('loanAmount');
			});

			it('fundedAmount missing', () => {
				testUnreservedAmount({
					loan: {
						loanAmount: '100.00',
						loanFundraisingInfo: {
							reservedAmount: '25.00'
						},
					},
					expected: '0.00',
				});
				testConsoleError('loanFundraisingInfo.fundedAmount');
			});

			it('reservedAmount missing', () => {
				testUnreservedAmount({
					loan: {
						loanAmount: '100.00',
						loanFundraisingInfo: {
							fundedAmount: '25.00',
						},
					},
					expected: '0.00',
				});
				testConsoleError('loanFundraisingInfo.reservedAmount');
			});
		});
	});
});

import {
	DELINQUENT,
	FUTURE,
	PARTIAL,
	REPAID,
	actualAmountLabel,
	buildAdvancedPeriods,
	buildDirectInstallmentRows,
	buildPartnerPeriodRows,
	currencyLossNote,
	formatLocalAmount,
	formatUsd,
	isDualStatementLoan,
	repaymentIntro,
} from '#src/util/repaymentSchedule';

// Pacific-midnight instants, as the API serializes them.
const NOW = new Date('2020-06-15T12:00:00Z');
const PAST_DUE_DATE = '2020-03-01T08:00:00Z';
const FUTURE_DUE_DATE = '2020-09-01T07:00:00Z';

function makePeriod(overrides = {}) {
	return {
		dueDate: PAST_DUE_DATE,
		status: REPAID,
		delinquencyAttribution: '',
		expectedAmountToLenders: '265.83',
		actualAmountToLenders: '265.83',
		currencyLossToLenders: null,
		expectedRepayments: [],
		actualRepayments: [],
		...overrides,
	};
}

describe('repaymentSchedule', () => {
	describe('formatUsd', () => {
		it.each([
			['265.83', '$265.83'],
			['1565.75', '$1,565.75'],
			[0, '$0.00'],
		])('formats %s as %s', (amount, expected) => {
			expect(formatUsd(amount)).toBe(expected);
		});
	});

	describe('formatLocalAmount', () => {
		it('prefixes the amount with the loan currency', () => {
			expect(formatLocalAmount('12345.6', 'KES')).toBe('KES 12,345.60');
		});

		it('returns an empty string when there is no amount', () => {
			expect(formatLocalAmount(null, 'KES')).toBe('');
		});
	});

	describe('actualAmountLabel', () => {
		it('shows the settled amount when the period received one', () => {
			const period = makePeriod({ actualAmountToLenders: '265.83' });

			expect(actualAmountLabel(period, NOW)).toBe('$265.83');
		});

		it('shows $0.00 when a past period received nothing', () => {
			const period = makePeriod({
				status: DELINQUENT,
				actualAmountToLenders: null,
				dueDate: PAST_DUE_DATE,
			});

			expect(actualAmountLabel(period, NOW)).toBe('$0.00');
		});

		it('shows the availability date when the period is still to come', () => {
			const period = makePeriod({
				status: FUTURE,
				actualAmountToLenders: null,
				dueDate: FUTURE_DUE_DATE,
			});

			expect(actualAmountLabel(period, NOW)).toBe('Available Sep 1');
		});

		it('shows $0.00 for a future-status period whose due date has already passed', () => {
			const period = makePeriod({
				status: FUTURE,
				actualAmountToLenders: null,
				dueDate: PAST_DUE_DATE,
			});

			expect(actualAmountLabel(period, NOW)).toBe('$0.00');
		});
	});

	describe('currencyLossNote', () => {
		it('describes the amount lost to devaluation', () => {
			expect(currencyLossNote('12.34')).toBe('$12.34 lost to currency devaluation');
		});

		it('returns an empty string when the period lost nothing', () => {
			expect(currencyLossNote(null)).toBe('');
		});
	});

	describe('buildPartnerPeriodRows', () => {
		it('builds a row per period with its label, amounts and status', () => {
			const rows = buildPartnerPeriodRows([
				makePeriod({ dueDate: PAST_DUE_DATE, status: REPAID }),
				makePeriod({
					dueDate: '2020-04-01T07:00:00Z',
					status: DELINQUENT,
					actualAmountToLenders: null,
					delinquencyAttribution: 'Lending partner behind in repayment',
					currencyLossToLenders: '12.34',
				}),
				makePeriod({
					dueDate: FUTURE_DUE_DATE,
					status: FUTURE,
					actualAmountToLenders: null,
				}),
			], NOW);

			expect(rows).toEqual([
				{
					dueDate: PAST_DUE_DATE,
					periodLabel: 'Mar 2020',
					expected: '$265.83',
					actual: '$265.83',
					status: REPAID,
				},
				{
					dueDate: '2020-04-01T07:00:00Z',
					periodLabel: 'Apr 2020',
					expected: '$265.83',
					actual: '$0.00',
					status: DELINQUENT,
				},
				{
					dueDate: FUTURE_DUE_DATE,
					periodLabel: 'Sep 2020',
					expected: '$265.83',
					actual: 'Available Sep 1',
					status: FUTURE,
				},
			]);
		});

		it('shows $0.00 expected when a period has no expected repayment', () => {
			const rows = buildPartnerPeriodRows([makePeriod({ expectedAmountToLenders: null })], NOW);

			expect(rows[0].expected).toBe('$0.00');
		});

		it('returns no rows when the viewer may not see the schedule', () => {
			expect(buildPartnerPeriodRows([], NOW)).toEqual([]);
		});
	});

	describe('isDualStatementLoan', () => {
		it.each([
			['a note', 'Important note about this loan', true],
			['null', null, false],
			['an empty string', '', false],
		])('is %s → %s', (_label, note, expected) => {
			expect(isDualStatementLoan(note)).toBe(expected);
		});
	});

	describe('buildAdvancedPeriods', () => {
		it('pairs each expected repayment with the recorded one beside it', () => {
			const period = makePeriod({
				expectedRepayments: [
					{ effectiveDate: '2020-03-01T08:00:00Z', amount: '10000' },
					{ effectiveDate: '2020-03-15T07:00:00Z', amount: '5000' },
				],
				actualRepayments: [
					{ effectiveDate: '2020-03-20T07:00:00Z', amount: '14500' },
				],
			});

			const [advanced] = buildAdvancedPeriods([period], 'KES', NOW);

			expect(advanced.borrowerRows).toEqual([
				{
					expectedDate: 'Mar 1, 2020',
					expectedAmount: 'KES 10,000.00',
					actualDate: 'Mar 20, 2020',
					actualAmount: 'KES 14,500.00',
				},
				{
					expectedDate: 'Mar 15, 2020',
					expectedAmount: 'KES 5,000.00',
					actualDate: '',
					actualAmount: '',
				},
			]);
		});

		it('runs the rows out to whichever side has more repayments', () => {
			const period = makePeriod({
				expectedRepayments: [{ effectiveDate: '2020-03-01T08:00:00Z', amount: '10000' }],
				actualRepayments: [
					{ effectiveDate: '2020-03-05T08:00:00Z', amount: '6000' },
					{ effectiveDate: '2020-03-20T07:00:00Z', amount: '4000' },
				],
			});

			const [advanced] = buildAdvancedPeriods([period], 'KES', NOW);

			expect(advanced.borrowerRows).toHaveLength(2);
			expect(advanced.borrowerRows[1]).toEqual({
				expectedDate: '',
				expectedAmount: '',
				actualDate: 'Mar 20, 2020',
				actualAmount: 'KES 4,000.00',
			});
		});

		it('repeats the period due date as the actual date once the period is settled', () => {
			const [advanced] = buildAdvancedPeriods([makePeriod({ status: REPAID })], 'KES', NOW);

			expect(advanced.lenderRow).toEqual({
				expectedDate: 'Mar 1, 2020',
				expectedAmount: '$265.83',
				actualDate: 'Mar 1, 2020',
				actualAmount: '$265.83',
				attribution: '',
			});
		});

		it('reports when an upcoming period becomes available, as the simple table does', () => {
			const period = makePeriod({
				status: FUTURE,
				dueDate: FUTURE_DUE_DATE,
				actualAmountToLenders: null,
			});

			const [advanced] = buildAdvancedPeriods([period], 'KES', NOW);

			expect(advanced.lenderRow.actualDate).toBe('');
			expect(advanced.lenderRow.actualAmount).toBe('Available Sep 1');
		});

		it('carries the delinquency attribution onto the lender row', () => {
			const period = makePeriod({
				status: DELINQUENT,
				delinquencyAttribution: 'Entrepreneur behind in repayment',
				actualAmountToLenders: null,
			});

			const [advanced] = buildAdvancedPeriods([period], 'KES', NOW);

			expect(advanced.lenderRow.attribution).toBe('Entrepreneur behind in repayment');
			expect(advanced.lenderRow.actualAmount).toBe('$0.00');
		});

		it('carries the period label, status and currency-loss note', () => {
			const period = makePeriod({
				status: DELINQUENT,
				delinquencyAttribution: 'Lending partner behind in repayment',
				currencyLossToLenders: '12.34',
			});

			const [advanced] = buildAdvancedPeriods([period], 'KES');

			expect(advanced.periodLabel).toBe('Mar 2020');
			expect(advanced.status).toBe(DELINQUENT);
			expect(advanced.currencyLoss).toBe('$12.34 lost to currency devaluation');
		});

		it('handles a period with no repayments on either side', () => {
			const [advanced] = buildAdvancedPeriods([makePeriod()], 'KES');

			expect(advanced.borrowerRows).toEqual([]);
		});
	});

	describe('buildDirectInstallmentRows', () => {
		it('labels each installment with its legacy status wording', () => {
			const rows = buildDirectInstallmentRows([
				{
					dueDate: '2015-03-01T08:00:00Z', amount: '208.33', amountPaid: '208.33', status: REPAID,
				},
				{
					dueDate: '2015-04-01T07:00:00Z', amount: '208.33', amountPaid: '91.71', status: PARTIAL,
				},
				{
					dueDate: '2015-05-01T07:00:00Z', amount: '208.33', amountPaid: null, status: FUTURE,
				},
			], 'USD');

			expect(rows).toEqual([
				{
					dueDate: '2015-03-01T08:00:00Z',
					amountDue: 'USD 208.33',
					amountPaid: 'USD 208.33',
					dueFromBorrower: 'Mar 1, 2015',
					statusLabel: 'Paid',
				},
				{
					dueDate: '2015-04-01T07:00:00Z',
					amountDue: 'USD 208.33',
					amountPaid: 'USD 91.71',
					dueFromBorrower: 'Apr 1, 2015',
					statusLabel: 'Partial Payment',
				},
				{
					dueDate: '2015-05-01T07:00:00Z',
					amountDue: 'USD 208.33',
					amountPaid: '',
					dueFromBorrower: 'May 1, 2015',
					statusLabel: 'Not Paid',
				},
			]);
		});

		it('returns no rows before the loan is disbursed', () => {
			expect(buildDirectInstallmentRows([], 'USD')).toEqual([]);
		});
	});

	describe('repaymentIntro', () => {
		const partnerLoan = { hasFirstRepaymentDate: true, isPartnerLoan: true };
		const directLoan = { hasFirstRepaymentDate: true, isPartnerLoan: false };

		it.each([
			['fundraising', 'begin', ''],
			['raised', 'begin', ''],
			['payingBack', 'began', 'on track'],
			['ended', 'began', 'complete'],
		])('describes a %s loan as "%s ... %s"', (status, tense, clause) => {
			expect(repaymentIntro(status, partnerLoan)).toEqual({
				tense,
				preposition: 'in',
				clause,
				followUp: '',
			});
		});

		it('calls out a delinquent loan that is paying back', () => {
			expect(repaymentIntro('payingBack', { ...partnerLoan, delinquent: true })).toEqual({
				tense: 'began',
				preposition: 'in',
				clause: 'delinquent',
				followUp: '',
			});
		});

		it('follows a defaulted loan with its own sentence', () => {
			expect(repaymentIntro('defaulted', partnerLoan)).toEqual({
				tense: 'began',
				preposition: 'in',
				clause: '',
				followUp: 'This loan ended in default.',
			});
		});

		it.each(['expired', 'refunded', 'reviewed', 'inactive', 'deleted'])(
			'says nothing about a %s loan',
			status => {
				expect(repaymentIntro(status, partnerLoan)).toBeNull();
			},
		);

		it('says "on" for a direct loan, whose installments are dated', () => {
			expect(repaymentIntro('payingBack', directLoan).preposition).toBe('on');
		});

		it('says nothing when the loan has no first repayment date', () => {
			expect(repaymentIntro('payingBack', { hasFirstRepaymentDate: false })).toBeNull();
		});
	});

	describe('a period with no due date', () => {
		it('labels the period with nothing instead of throwing', () => {
			const rows = buildPartnerPeriodRows([makePeriod({ dueDate: null })], NOW);

			expect(rows[0].periodLabel).toBe('');
			expect(rows[0].expected).toBe('$265.83');
		});

		it('falls back to $0.00 rather than an availability date', () => {
			const period = makePeriod({ dueDate: null, status: FUTURE, actualAmountToLenders: null });

			expect(actualAmountLabel(period, NOW)).toBe('$0.00');
		});

		it('leaves the advanced view dates blank instead of throwing', () => {
			const [advanced] = buildAdvancedPeriods([makePeriod({ dueDate: null })], 'KES');

			expect(advanced.periodLabel).toBe('');
			expect(advanced.lenderRow.expectedDate).toBe('');
		});
	});
});

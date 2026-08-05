import { render, fireEvent, waitFor } from '@testing-library/vue';
import RepaymentSchedule from '#src/components/BorrowerProfile/RepaymentSchedule';
import { globalOptions } from '../../../specUtils';

const stubs = {
	KvLightbox: {
		template: '<div v-if="visible" data-testid="repayment-lightbox"><slot></slot></div>',
		props: ['visible', 'title'],
		emits: ['lightbox-closed'],
	},
};

// Pacific-midnight instants, as the API serializes them.
const REPAID_PERIOD = {
	dueDate: '2017-09-01T07:00:00Z',
	status: 'repaid',
	delinquencyAttribution: '',
	expectedAmountToLenders: '265.83',
	actualAmountToLenders: '265.83',
	currencyLossToLenders: null,
	expectedRepayments: [
		{ effectiveDate: '2017-09-01T07:00:00Z', amount: '10000' },
		{ effectiveDate: '2017-09-15T07:00:00Z', amount: '5000' },
	],
	actualRepayments: [
		{ effectiveDate: '2017-09-20T07:00:00Z', amount: '14500' },
	],
};

const DELINQUENT_PERIOD = {
	dueDate: '2017-10-01T07:00:00Z',
	status: 'delinquent',
	delinquencyAttribution: 'Lending partner behind in repayment',
	expectedAmountToLenders: '265.84',
	actualAmountToLenders: null,
	currencyLossToLenders: '12.34',
};

const FUTURE_PERIOD = {
	dueDate: '2999-09-01T07:00:00Z',
	status: 'future',
	delinquencyAttribution: '',
	expectedAmountToLenders: '265.83',
	actualAmountToLenders: null,
	currencyLossToLenders: null,
};

function partnerLoan(repayments, { dualStatementNote = null, delinquent = false } = {}) {
	return {
		id: 423481,
		dualStatementNote,
		delinquent,
		repaymentInterval: 'Monthly',
		lenderRepaymentTerm: 43,
		paidAmount: '1000.00',
		loanAmount: '15950.00',
		terms: {
			currency: 'KES',
			disbursalDate: '2012-06-07T07:00:00Z',
			lenderRepaymentTerm: 43,
			expectedPayments: [],
		},
		partner: { id: 218, name: 'Test Partner' },
		repayments,
	};
}

function directLoan(repayments) {
	return {
		id: 1085354,
		repaymentInterval: 'Monthly',
		lenderRepaymentTerm: 24,
		loanAmount: '5000.00',
		terms: {
			currency: 'USD',
			disbursalDate: '2015-01-29T08:00:00Z',
			lenderRepaymentTerm: 24,
		},
		partner: null,
		repayments,
	};
}

async function renderRepaymentSchedule({ loan, status = 'payingBack' }) {
	const result = render(RepaymentSchedule, {
		global: {
			...globalOptions,
			provide: {
				...globalOptions.provide,
				apollo: {
					...globalOptions.provide.apollo,
					query: () => Promise.resolve({ data: { lend: { loan } } }),
				},
			},
			stubs,
		},
		props: { loanId: loan.id, status },
	});

	await fireEvent.click(result.getByTestId('bp-loan-detail-full-repayment-schedule-lightbox-btn'));

	return result;
}

// Collapses the rendered whitespace the way a browser does, so the intro sentence
// can be asserted as the reader sees it.
function visibleText(element) {
	return element.textContent.replace(/\s+/g, ' ').trim();
}

describe('RepaymentSchedule', () => {
	it('click trigger opens repayment schedule lightbox', async () => {
		const { getByTestId, queryByTestId } = render(RepaymentSchedule, {
			global: { ...globalOptions, stubs },
			props: { loanId: 123, status: 'fundraising' },
		});

		expect(queryByTestId('repayment-lightbox')).toBeNull();

		await fireEvent.click(getByTestId('bp-loan-detail-full-repayment-schedule-lightbox-btn'));

		expect(getByTestId('repayment-lightbox')).toBeTruthy();
	});

	it('waits for the schedule rather than showing pre-disbursal copy in its place', async () => {
		// The lightbox opens before the query lands. Both content branches turn on loan
		// type, which reads as an undisbursed direct loan until the response arrives.
		let resolveQuery;
		const pending = new Promise(resolve => { resolveQuery = resolve; });
		const loan = partnerLoan([REPAID_PERIOD]);

		const { getByTestId, queryByText, findByText } = render(RepaymentSchedule, {
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					apollo: { ...globalOptions.provide.apollo, query: () => pending },
				},
				stubs,
			},
			props: { loanId: loan.id, status: 'payingBack' },
		});

		await fireEvent.click(getByTestId('bp-loan-detail-full-repayment-schedule-lightbox-btn'));

		expect(getByTestId('bp-repayment-schedule-loading')).toBeTruthy();
		expect(queryByText(/This loan is for/)).toBeNull();

		resolveQuery({ data: { lend: { loan } } });

		expect(await findByText('Comments')).toBeTruthy();
	});

	it('asks for the schedule only once the lightbox is opened', async () => {
		const query = vi.fn(() => Promise.resolve({ data: { lend: { loan: partnerLoan([REPAID_PERIOD]) } } }));

		const { getByTestId, findByText } = render(RepaymentSchedule, {
			global: {
				...globalOptions,
				provide: { ...globalOptions.provide, apollo: { ...globalOptions.provide.apollo, query } },
				stubs,
			},
			props: { loanId: 423481, status: 'payingBack' },
		});

		expect(query).not.toHaveBeenCalled();

		await fireEvent.click(getByTestId('bp-loan-detail-full-repayment-schedule-lightbox-btn'));
		await findByText('Comments');

		expect(query).toHaveBeenCalledTimes(1);
	});

	it('reports each period with its expected amount, actual amount and comment', async () => {
		const { findByText, findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD]),
		});

		expect(await findByText('Expected')).toBeTruthy();
		expect(await findByText('Actual')).toBeTruthy();
		expect(await findByText('Comments')).toBeTruthy();
		expect((await findAllByText('Sep 2017')).length).toBeGreaterThan(0);
		expect((await findAllByText('$265.83')).length).toBeGreaterThan(0);
		expect((await findAllByText('Repayment received')).length).toBeGreaterThan(0);
	});

	it('marks a repaid period with the amount that settled', async () => {
		const { findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD]),
		});

		expect((await findAllByText('$265.83')).length).toBeGreaterThan(0);
		expect((await findAllByText('Repayment received')).length).toBeGreaterThan(0);
	});

	it('reports $0.00 and a delinquent marker for a past period that received nothing', async () => {
		const { findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([DELINQUENT_PERIOD]),
		});

		expect((await findAllByText('$0.00')).length).toBeGreaterThan(0);
		expect((await findAllByText('Delinquent')).length).toBeGreaterThan(0);
	});

	// The simple table carries only the received, delinquent or attribution marker; the
	// currency-loss note belongs to the advanced view.
	it('leaves the currency-loss note out of the simple table', async () => {
		const { findAllByText, queryByText } = await renderRepaymentSchedule({
			loan: partnerLoan([DELINQUENT_PERIOD]),
		});

		await findAllByText('Delinquent');

		expect(queryByText('$12.34 lost to currency devaluation')).toBeNull();
	});

	it('reports when an upcoming period becomes available instead of an amount', async () => {
		const { findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([FUTURE_PERIOD]),
		});

		expect((await findAllByText('Available Sep 1')).length).toBeGreaterThan(0);
	});

	it('attributes a delinquency when the period carries no received or delinquent marker', async () => {
		const attributedPeriod = {
			...FUTURE_PERIOD,
			delinquencyAttribution: 'Entrepreneur behind in repayment',
		};

		const { findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([attributedPeriod]),
		});

		expect((await findAllByText('Entrepreneur behind in repayment')).length).toBeGreaterThan(0);
	});

	it('takes each period status from the server rather than deriving it', async () => {
		const { findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD, DELINQUENT_PERIOD, FUTURE_PERIOD]),
		});

		// The repaid period stays repaid even though the loan is only partly paid back.
		expect((await findAllByText('Repayment received')).length).toBeGreaterThan(0);
		expect((await findAllByText('Delinquent')).length).toBeGreaterThan(0);
		expect((await findAllByText('Available Sep 1')).length).toBeGreaterThan(0);
	});

	it('spaces the intro sentence when the loan is paying back', async () => {
		const { getByTestId } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD, DELINQUENT_PERIOD], { delinquent: true }),
		});

		await waitFor(() => {
			expect(visibleText(getByTestId('repayment-lightbox')))
				.toContain('Repayments began in Sep 2017 and are delinquent.');
		});
	});

	it('takes the intro status from the loan rather than its periods', async () => {
		const { getByTestId } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD, DELINQUENT_PERIOD], { delinquent: false }),
		});

		await waitFor(() => {
			expect(visibleText(getByTestId('repayment-lightbox')))
				.toContain('Repayments began in Sep 2017 and are on track.');
		});
	});

	it('describes a repaid loan in the past tense', async () => {
		const { getByTestId } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD]),
			status: 'ended',
		});

		await waitFor(() => {
			expect(visibleText(getByTestId('repayment-lightbox')))
				.toContain('Repayments began in Sep 2017 and are complete.');
		});
	});

	it('follows a defaulted loan with its own sentence', async () => {
		const { getByTestId } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD]),
			status: 'defaulted',
		});

		await waitFor(() => {
			expect(visibleText(getByTestId('repayment-lightbox')))
				.toContain('Repayments began in Sep 2017. This loan ended in default.');
		});
	});

	it('says nothing about repayments on an expired loan', async () => {
		const { getByTestId, findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD]),
			status: 'expired',
		});

		await findAllByText('Repayment received');

		expect(visibleText(getByTestId('repayment-lightbox'))).not.toContain('Repayments');
	});

	// payingBack has wording, so only the missing schedule can silence the sentence.
	it('says nothing when the loan has no schedule, rather than printing a placeholder', async () => {
		const { getByTestId, findByText } = await renderRepaymentSchedule({
			loan: partnerLoan([]),
			status: 'payingBack',
		});

		await findByText('Show advanced');

		const text = visibleText(getByTestId('repayment-lightbox'));
		expect(text).not.toContain('Repayments');
		expect(text).not.toContain('false');
	});

	it('offers an advanced view for a partner loan', async () => {
		const { findByTestId } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD]),
		});

		const toggle = await findByTestId('bp-repayment-advanced-toggle');

		expect(toggle.textContent.trim()).toBe('Show advanced');
	});

	it('swaps the simple table for the advanced view and back', async () => {
		const { findByTestId, findAllByText, queryByText } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD]),
		});

		const toggle = await findByTestId('bp-repayment-advanced-toggle');
		await fireEvent.click(toggle);

		expect((await findAllByText('From borrower to partner')).length).toBeGreaterThan(0);
		expect(toggle.textContent.trim()).toBe('Hide advanced');

		await fireEvent.click(toggle);

		expect(queryByText('From borrower to partner')).toBeNull();
		expect(toggle.textContent.trim()).toBe('Show advanced');
	});

	it('hides the advanced view for a dual-statement loan', async () => {
		const { queryByTestId, findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD], { dualStatementNote: 'Important note about this loan' }),
		});

		await findAllByText('Repayment received');

		expect(queryByTestId('bp-repayment-advanced-toggle')).toBeNull();
	});

	it('lists expected and recorded borrower repayments separately in the advanced view', async () => {
		const { findByTestId, findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD]),
		});

		await fireEvent.click(await findByTestId('bp-repayment-advanced-toggle'));

		// Two expected repayments and one recorded one, each on its own row rather than zipped.
		expect((await findAllByText('KES 10,000.00')).length).toBe(1);
		expect((await findAllByText('KES 5,000.00')).length).toBe(1);
		expect((await findAllByText('KES 14,500.00')).length).toBe(1);
		expect((await findAllByText('From partner to lenders')).length).toBe(1);
	});

	it('dates a direct loan intro to the day, since its installments are dated', async () => {
		const { getByTestId, findByText } = await renderRepaymentSchedule({
			loan: directLoan([
				{
					dueDate: '2015-03-01T08:00:00Z', amount: '208.33', amountPaid: '208.33', status: 'repaid',
				},
			]),
		});

		await findByText('Total amount due');

		expect(visibleText(getByTestId('repayment-lightbox')))
			.toContain('Repayments began on Mar 01, 2015');
	});

	it('lists each installment with its amount due, amount paid, due date and status', async () => {
		const { findByText, findAllByText } = await renderRepaymentSchedule({
			loan: directLoan([
				{
					dueDate: '2015-03-01T08:00:00Z', amount: '208.33', amountPaid: '208.33', status: 'repaid',
				},
				{
					dueDate: '2015-04-01T07:00:00Z', amount: '208.33', amountPaid: '91.71', status: 'partial',
				},
				{
					dueDate: '2015-05-01T07:00:00Z', amount: '208.33', amountPaid: null, status: 'future',
				},
			]),
		});

		expect(await findByText('Total amount due')).toBeTruthy();
		expect(await findByText('Amount paid')).toBeTruthy();
		expect(await findByText('Due from borrower')).toBeTruthy();
		expect(await findByText('Status')).toBeTruthy();

		expect((await findAllByText('Paid')).length).toBeGreaterThan(0);
		expect((await findAllByText('Partial Payment')).length).toBeGreaterThan(0);
		expect((await findAllByText('Not Paid')).length).toBeGreaterThan(0);
		expect((await findAllByText('USD 91.71')).length).toBeGreaterThan(0);
		expect((await findAllByText('Apr 1, 2015')).length).toBeGreaterThan(0);
	});

	it('keeps the pre-disbursal copy for a direct loan that has not disbursed', async () => {
		const loan = directLoan([]);
		loan.terms.disbursalDate = '2999-01-01T08:00:00Z';

		const { findByText, queryByText } = await renderRepaymentSchedule({ loan, status: 'fundraising' });

		expect(await findByText(/This loan is for/)).toBeTruthy();
		expect(queryByText('Total amount due')).toBeNull();
	});

	it('notes the currency loss and the delinquency attribution in the advanced view', async () => {
		const { findByTestId, findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([DELINQUENT_PERIOD]),
		});

		await fireEvent.click(await findByTestId('bp-repayment-advanced-toggle'));

		expect((await findAllByText('$12.34 lost to currency devaluation')).length).toBeGreaterThan(0);
		expect((await findAllByText('Lending partner behind in repayment')).length).toBeGreaterThan(0);
	});
});

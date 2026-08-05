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

// Kiva serializes dates as UTC offset from Pacific midnight; these keep the calendar
// day stable whichever timezone the suite runs in.
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

function partnerLoan(repayments, dualStatementNote = null) {
	return {
		id: 423481,
		dualStatementNote,
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

	it('shows Expected, Actual and Comments columns for a partner loan', async () => {
		const { findByText } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD]),
		});

		expect(await findByText('Expected')).toBeTruthy();
		expect(await findByText('Actual')).toBeTruthy();
		expect(await findByText('Comments')).toBeTruthy();
	});

	it('shows the settled amount and a received marker for a repaid period', async () => {
		const { findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD]),
		});

		expect((await findAllByText('$265.83')).length).toBeGreaterThan(0);
		expect((await findAllByText('Repayment received')).length).toBeGreaterThan(0);
	});

	it('shows $0.00 and a delinquent marker for a past period that received nothing', async () => {
		const { findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([DELINQUENT_PERIOD]),
		});

		expect((await findAllByText('$0.00')).length).toBeGreaterThan(0);
		expect((await findAllByText('Delinquent')).length).toBeGreaterThan(0);
	});

	it('notes the amount lost to currency devaluation', async () => {
		const { findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([DELINQUENT_PERIOD]),
		});

		expect((await findAllByText('$12.34 lost to currency devaluation')).length).toBeGreaterThan(0);
	});

	it('shows when an upcoming period becomes available instead of an amount', async () => {
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

		// The repaid period stays repaid even though the loan is only partly paid back,
		// which the old client-side heuristic got wrong.
		expect((await findAllByText('Repayment received')).length).toBeGreaterThan(0);
		expect((await findAllByText('Delinquent')).length).toBeGreaterThan(0);
		expect((await findAllByText('Available Sep 1')).length).toBeGreaterThan(0);
	});

	it('spaces the intro sentence when the loan is paying back', async () => {
		const { getByTestId } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD, DELINQUENT_PERIOD]),
		});

		await waitFor(() => {
			expect(visibleText(getByTestId('repayment-lightbox')))
				.toContain('Repayments began in Sep 01, 2017 and are delinquent.');
		});
	});

	it('reports an on track loan when no period is delinquent', async () => {
		const { getByTestId } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD, FUTURE_PERIOD]),
		});

		await waitFor(() => {
			expect(visibleText(getByTestId('repayment-lightbox')))
				.toContain('Repayments began in Sep 01, 2017 and are on track.');
		});
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

		expect((await findAllByText('From borrower to Lending partner')).length).toBeGreaterThan(0);
		expect(toggle.textContent.trim()).toBe('Hide advanced');

		await fireEvent.click(toggle);

		expect(queryByText('From borrower to Lending partner')).toBeNull();
		expect(toggle.textContent.trim()).toBe('Show advanced');
	});

	it('hides the advanced view for a dual-statement loan', async () => {
		const { queryByTestId, findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([REPAID_PERIOD], 'Important note about this loan'),
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
		expect((await findAllByText('From Lending partner to lenders')).length).toBe(1);
	});

	it('notes currency loss in the advanced view', async () => {
		const { findByTestId, findAllByText } = await renderRepaymentSchedule({
			loan: partnerLoan([DELINQUENT_PERIOD]),
		});

		await fireEvent.click(await findByTestId('bp-repayment-advanced-toggle'));

		expect((await findAllByText('$12.34 lost to currency devaluation')).length).toBeGreaterThan(0);
	});
});

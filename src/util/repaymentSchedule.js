import { format, isBefore, parseISO } from 'date-fns';
import { mdiCheckboxMarkedCircle, mdiMinusCircle } from '@mdi/js';
import numeral from 'numeral';

export const REPAID = 'repaid';
export const DELINQUENT = 'delinquent';
export const FUTURE = 'future';
export const PARTIAL = 'partial';

const REPAID_COMMENT = 'Repayment received';
const DELINQUENT_COMMENT = 'Delinquent';

export function formatUsd(amount) {
	return numeral(amount).format('$0,0.00');
}

export function formatLocalAmount(amount, currency) {
	if (amount === null || amount === undefined) {
		return '';
	}
	return `${currency} ${numeral(amount).format('0,0.00')}`;
}

// "$12.34 lost to currency devaluation", or empty when the period lost nothing
export function currencyLossNote(currencyLossToLenders) {
	if (currencyLossToLenders === null || currencyLossToLenders === undefined) {
		return '';
	}
	return `${formatUsd(currencyLossToLenders)} lost to currency devaluation`;
}

// The Actual cell: the settled amount, $0.00 for a past period that received nothing,
// or the date the repayment becomes available for a period still to come.
export function actualAmountLabel({ status, dueDate, actualAmountToLenders }, now) {
	if (actualAmountToLenders !== null && actualAmountToLenders !== undefined) {
		return formatUsd(actualAmountToLenders);
	}
	const due = parseISO(dueDate);
	if (status === FUTURE && !isBefore(due, now)) {
		return `Available ${format(due, 'MMM d')}`;
	}
	return formatUsd(0);
}

// The Comments cell: a received or delinquent marker, otherwise whichever party the
// server attributes the delinquency to.
export function periodComment({ status, delinquencyAttribution }) {
	if (status === REPAID) {
		return { tone: REPAID, text: REPAID_COMMENT };
	}
	if (status === DELINQUENT) {
		return { tone: DELINQUENT, text: DELINQUENT_COMMENT };
	}
	return { tone: '', text: delinquencyAttribution || '' };
}

export function buildPartnerPeriodRows(periods = [], now = new Date()) {
	return periods.map(period => ({
		dueDate: period.dueDate,
		periodLabel: format(parseISO(period.dueDate), 'MMM yyyy'),
		expected: formatUsd(period.expectedAmountToLenders ?? 0),
		actual: actualAmountLabel(period, now),
		status: period.status,
		comment: periodComment(period),
		currencyLoss: currencyLossNote(period.currencyLossToLenders),
	}));
}

export function commentIcon(tone) {
	return tone === REPAID ? mdiCheckboxMarkedCircle : mdiMinusCircle;
}

export function commentIconClass(tone) {
	return tone === DELINQUENT ? 'tw-text-danger' : 'tw-text-brand-700';
}

// How the schedule introduces itself, per loan status. A status missing from this map
// gets no sentence.
const INTRO_BY_STATUS = {
	fundraising: { tense: 'begin' },
	raised: { tense: 'begin' },
	payingBack: { tense: 'began', clause: 'on track', delinquentClause: 'delinquent' },
	ended: { tense: 'began', clause: 'complete' },
	defaulted: { tense: 'began', followUp: 'This loan ended in default.' },
};

export function repaymentIntro(status, { delinquent = false, hasFirstRepaymentDate = false } = {}) {
	const intro = INTRO_BY_STATUS[status];
	if (!intro || !hasFirstRepaymentDate) {
		return null;
	}
	return {
		tense: intro.tense,
		clause: (delinquent && intro.delinquentClause) || intro.clause || '',
		followUp: intro.followUp || '',
	};
}

const DIRECT_STATUS_LABELS = {
	[REPAID]: 'Paid',
	[PARTIAL]: 'Partial Payment',
	[FUTURE]: 'Not Paid',
};

export function directStatusLabel(status) {
	return DIRECT_STATUS_LABELS[status] ?? '';
}

export function isDualStatementLoan(dualStatementNote) {
	return !!dualStatementNote;
}

export function formatDetailDate(date) {
	if (!date) {
		return '';
	}
	return format(parseISO(date), 'MMM d, yyyy');
}

function borrowerRepaymentRows(period, currency) {
	const expected = (period.expectedRepayments ?? []).map(repayment => ({
		kind: 'expected',
		date: formatDetailDate(repayment.effectiveDate),
		amount: formatLocalAmount(repayment.amount, currency),
	}));
	const actual = (period.actualRepayments ?? []).map(repayment => ({
		kind: 'actual',
		date: formatDetailDate(repayment.effectiveDate),
		amount: formatLocalAmount(repayment.amount, currency),
	}));
	return [...expected, ...actual];
}

// The lending partner's settlement with lenders. A settled or missed period carries the
// period's own due date in both the expected and actual columns.
function lenderSettlementRow(period) {
	const settled = period.status === REPAID || period.status === DELINQUENT;
	return {
		expectedDate: formatDetailDate(period.dueDate),
		expectedAmount: formatUsd(period.expectedAmountToLenders ?? 0),
		actualDate: settled ? formatDetailDate(period.dueDate) : '',
		actualAmount: period.actualAmountToLenders === null || period.actualAmountToLenders === undefined
			? ''
			: formatUsd(period.actualAmountToLenders),
	};
}

export function buildDirectInstallmentRows(installments = [], currency = '') {
	return installments.map(installment => ({
		dueDate: installment.dueDate,
		amountDue: formatLocalAmount(installment.amount, currency),
		amountPaid: formatLocalAmount(installment.amountPaid, currency),
		dueFromBorrower: formatDetailDate(installment.dueDate),
		statusLabel: directStatusLabel(installment.status),
	}));
}

export function buildAdvancedPeriods(periods = [], currency = '') {
	return periods.map(period => ({
		dueDate: period.dueDate,
		periodLabel: format(parseISO(period.dueDate), 'MMM yyyy'),
		comment: periodComment(period),
		currencyLoss: currencyLossNote(period.currencyLossToLenders),
		borrowerRows: borrowerRepaymentRows(period, currency),
		lenderRow: lenderSettlementRow(period),
	}));
}

import { isBefore } from 'date-fns';
import numeral from 'numeral';
import { formatInKivaServerTimezone, parseKivaDate } from '#src/util/dateUtils';

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

export function formatPeriodLabel(date) {
	return formatInKivaServerTimezone(date, { year: 'numeric', month: 'short' });
}

export function formatDetailDate(date) {
	return formatInKivaServerTimezone(date, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatAvailableDate(date) {
	return formatInKivaServerTimezone(date, { month: 'short', day: 'numeric' });
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
export function actualAmountLabel({ dueDate, actualAmountToLenders }, now) {
	if (actualAmountToLenders !== null && actualAmountToLenders !== undefined) {
		return formatUsd(actualAmountToLenders);
	}
	const due = parseKivaDate(dueDate);
	if (due && !isBefore(due, now)) {
		return `Available ${formatAvailableDate(dueDate)}`;
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
		periodLabel: formatPeriodLabel(period.dueDate),
		expected: formatUsd(period.expectedAmountToLenders ?? 0),
		actual: actualAmountLabel(period, now),
		status: period.status,
		comment: periodComment(period),
	}));
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

export function repaymentIntro(
	status,
	{ delinquent = false, hasFirstRepaymentDate = false, isPartnerLoan = false } = {},
) {
	const intro = INTRO_BY_STATUS[status];
	if (!intro || !hasFirstRepaymentDate) {
		return null;
	}
	return {
		tense: intro.tense,
		// Partner periods are months and direct installments are days, so each reads
		// against the granularity of the table beneath it.
		preposition: isPartnerLoan ? 'in' : 'on',
		clause: (delinquent && intro.delinquentClause) || intro.clause || '',
		followUp: intro.followUp || '',
	};
}

export function formatIntroDate(date, isPartnerLoan) {
	if (isPartnerLoan) {
		return formatPeriodLabel(date);
	}
	return formatInKivaServerTimezone(date, { year: 'numeric', month: 'short', day: '2-digit' });
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

// One row per borrower repayment, pairing each expected repayment with the recorded one
// in the same position and running to whichever list is longer.
function borrowerRepaymentRows(period, currency) {
	const expected = period.expectedRepayments ?? [];
	const actual = period.actualRepayments ?? [];

	return Array.from({ length: Math.max(expected.length, actual.length) }, (unused, index) => ({
		expectedDate: formatDetailDate(expected[index]?.effectiveDate),
		expectedAmount: formatLocalAmount(expected[index]?.amount, currency),
		actualDate: formatDetailDate(actual[index]?.effectiveDate),
		actualAmount: formatLocalAmount(actual[index]?.amount, currency),
	}));
}

// The lending partner's settlement with lenders. A settled or missed period carries the
// period's own due date in both the expected and actual columns.
function lenderSettlementRow(period, now) {
	const settled = period.status === REPAID || period.status === DELINQUENT;
	return {
		expectedDate: formatDetailDate(period.dueDate),
		expectedAmount: formatUsd(period.expectedAmountToLenders ?? 0),
		actualDate: settled ? formatDetailDate(period.dueDate) : '',
		actualAmount: actualAmountLabel(period, now),
		attribution: period.delinquencyAttribution || '',
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

export function buildAdvancedPeriods(periods = [], currency = '', now = new Date()) {
	return periods.map(period => ({
		dueDate: period.dueDate,
		periodLabel: formatPeriodLabel(period.dueDate),
		comment: periodComment(period),
		currencyLoss: currencyLossNote(period.currencyLossToLenders),
		borrowerRows: borrowerRepaymentRows(period, currency),
		lenderRow: lenderSettlementRow(period, now),
	}));
}

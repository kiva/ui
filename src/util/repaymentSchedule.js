import { format, isBefore, parseISO } from 'date-fns';
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

export function hasDelinquentPeriod(periods = []) {
	return periods.some(({ status }) => status === DELINQUENT);
}

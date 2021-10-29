import {
	isValid as isValidDate,
	formatDistanceToNowStrict,
	parseISO,
	differenceInDays,
} from 'date-fns';
import numeral from 'numeral';
import logFormatter from '@/util/logFormatter';

// Return true if the given loan object is missing the given field.
// Logs an error to the console if the field is missing.
function missingLoanField({
	loan,
	field = '',
	resolver = '',
	type = 'LoanBasic',
}) {
	const propChain = field.split('.');
	// Use optional chaining to see if nested loan properties exist
	const value = propChain.reduce((val, chainLink) => val?.[chainLink] ?? null, loan);
	if (value === null) {
		logFormatter(`Loan resolver: Missing required field '${field}' for ${type}.${resolver}`, 'error', { loan });
		return true;
	}
}

// Return true if the given loan object is missing any of the given fields.
function missingLoanFields({
	loan,
	fields = [],
	resolver,
	type,
}) {
	return fields.some(field => missingLoanField({
		loan,
		field,
		resolver,
		type,
	}));
}

/**
 * Resolves the fundraising progress for this loan, including the amount reserved in baskets,
 * as a float from 0 to 1 (inclusive).
 *
 * Example fragment:
 * ... on LoanBasic {
	 loanAmount
	 loanFundraisingInfo {
		 fundedAmount
		 reservedAmount
	 }
	 fundraisingPercent @client
 * }
* */
function fundraisingPercent(loan) {
	// Handle missing required loan fields
	if (missingLoanFields({
		loan,
		fields: [
			'loanAmount',
			'loanFundraisingInfo.fundedAmount',
			'loanFundraisingInfo.reservedAmount'
		],
		resolver: 'fundraisingPercent',
	})) {
		return 0;
	}

	// Get amounts as numbers
	const loanAmount = numeral(loan.loanAmount).value();
	const fundedAmount = numeral(loan.loanFundraisingInfo.fundedAmount).value();
	const reservedAmount = numeral(loan.loanFundraisingInfo.reservedAmount).value();

	// Calculate progress percentage
	const progressPercent = (fundedAmount + reservedAmount) / loanAmount;

	// Ensure returned value is not less than 0 and is not greater than 1
	return Math.max(0, Math.min(1, progressPercent));
}

/**
 * Resolves the time left before expiration as words.
 *
 * Example fragment:
 * ... on LoanBasic {
	 plannedExpirationDate
	 fundraisingTimeLeft @client
 * }
* */
function fundraisingTimeLeft(loan) {
	// Handle missing required field
	if (missingLoanField({
		loan,
		field: 'plannedExpirationDate',
		resolver: 'fundraisingTimeLeft',
	})) {
		return '';
	}

	// Get planned expiration time as Date
	const plannedExpirationDate = parseISO(loan.plannedExpirationDate);

	// Return empty string if the result is not a valid date
	if (!isValidDate(plannedExpirationDate)) {
		return '';
	}

	const now = parseISO(new Date().toISOString());

	const diffInDays = differenceInDays(plannedExpirationDate, now);
	console.log('plannedEXP', plannedExpirationDate);
	console.log('NOW', parseISO(new Date().toISOString()));
	console.log('diffInDays', diffInDays);

	// use differenceInDays to see if the plannedExpirationDate is greater than 28 day from now
	if (diffInDays > -28) {
		return formatDistanceToNowStrict(plannedExpirationDate, { unit: 'day' });
	}
	return formatDistanceToNowStrict(plannedExpirationDate);
}

/**
 * Resolves the unreserved amount of this loan as a Money string.
 *
 * Example fragment:
 * ... on LoanBasic {
	 loanAmount
	 loanFundraisingInfo {
		 fundedAmount
		 reservedAmount
	 }
	 unreservedAmount @client
 * }
* */
function unreservedAmount(loan) {
	// Handle missing required loan fields
	if (missingLoanFields({
		loan,
		fields: [
			'loanAmount',
			'loanFundraisingInfo.fundedAmount',
			'loanFundraisingInfo.reservedAmount'
		],
		resolver: 'unreservedAmount',
	})) {
		return '0.00';
	}

	// Get amounts as numbers
	const loanAmount = numeral(loan.loanAmount).value();
	const fundedAmount = numeral(loan.loanFundraisingInfo.fundedAmount).value();
	const reservedAmount = numeral(loan.loanFundraisingInfo.reservedAmount).value();

	// Calculate unfunded and unreserved amounts
	const unfunded = loanAmount - fundedAmount;
	const unreserved = unfunded - reservedAmount;

	// Format as string to match Money type
	return numeral(unreserved).format('0.00');
}

export default () => {
	return {
		resolvers: {
			LoanPartner: {
				fundraisingPercent,
				fundraisingTimeLeft,
				unreservedAmount,
			},
			LoanDirect: {
				fundraisingPercent,
				fundraisingTimeLeft,
				unreservedAmount,
			},
		},
	};
};

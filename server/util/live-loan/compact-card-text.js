import numeral from 'numeral';

const DIRECT = 'direct';
const PRIVACY_STATEMENT = 'For the borrower\'s privacy, this loan has been made anonymous.';

// Statuses that read in the present tense ("helps"); every other status —
// including "issue" — reads "helped", matching the on-site compact loan card.
const PRESENT_TENSE_STATUSES = ['fundraising', 'inactive', 'reviewed'];

function helpLanguage(status = '') {
	return PRESENT_TENSE_STATUSES.includes(status) ? 'helps' : 'helped';
}

function lowerFirst(text = '') {
	return `${text.charAt(0).toLowerCase()}${text.slice(1)}`;
}

/**
 * Builds the compact loan card use statement as styled runs so the canvas
 * renderer can bold the borrower name + country while keeping the rest regular.
 * Matches the sentence structure of the on-site compact loan card.
 *
 * @param {Object} loan Live-loan GraphQL loan object
 * @returns {Array<{ text: string, bold: boolean }>}
 */
export function buildCompactLoanUseRuns(loan = {}) {
	const {
		name = '',
		use = '',
		loanAmount = '',
		status = '',
		distributionModel,
		borrowerCount = 0,
		anonymizationLevel = 'none',
	} = loan;
	const country = loan?.geocode?.country?.name ?? '';

	if (anonymizationLevel === 'full' || !use) {
		return [{ text: PRIVACY_STATEMENT, bold: false }];
	}

	const help = helpLanguage(status);
	const isDirect = distributionModel === DIRECT;
	const member = borrowerCount > 1 ? 'a member of ' : '';
	const nameCountry = country ? `${name} in ${country}` : name;
	const amount = numeral(loanAmount).format('$0,0');
	const normalizedUse = lowerFirst(use);

	// Direct loans read "$X to {name} {help} {use}"; partner loans read
	// "$X {help} {name} {use}" — only the text around the bold name differs.
	const prefix = isDirect ? `${amount} to ${member}` : `${amount} ${help} ${member}`;
	const suffix = isDirect ? ` ${help} ${normalizedUse}` : ` ${normalizedUse}`;
	return [
		{ text: prefix, bold: false },
		{ text: nameCountry, bold: true },
		{ text: suffix, bold: false },
	];
}

/**
 * Builds the "$X to go" fundraising label used on the compact loan card.
 * Mirrors KvLoanProgressGroup: appends "!" when under $100 remains and
 * shows "funded!" once fully raised.
 *
 * @param {Object} loan Live-loan GraphQL loan object
 * @returns {string}
 */
export function buildToGoText(loan = {}) {
	const loanAmount = numeral(loan?.loanAmount).value() ?? 0;
	const fundedAmount = numeral(loan?.loanFundraisingInfo?.fundedAmount).value() ?? 0;
	const remaining = loanAmount - fundedAmount;

	if (remaining <= 0) {
		return 'funded!';
	}
	return `${numeral(remaining).format('$0,0')} to go${remaining < 100 ? '!' : ''}`;
}

export default { buildCompactLoanUseRuns, buildToGoText };

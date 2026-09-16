// @vitest-environment node
import { buildCompactLoanUseRuns, buildToGoText } from '#server/util/live-loan/compact-card-text';

// Base loan shaped like the live-loan GraphQL response
function makeLoan(overrides = {}) {
	return {
		name: 'Margaret',
		geocode: { country: { name: 'Guatemala' } },
		use: 'To build a sanitary toilet',
		loanAmount: 100,
		status: 'fundraising',
		distributionModel: 'fieldPartner',
		borrowerCount: 1,
		anonymizationLevel: 'none',
		loanFundraisingInfo: { fundedAmount: 0 },
		...overrides,
	};
}

// Concatenate runs back into the full sentence for readability assertions
function joinRuns(runs) {
	return runs.map(r => r.text).join('');
}

describe('buildCompactLoanUseRuns', () => {
	it('bolds the borrower name and country inside a partner loan sentence', () => {
		const runs = buildCompactLoanUseRuns(makeLoan());

		expect(joinRuns(runs)).toBe('$100 helps Margaret in Guatemala to build a sanitary toilet');
		const boldRun = runs.find(r => r.bold);
		expect(boldRun.text).toBe('Margaret in Guatemala');
	});

	it('uses past tense "helped" for a funded loan', () => {
		const runs = buildCompactLoanUseRuns(makeLoan({ status: 'funded' }));

		expect(joinRuns(runs)).toBe('$100 helped Margaret in Guatemala to build a sanitary toilet');
	});

	it('places the help language after the name for direct loans', () => {
		const runs = buildCompactLoanUseRuns(makeLoan({ distributionModel: 'direct' }));

		expect(joinRuns(runs)).toBe('$100 to Margaret in Guatemala helps to build a sanitary toilet');
		expect(runs.find(r => r.bold).text).toBe('Margaret in Guatemala');
	});

	it('adds "a member of" for group loans', () => {
		const runs = buildCompactLoanUseRuns(makeLoan({ borrowerCount: 5 }));

		expect(joinRuns(runs)).toBe('$100 helps a member of Margaret in Guatemala to build a sanitary toilet');
	});

	it('omits the country when there is no geocode', () => {
		const runs = buildCompactLoanUseRuns(makeLoan({ geocode: null }));

		expect(joinRuns(runs)).toBe('$100 helps Margaret to build a sanitary toilet');
		expect(runs.find(r => r.bold).text).toBe('Margaret');
	});

	it('returns a single privacy run when the loan is anonymized', () => {
		const runs = buildCompactLoanUseRuns(makeLoan({ anonymizationLevel: 'full' }));

		expect(runs).toHaveLength(1);
		expect(runs[0].bold).toBe(false);
		expect(runs[0].text).toBe('For the borrower\'s privacy, this loan has been made anonymous.');
	});

	it('returns the privacy run when the use statement is empty', () => {
		const runs = buildCompactLoanUseRuns(makeLoan({ use: '' }));

		expect(joinRuns(runs)).toBe('For the borrower\'s privacy, this loan has been made anonymous.');
	});
});

describe('buildToGoText', () => {
	it('formats the remaining amount', () => {
		const loan = makeLoan({ loanAmount: 1000, loanFundraisingInfo: { fundedAmount: 115 } });

		expect(buildToGoText(loan)).toBe('$885 to go');
	});

	it('adds an exclamation point when under $100 remains', () => {
		const loan = makeLoan({ loanAmount: 100, loanFundraisingInfo: { fundedAmount: 25 } });

		expect(buildToGoText(loan)).toBe('$75 to go!');
	});

	it('shows "funded!" when nothing remains', () => {
		const loan = makeLoan({ loanAmount: 100, loanFundraisingInfo: { fundedAmount: 100 } });

		expect(buildToGoText(loan)).toBe('funded!');
	});
});

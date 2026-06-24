import LoanDescription from '#src/components/BorrowerProfile/LoanDescription';

export default {
	title: 'Components/BorrowerProfile/LoanDescription',
	component: LoanDescription,
};

const baseArgs = {
	loanId: 2413188,
	anonymizationLevel: '',
	borrowerOrGroupName: 'Wanda',
	borrowerCount: 1,
	borrowers: [],
	storyDescription: 'Wanda runs a small market stall and would like a loan to buy more inventory. '
		+ '(Placeholder text for layout testing.)',
	descriptionInOriginalLanguage: 'Wanda tiene un pequeño puesto en el mercado y desea un préstamo '
		+ 'para comprar más inventario. (Texto de ejemplo.)',
	originalLanguage: { id: '2', name: 'Spanish' },
	partnerName: 'AFODENIC',
	reviewer: { bylineName: 'Rita Rocket', showName: true },
	previousLoanId: 0,
};

// Non-PII partner loan in a non-English language: the "Translated from…" note SHOWS.
export const PartnerLoanTranslated = () => ({
	components: { LoanDescription },
	data: () => ({ ...baseArgs, anonymizationLevel: '' }),
	template: '<loan-description v-bind="$data" />',
});

// PII-anonymized partner loan: the AI-generated English description has no original-language
// counterpart, so the "Translated from…" note is HIDDEN even for a non-English partner loan.
export const PiiAnonymized = () => ({
	components: { LoanDescription },
	data: () => ({ ...baseArgs, anonymizationLevel: 'pii' }),
	template: '<loan-description v-bind="$data" />',
});

const groupArgs = {
	borrowerOrGroupName: 'Sample Group',
	borrowerCount: 3,
	borrowers: [
		{ id: 1, firstName: 'Wanda' },
		{ id: 2, firstName: 'Lucy' },
		{ id: 3, firstName: 'Rita' },
	],
};

// Group loan (not anonymized): the "In this group: …" member list SHOWS.
export const GroupLoan = () => ({
	components: { LoanDescription },
	data: () => ({ ...baseArgs, ...groupArgs, anonymizationLevel: '' }),
	template: '<loan-description v-bind="$data" />',
});

// Anonymized group loan: members' names are scrubbed, so the "In this group: …"
// list is HIDDEN.
export const GroupLoanAnonymized = () => ({
	components: { LoanDescription },
	data: () => ({ ...baseArgs, ...groupArgs, anonymizationLevel: 'pii' }),
	template: '<loan-description v-bind="$data" />',
});

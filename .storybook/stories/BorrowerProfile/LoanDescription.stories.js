import LoanDescription from '#src/components/BorrowerProfile/LoanDescription';

export default {
	title: 'Components/BorrowerProfile/LoanDescription',
	component: LoanDescription,
};

const baseArgs = {
	loanId: 2413188,
	anonymizationLevel: '',
	borrowerOrGroupName: 'Maria',
	borrowerCount: 1,
	borrowers: [],
	storyDescription: 'Maria is a hardworking farmer who is requesting a loan to buy seeds and fertilizer.',
	descriptionInOriginalLanguage: 'María es una agricultora trabajadora que solicita un préstamo'
		+ ' para comprar semillas y fertilizante.',
	originalLanguage: { id: '2', name: 'Spanish' },
	partnerName: 'Kiva Field Partner',
	reviewer: { bylineName: 'Jane Volunteer', showName: true },
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
	borrowerOrGroupName: 'Aisha\'s Group',
	borrowerCount: 3,
	borrowers: [
		{ id: 1, firstName: 'Aisha' },
		{ id: 2, firstName: 'Fatima' },
		{ id: 3, firstName: 'Nadia' },
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

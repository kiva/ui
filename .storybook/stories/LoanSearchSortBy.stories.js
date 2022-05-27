import LoanSearchSortBy from '@/components/Lend/LoanSearch/LoanSearchSortBy';

export default {
	title: 'Loan Search/Loan Search Sort Order',
	component: LoanSearchSortBy,
};

const allSortOptions = [
	{ name: 'amountLeft', sortSrc: 'standard' },
	{ name: 'expiringSoon', sortSrc: 'standard' },
	{ name: 'loanAmount', sortSrc: 'standard' },
	{ name: 'loanAmountDesc', sortSrc: 'standard' },
	{ name: 'newest', sortSrc: 'standard' },
	{ name: 'popularity', sortSrc: 'standard' },
	{ name: 'random', sortSrc: 'standard' },
	{ name: 'repaymentTerm', sortSrc: 'standard' },
	{ name: 'amountHighToLow', sortSrc: 'flss' },
	{ name: 'amountLowToHigh', sortSrc: 'flss' },
	{ name: 'expiringSoon', sortSrc: 'flss' },
	{ name: 'personalized', sortSrc: 'flss' }
];

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LoanSearchSortBy },
		template: '<loan-search-sort-by :all-sort-options="allSortOptions" />',
	})
	template.args = args;
	return template;
};

export const Default = story({ allSortOptions });

// TODO: Add initialSort story when that feature exists

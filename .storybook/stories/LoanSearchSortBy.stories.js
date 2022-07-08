import LoanSearchSortBy from '@/components/Lend/LoanSearch/LoanSearchSortBy';
import { FLSS_QUERY_TYPE, STANDARD_QUERY_TYPE } from '@/util/loanSearch/filterUtils';

export default {
	title: 'Loan Search/Loan Search Sort Order',
	component: LoanSearchSortBy,
};

const allSortOptions = [
	{ name: 'amountLeft', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'expiringSoon', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'loanAmount', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'loanAmountDesc', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'newest', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'popularity', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'random', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'repaymentTerm', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'amountHighToLow', sortSrc: FLSS_QUERY_TYPE },
	{ name: 'amountLowToHigh', sortSrc: FLSS_QUERY_TYPE },
	{ name: 'expiringSoon', sortSrc: FLSS_QUERY_TYPE },
	{ name: 'personalized', sortSrc: FLSS_QUERY_TYPE }
];

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LoanSearchSortBy },
		template: '<loan-search-sort-by :all-sort-options="allSortOptions" :sort="sort" />',
	})
	template.args = args;
	return template;
};

export const Default = story({ allSortOptions });

export const ExpiringSoon = story({ allSortOptions, sort: 'expiringSoon' });

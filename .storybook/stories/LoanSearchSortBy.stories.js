import LoanSearchSortBy from '@/components/Lend/LoanSearch/LoanSearchSortBy';
import { filterOptionUtils } from '@kiva/kv-loan-filters';

export default {
	title: 'Loan Search/Loan Search Sort Order',
	component: LoanSearchSortBy,
};

const allSortOptions = [
	{ name: 'amountLeft', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'expiringSoon', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'loanAmount', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'loanAmountDesc', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'newest', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'popularity', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'random', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'repaymentTerm', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'amountHighToLow', sortSrc: filterOptionUtils.FLSS_QUERY_TYPE },
	{ name: 'amountLowToHigh', sortSrc: filterOptionUtils.FLSS_QUERY_TYPE },
	{ name: 'expiringSoon', sortSrc: filterOptionUtils.FLSS_QUERY_TYPE },
	{ name: 'personalized', sortSrc: filterOptionUtils.FLSS_QUERY_TYPE }
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

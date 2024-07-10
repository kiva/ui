import LoanSearchFilterChips from '@/components/Lend/LoanSearch/LoanSearchFilterChips';
import { mockState, mockAllFacets } from '../../test/unit/fixtures/mockLoanSearchData';

export default {
	title: 'Loan Search/Loan Search Filter Chips',
	component: LoanSearchFilterChips,
};

const story = (args = {}) => {
	const template = (_, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LoanSearchFilterChips },
		template: '<div style="width: 400px"><loan-search-filter-chips :loan-search-state="loanSearchState" :all-facets="allFacets" /></div>',
	})
	template.args = args;
	return template;
};

export const Chips = story({ loanSearchState: mockState, allFacets: mockAllFacets });

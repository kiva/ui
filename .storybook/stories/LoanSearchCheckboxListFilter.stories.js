import LoanSearchCheckboxListFilter from '@/components/Lend/LoanSearch/LoanSearchCheckboxListFilter';

export default {
	title: 'Loan Search/Loan Search Checkbox List Filter',
	component: LoanSearchCheckboxListFilter,
};

const story = (args = {}) => {
	const template = (_, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LoanSearchCheckboxListFilter },
		template: '<loan-search-checkbox-list-filter :options="options" :ids="ids" :filter-key="filterKey" :event-action="eventAction" />',
	})
	template.args = args;
	return template;
};

const options = (disabled = false) => [...Array(4)].map((_, i) => ({ id: i, name: `Option ${i}`, numLoansFundraising: disabled ? 0 : 5 }));

export const Default = story({ options: options(), filterKey: 'optionId', eventAction: 'click-option' });

export const Selected = story({ options: options(), ids: options().slice(0, 2).map(t => t.id), filterKey: 'optionId', eventAction: 'click-option' });

export const NoneFundraising = story({ options: options(true), filterKey: 'optionId', eventAction: 'click-option' });

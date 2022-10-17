import LoanSearchRadioGroupFilter from '@/components/Lend/LoanSearch/LoanSearchRadioGroupFilter';

export default {
	title: 'Loan Search/Loan Search Radio Group Filter',
	component: LoanSearchRadioGroupFilter,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LoanSearchRadioGroupFilter },
		template: '<loan-search-radio-group-filter :options="options" :selected="selected" filterKey="option" eventAction="click-option-filter" />',
	})
	template.args = args;
	return template;
};

const options = [...Array(4)].map((_, i) => ({ title: `Option ${i}`, name: `${i}` }));

export const Default = story({ options: options });

export const Selected = story({ options, selected: options[0].name });

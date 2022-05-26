import LoanSearchAttributeFilter from '@/components/Lend/LoanSearch/LoanSearchAttributeFilter';

export default {
	title: 'Loan Search/Loan Search Attribute Filter',
	component: LoanSearchAttributeFilter,
};

const story = (args = {}) => {
	const template = (_, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LoanSearchAttributeFilter },
		template: '<loan-search-attribute-filter :attributes="attributes" />',
	})
	template.args = args;
	return template;
};

const items = (disabled = false) => [...Array(4)].map((_, i) => ({ id: i, name: `Option ${i}`, numLoansFundraising: disabled ? 0 : 5 }));

export const Default = story({ attributes: items() });

export const NoneFundraising = story({ attributes: items(true) });

import LoanSearchLocationFilter from '@/components/Lend/LoanSearch/LoanSearchLocationFilter';

export default {
	title: 'Loan Search/Loan Search Location Filter',
	component: LoanSearchLocationFilter,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LoanSearchLocationFilter },
		template: '<loan-search-location-filter :regions="regions" />',
	})
	template.args = args;
	return template;
};

const regions = [...Array(4)].map((_r, i) => ({
	region: `Region ${i}`,
	numLoansFundraising: 20,
	countries: [...Array(4)].map((_c, j) => ({ name: `Country ${j}`, numLoansFundraising: 5 }))
}));

export const Default = story({ regions });

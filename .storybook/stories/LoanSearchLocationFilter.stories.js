import LoanSearchLocationFilter from '@/components/Lend/LoanSearch/LoanSearchLocationFilter';

export default {
	title: 'Loan Search/Loan Search Location Filter',
	component: LoanSearchLocationFilter,
};

const story = (args = {}) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LoanSearchLocationFilter },
		template: '<loan-search-location-filter :regions="regions" :active-iso-codes="activeIsoCodes" />',
	})
	template.args = args;
	return template;
};

const regions = (disabled = false) => [...Array(4)].map((_r, i) => ({
	region: `Region ${i}`,
	numLoansFundraising: disabled ? 0 : 20,
	countries: [...Array(4)].map((_c, j) => ({ name: `Country ${j}`, isoCode: `ISO ${j}`, numLoansFundraising: disabled ? 0 : 5 }))
}));

export const Default = story({ regions: regions() });

export const Selected = story({ regions: regions(), activeIsoCodes: regions()[0].countries.slice(0, 2).map(c => c.isoCode) });

export const NoneFundraising = story({ regions: regions(true) });

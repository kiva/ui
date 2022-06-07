import LoanSearchSectorFilter from '@/components/Lend/LoanSearch/LoanSearchSectorFilter';

export default {
	title: 'Loan Search/Loan Search Sector Filter',
	component: LoanSearchSectorFilter,
};

const story = (args = {}) => {
	const template = (_, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { LoanSearchSectorFilter },
		template: '<loan-search-sector-filter :sectors="sectors" :sector-ids="sectorIds" />',
	})
	template.args = args;
	return template;
};

const items = (disabled = false) => [...Array(4)].map((_, i) => ({ id: i, name: `Option ${i}`, numLoansFundraising: disabled ? 0 : 5 }));

export const Default = story({ sectors: items() });

export const Selected = story({ sectors: items(), sectorIds: items().slice(0, 2).map(t => t.id) });

// TODO: enable story when updating disabled status of sector filter is implemented
// export const NoneFundraising = story({ sectors: items(true) });

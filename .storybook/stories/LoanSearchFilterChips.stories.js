import LoanSearchFilterChips from '@/components/Lend/LoanSearch/LoanSearchFilterChips';

export default {
	title: 'Loan Search/Loan Search Filter Chips',
	component: LoanSearchFilterChips,
};

const loanSearchState = {
	gender: 'female',
	countryIsoCode: ['US'],
	sectorId: [1],
	themeId: [1],
};

const allFacets = {
	countryFacets: [
		{
			country: {
				isoCode: 'US',
				name: 'United States',
				region: 'North America',
				__typename: 'Country'
			}
		},
		{
			country: {
				isoCode: 'CA',
				name: 'Canada',
				region: 'North America',
				__typename: 'Country'
			}
		}
	],
	countryIsoCodes: ['US', 'CA'],
	countryNames: ['UNITED STATES', 'CANADA'],
	sectorFacets: [
		{ id: 1, name: 'Sector 1', __typename: 'Sector' },
		{ id: 2, name: 'Sector 2', __typename: 'Sector' }
	],
	sectorIds: [1],
	sectorNames: ['SECTOR 1', 'SECTOR 2'],
	themeFacets: [
		{ id: 1, name: 'Theme 1', __typename: 'LoanThemeFilter' },
		{ id: 2, name: 'Theme 2', __typename: 'LoanThemeFilter' }
	],
	themeNames: ['THEME 1', 'THEME 2'],
	genderFacets: [{ name: 'female', __typename: 'Gender' }, { name: 'male', __typename: 'Gender' }],
	genders: ['FEMALE', 'MALE'],
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

export const Chips = story({ loanSearchState, allFacets });

import Vue from 'vue';
import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchFilterChips from '@/components/Lend/LoanSearch/LoanSearchFilterChips';

const mockState = {
	gender: 'female',
	countryIsoCode: ['US'],
	sectorId: [1],
	themeId: [1],
};

const mockAllFacets = {
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
	genderFacets: [
		{ name: 'female', __typename: 'Gender' },
		{ name: 'male', __typename: 'Gender' },
		{ name: 'nonbinary', __typename: 'Gender' }
	],
	genders: ['FEMALE', 'MALE', 'NONBINARY'],
};

describe('LoanSearchFilterChips', () => {
	let spyTrackEvent;

	beforeEach(() => {
		spyTrackEvent = jest.spyOn(Vue.prototype, '$kvTrackEvent');
	});

	afterEach(jest.restoreAllMocks);

	it('should handle missing props', () => {
		render(LoanSearchFilterChips);
		render(LoanSearchFilterChips, { props: { allFacets: mockAllFacets } });
	});

	it('should handle render state with missing state', () => {
		render(LoanSearchFilterChips, {
			props: {
				loanSearchState: {},
				allFacets: mockAllFacets
			}
		});
	});

	it('should handle render state', () => {
		const { getByText } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		getByText('United States');
		getByText('Sector 1');
		getByText('Theme 1');
		getByText('Women');
	});

	it('should handle render state with missing state', () => {
		render(LoanSearchFilterChips, {
			props: {
				loanSearchState: {},
				allFacets: mockAllFacets
			}
		});
	});

	it('should handle country chip click', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText('United States'));

		expect(emitted().updated[0]).toEqual([{ countryIsoCode: [] }]);
	});

	it('should handle sector chip click', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText('Sector 1'));

		expect(emitted().updated[0]).toEqual([{ sectorId: [] }]);
	});

	it('should handle theme chip click', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText('Theme 1'));

		expect(emitted().updated[0]).toEqual([{ themeId: [] }]);
	});

	it('should handle gender chip click', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText('Women'));

		expect(emitted().updated[0]).toEqual([{ gender: null }]);
	});

	it('should track event', async () => {
		const user = userEvent.setup();

		const { getByText } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText('Women'));

		expect(spyTrackEvent).toHaveBeenCalledTimes(1);
		expect(spyTrackEvent).toHaveBeenCalledWith('Lending', 'click-remove-filter-chip', 'Gender-Women');
	});
});

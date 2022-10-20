import Vue from 'vue';
import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchFilterChips from '@/components/Lend/LoanSearch/LoanSearchFilterChips';
import { mockState, mockAllFacets } from '../../../../fixtures/mockLoanSearchData';

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

	it('should handle tag chip click', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText('Tag 1'));

		expect(emitted().updated[0]).toEqual([{ tagId: [] }]);
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

	it('should handle distribution model chip click', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText('Direct'));

		expect(emitted().updated[0]).toEqual([{ distributionModel: null }]);
	});

	it('should handle is individual chip click', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText('Group'));

		expect(emitted().updated[0]).toEqual([{ isIndividual: null }]);
	});

	it('should handle lender repayment term chip click', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText('8 mths or less'));

		expect(emitted().updated[0]).toEqual([{ lenderRepaymentTerm: null }]);
	});

	it('should handle keyword search chip click', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText(mockState.keywordSearch));

		expect(emitted().updated[0]).toEqual([{ keywordSearch: null }]);
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

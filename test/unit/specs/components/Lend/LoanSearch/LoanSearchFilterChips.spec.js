import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchFilterChips from '#src/components/Lend/LoanSearch/LoanSearchFilterChips';
import filterConfig from '#src/util/loanSearch/filterConfig';
import { mockState, mockAllFacets } from '../../../../fixtures/mockLoanSearchData';
import { globalOptions } from '../../../../specUtils';

vi.mock('#src/util/loanSearch/filterConfig', () => ({
	default: {
		config: {
			a: {
				getFilterChips: vi.fn().mockReturnValue([{ name: 'a', __typename: 'TypeA' }]),
				getRemovedFacet: vi.fn().mockReturnValue({ a: null }),
			},
			b: {
				getFilterChips: vi.fn().mockReturnValue([{ name: 'b', __typename: 'TypeB' }]),
				getRemovedFacet: vi.fn().mockReturnValue({ b: null })
			},
		},
		keys: ['a', 'b'],
	},
}));

describe('LoanSearchFilterChips', () => {
	it('should handle missing props', () => {
		render(LoanSearchFilterChips, {
		});
		render(LoanSearchFilterChips, {
			props: { allFacets: mockAllFacets }
		});
	});

	it('should handle render state with missing state', () => {
		render(LoanSearchFilterChips, {
			props: {
				loanSearchState: {},
				allFacets: mockAllFacets
			}
		});
	});

	it('should call filterConfig and render state', () => {
		vi.clearAllMocks();
		const { getByText } = render(LoanSearchFilterChips, {
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		getByText('a');
		getByText('b');
		expect(filterConfig.config.a.getFilterChips).toHaveBeenCalledTimes(1);
		expect(filterConfig.config.a.getFilterChips).toHaveBeenCalledWith(mockState, mockAllFacets);
		expect(filterConfig.config.b.getFilterChips).toHaveBeenCalledTimes(1);
		expect(filterConfig.config.b.getFilterChips).toHaveBeenCalledWith(mockState, mockAllFacets);
	});

	it('should handle render state with missing state', () => {
		render(LoanSearchFilterChips, {
			props: {
				loanSearchState: {},
				allFacets: mockAllFacets
			}
		});
	});

	it('should call filterConfig and remove chip', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(LoanSearchFilterChips, {
			global: {
				...globalOptions,
			},
			props: {
				loanSearchState: { name: 'a' },
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText('a'));

		expect(filterConfig.config.a.getRemovedFacet).toHaveBeenCalledTimes(1);
		expect(filterConfig.config.a.getRemovedFacet)
			.toHaveBeenCalledWith({ name: 'a' }, { name: 'a', key: 'a', __typename: 'TypeA' });
		expect(emitted().updated[0]).toEqual([{ a: null }]);
	});

	it('should track event', async () => {
		const user = userEvent.setup();
		const spyTrackEvent = vi.fn();

		const { getByText } = render(LoanSearchFilterChips, {
			global: {
				...globalOptions,
				mocks: {
					$kvTrackEvent: spyTrackEvent
				},
			},
			props: {
				loanSearchState: mockState,
				allFacets: mockAllFacets
			}
		});

		await user.click(getByText('a'));

		expect(spyTrackEvent).toHaveBeenCalledTimes(1);
		expect(spyTrackEvent).toHaveBeenCalledWith('Lending', 'click-remove-filter-chip', 'TypeA-a');
	});
});

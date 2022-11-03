import Vue from 'vue';
import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchFilterChips from '@/components/Lend/LoanSearch/LoanSearchFilterChips';
import filterConfig from '@/util/loanSearch/filterConfig';
import { mockState, mockAllFacets } from '../../../../fixtures/mockLoanSearchData';

jest.mock('@/util/loanSearch/filterConfig', () => {
	return {
		config: {
			a: {
				getFilterChips: jest.fn().mockReturnValue([{ name: 'a', __typename: 'TypeA' }]),
				getRemovedFacet: jest.fn().mockReturnValue({ a: null }),
			},
			b: {
				getFilterChips: jest.fn().mockReturnValue([{ name: 'b', __typename: 'TypeB' }]),
				getRemovedFacet: jest.fn().mockReturnValue({ b: null })
			},
		},
		keys: ['a', 'b'],
	};
});

describe('LoanSearchFilterChips', () => {
	let spyTrackEvent;

	beforeEach(() => {
		spyTrackEvent = jest.spyOn(Vue.prototype, '$kvTrackEvent');

		jest.clearAllMocks();
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

	it('should call filterConfig and render state', () => {
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

		const { getByText } = render(LoanSearchFilterChips, {
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

import { render, fireEvent } from '@testing-library/vue';
import numeral from 'numeral';
import RepaymentsSummaryTable from '#src/components/Portfolio/EstimatedRepayments/RepaymentsSummaryTable';

const months = [
	{
		year: 2026, month: 7, monthLabel: 'July', total: 400, loansMakingRepayments: 6, showYearHeader: true
	},
	{
		year: 2026, month: 8, monthLabel: 'August', total: 250, loansMakingRepayments: 4, showYearHeader: false
	},
];

const renderTable = (props = {}) => {
	const kvTrackEvent = vi.fn();
	return {
		kvTrackEvent,
		...render(RepaymentsSummaryTable, {
			props: { months, selected: null, ...props },
			global: {
				mocks: {
					$kvTrackEvent: kvTrackEvent,
					$filters: { numeral: (value, format) => numeral(value).format(format) },
				},
			},
		}),
	};
};

describe('RepaymentsSummaryTable', () => {
	it('renders a row per month with totals and counts', () => {
		const { getByText, getByTestId } = renderTable();
		expect(getByText('July')).toBeTruthy();
		expect(getByText('$400.00')).toBeTruthy();
		expect(getByTestId('repayments-month-row-2026-7')).toBeTruthy();
	});

	it('selects the month and tracks when the row (not just the link) is clicked', async () => {
		const { getByTestId, emitted, kvTrackEvent } = renderTable();
		await fireEvent.click(getByTestId('repayments-month-row-2026-8'));
		expect(emitted().select[0][0]).toMatchObject({ year: 2026, month: 8 });
		expect(kvTrackEvent).toHaveBeenCalledWith('portfolio', 'click', 'Estimated repayments month', 'August');
	});

	it('selects once (no double-fire) when the month button is clicked', async () => {
		const { getByText, emitted } = renderTable();
		await fireEvent.click(getByText('August'));
		expect(emitted().select).toHaveLength(1);
	});
});

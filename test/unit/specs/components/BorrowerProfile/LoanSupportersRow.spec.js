import { render } from '@testing-library/vue';
import LoanSupportersRow from '#src/components/BorrowerProfile/LoanSupportersRow';
import { globalOptions } from '../../../specUtils';

const renderRow = lenderCount => render(LoanSupportersRow, {
	props: {
		loan: {
			id: 1,
			name: 'Rachel',
			status: 'fundraising',
			lenders: { totalCount: lenderCount },
		},
	},
	global: globalOptions,
});

describe('LoanSupportersRow', () => {
	it('says "1 person supporting" the borrower when the loan has one lender', () => {
		const { getByTestId } = renderRow(1);

		expect(getByTestId('bp-loan-supporters-text').textContent.trim()).toBe('1 person supporting Rachel');
	});

	it('shows up to 5 avatar placeholders while the supporters are loading', () => {
		const { getByTestId } = renderRow(22);

		expect(getByTestId('bp-loan-supporters-loading').children).toHaveLength(5);
	});

	it('is hidden when the loan has no lenders yet', () => {
		const { queryByTestId } = renderRow(0);

		expect(queryByTestId('bp-loan-supporters-row')).toBeNull();
	});
});

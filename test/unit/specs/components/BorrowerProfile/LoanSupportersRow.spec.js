import { render } from '@testing-library/vue';
import LoanSupportersRow from '#src/components/BorrowerProfile/LoanSupportersRow';
import { globalOptions } from '../../../specUtils';

const renderRow = (lenderCount, apollo = globalOptions.provide.apollo) => render(LoanSupportersRow, {
	props: {
		loan: {
			id: 1,
			name: 'Rachel',
			status: 'fundraising',
			lenders: { totalCount: lenderCount },
		},
	},
	global: { ...globalOptions, provide: { ...globalOptions.provide, apollo } },
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

	it('shows an avatar for every lender, even one without a name', () => {
		const values = [
			{ id: 1, name: null, image: { url: 'a.jpg' } },
			{ id: 2, name: 'Jorge', image: { url: 'b.jpg' } },
		];
		const data = { lend: { loan: { lenders: { values } } } };
		const apollo = {
			...globalOptions.provide.apollo,
			watchQuery: () => ({ subscribe: ({ next }) => next({ data }) }),
		};
		const { getByTestId } = renderRow(2, apollo);

		expect(getByTestId('participation-lenders').children).toHaveLength(2);
	});
});

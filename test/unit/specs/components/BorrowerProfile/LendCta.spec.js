import { render } from '@testing-library/vue';
import LendCta from '#src/components/BorrowerProfile/LendCta';
import { globalOptions } from '../../../specUtils';

const stubs = {
	JumpLinks: { template: '<div></div>' },
	LoanBookmark: { template: '<div></div>' },
	LendAmountButton: { template: '<div></div>' },
	CompleteLoanWrapper: { template: '<div><slot name="button"></slot></div>' },
	KvAtbModalContainer: { template: '<div></div>' },
};

function renderLendCta(dataOverrides = {}) {
	const Component = {
		...LendCta,
		data() {
			return {
				...LendCta.data.call(this),
				isLoading: false,
				loanAmount: '1000.00',
				fundedAmount: '750.00',
				reservedAmount: '0.00',
				unreservedAmount: '250.00',
				status: 'fundraising',
				minNoteSize: '25.00',
				name: 'Test Borrower',
				numLenders: 30,
				loan: { id: 123 },
				...dataOverrides,
			};
		},
		// Disable apollo block to prevent query execution
		apollo: undefined,
	};

	return render(Component, {
		global: {
			...globalOptions,
			stubs,
		},
		props: { loanId: 123 },
	});
}

describe('LendCta', () => {
	it('fundraising — renders lend button', () => {
		const { getByText } = renderLendCta();
		expect(getByText('Lend now')).toBeTruthy();
	});

	it('payingBack — renders "Find another loan" link', () => {
		const { getByTestId } = renderLendCta({ status: 'payingBack' });
		const button = getByTestId('bp-lend-cta-non-actionable-loan-button');
		expect(button.textContent).toContain('Find another loan');
	});

	it('ended — renders "Find another loan" link', () => {
		const { getByTestId } = renderLendCta({ status: 'ended' });
		const button = getByTestId('bp-lend-cta-non-actionable-loan-button');
		expect(button.textContent).toContain('Find another loan');
	});

	it('defaulted — renders "Find another loan" link', () => {
		const { getByTestId } = renderLendCta({ status: 'defaulted' });
		const button = getByTestId('bp-lend-cta-non-actionable-loan-button');
		expect(button.textContent).toContain('Find another loan');
	});

	it('lender-to-loan — renders "Lend again" button', () => {
		const { getByText } = renderLendCta({ lentPreviously: true });
		expect(getByText('Lend again')).toBeTruthy();
	});
});

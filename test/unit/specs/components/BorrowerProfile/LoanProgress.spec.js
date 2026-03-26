import { render } from '@testing-library/vue';
import numeralFilter from '#src/plugins/numeral-filter';
import LoanProgress from '#src/components/BorrowerProfile/LoanProgress';
import { globalOptions } from '../../../specUtils';

const testGlobalOptions = {
	...globalOptions,
	mocks: {
		...globalOptions.mocks,
		$filters: {
			numeral: (val, fmt) => numeralFilter(val, fmt),
		},
	},
};

const defaultProps = {
	loading: false,
	progressPercent: 0.75,
	moneyLeft: '250.00',
	loanId: 123,
	timeLeft: '5 days',
};

describe('LoanProgress', () => {
	it('fundraising — renders progress and amount to go', () => {
		const { getByTestId } = render(LoanProgress, {
			global: testGlobalOptions,
			props: { ...defaultProps, loanStatus: 'fundraising' },
		});

		expect(getByTestId('bp-summary-amount-to-go').textContent).toContain('$250');
		expect(getByTestId('bp-summary-percent-funded').textContent).toContain('75%');
	});

	it('payingBack — renders repaid text with progress', () => {
		const { getByTestId } = render(LoanProgress, {
			global: testGlobalOptions,
			props: {
				...defaultProps, loanStatus: 'payingBack', progressPercent: 0.60, moneyLeft: '400.00'
			},
		});

		expect(getByTestId('bp-summary-repaid-percent').textContent).toContain('60%');
		expect(getByTestId('bp-summary-repaid-percent').textContent).toContain('repaid');
		expect(getByTestId('bp-summary-repaid-percent').textContent).toContain('$400');
	});

	it('ended — renders Repaid status label', () => {
		const { getByTestId } = render(LoanProgress, {
			global: testGlobalOptions,
			props: { ...defaultProps, loanStatus: 'ended', progressPercent: 1 },
		});

		expect(getByTestId('bp-summary-status-label').textContent).toContain('Repaid');
	});

	it('defaulted — renders Defaulted status label', () => {
		const { getByTestId } = render(LoanProgress, {
			global: testGlobalOptions,
			props: { ...defaultProps, loanStatus: 'defaulted' },
		});

		expect(getByTestId('bp-summary-status-label').textContent).toContain('Defaulted');
	});

	it('refunded — renders Refunded status label', () => {
		const { getByTestId } = render(LoanProgress, {
			global: testGlobalOptions,
			props: { ...defaultProps, loanStatus: 'refunded' },
		});

		expect(getByTestId('bp-summary-status-label').textContent).toContain('Refunded');
	});

	it('issue — renders Issue status label', () => {
		const { getByTestId } = render(LoanProgress, {
			global: testGlobalOptions,
			props: { ...defaultProps, loanStatus: 'issue' },
		});

		expect(getByTestId('bp-summary-status-label').textContent).toContain('Issue');
	});

	it('reviewed — renders Under review status label', () => {
		const { getByTestId } = render(LoanProgress, {
			global: testGlobalOptions,
			props: { ...defaultProps, loanStatus: 'reviewed' },
		});

		expect(getByTestId('bp-summary-status-label').textContent).toContain('Under review');
	});

	it('deleted — renders Deleted status label', () => {
		const { getByTestId } = render(LoanProgress, {
			global: testGlobalOptions,
			props: { ...defaultProps, loanStatus: 'deleted' },
		});

		expect(getByTestId('bp-summary-status-label').textContent).toContain('Deleted');
	});

	it('inactiveExpired — renders Inactive status label', () => {
		const { getByTestId } = render(LoanProgress, {
			global: testGlobalOptions,
			props: { ...defaultProps, loanStatus: 'inactiveExpired' },
		});

		expect(getByTestId('bp-summary-status-label').textContent).toContain('Inactive');
	});
});

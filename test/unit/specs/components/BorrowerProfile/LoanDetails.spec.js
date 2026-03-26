import { render } from '@testing-library/vue';
import LoanDetails from '#src/components/BorrowerProfile/LoanDetails';
import { globalOptions } from '../../../specUtils';

const defaultProps = {
	partnerName: 'Test Partner',
	loanLenderRepaymentTerm: 12,
	repaymentInterval: 'monthly',
	disbursalDate: '2024-01-15T12:00:00Z',
	status: 'fundraising',
};

describe('LoanDetails', () => {
	it('ended loan — renders "Ended date" with formatted date', () => {
		const { getByTestId } = render(LoanDetails, {
			global: globalOptions,
			props: { ...defaultProps, status: 'ended', endedDate: '2025-06-15T12:00:00Z' },
		});

		const terminalDate = getByTestId('bp-loan-detail-terminal-date');
		expect(terminalDate.textContent).toContain('Ended date');
		expect(terminalDate.textContent).toContain('June 15, 2025');
	});

	it('defaulted loan — renders "Defaulted date" with formatted date', () => {
		const { getByTestId } = render(LoanDetails, {
			global: globalOptions,
			props: { ...defaultProps, status: 'defaulted', defaultedDate: '2025-03-10T12:00:00Z' },
		});

		const terminalDate = getByTestId('bp-loan-detail-terminal-date');
		expect(terminalDate.textContent).toContain('Defaulted date');
		expect(terminalDate.textContent).toContain('March 10, 2025');
	});

	it('expired loan — renders "Expired date" with formatted date', () => {
		const { getByTestId } = render(LoanDetails, {
			global: globalOptions,
			props: {
				...defaultProps, status: 'expired', expiredDate: '2025-02-20T12:00:00Z', disbursalDate: ''
			},
		});

		const terminalDate = getByTestId('bp-loan-detail-terminal-date');
		expect(terminalDate.textContent).toContain('Expired date');
		expect(terminalDate.textContent).toContain('February 20, 2025');
	});

	it('refunded loan — renders "Refunded date" with formatted date', () => {
		const { getByTestId } = render(LoanDetails, {
			global: globalOptions,
			props: { ...defaultProps, status: 'refunded', refundedDate: '2025-04-01T12:00:00Z' },
		});

		const terminalDate = getByTestId('bp-loan-detail-terminal-date');
		expect(terminalDate.textContent).toContain('Refunded date');
		expect(terminalDate.textContent).toContain('April 01, 2025');
	});

	it('fundraising loan — no terminal date row shown', () => {
		const { queryByTestId } = render(LoanDetails, {
			global: globalOptions,
			props: defaultProps,
		});

		expect(queryByTestId('bp-loan-detail-terminal-date')).toBeNull();
	});

	it('renders disbursed date for partner loan', () => {
		const { getByTestId } = render(LoanDetails, {
			global: globalOptions,
			props: defaultProps,
		});

		const disbursedDate = getByTestId('bp-loan-detail-disbursed-date');
		expect(disbursedDate.textContent).toContain('January 15, 2024');
	});
});

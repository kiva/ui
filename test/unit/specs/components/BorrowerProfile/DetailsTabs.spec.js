import { render } from '@testing-library/vue';
import DetailsTabs from '#src/components/BorrowerProfile/DetailsTabs';
import { globalOptions } from '../../../specUtils';

const stubs = {
	LoanDetails: { template: '<div data-testid="bp-loan-details-stub">Loan Details Content</div>' },
	FieldPartnerDetails: { template: '<div data-testid="bp-field-partner-stub">Field Partner Content</div>' },
	TrusteeDetails: { template: '<div data-testid="bp-trustee-stub">Trustee Content</div>' },
	RepaymentSchedule: { template: '<div data-testid="bp-repayment-schedule-stub">Repayment Schedule</div>' },
	KvLightbox: { template: '<div><slot></slot></div>' },
	KvTabs: { template: '<div><slot name="tabNav"></slot><slot name="tabPanels"></slot></div>' },
	KvTab: { template: '<button><slot></slot></button>' },
	KvTabPanel: { template: '<div><slot></slot></div>' },
};

function renderDetailsTabs(dataOverrides = {}) {
	const Component = {
		...DetailsTabs,
		data() {
			return {
				...DetailsTabs.data.call(this),
				loading: false,
				loan: {
					name: 'Maria',
					currency: 'USD',
					flexibleFundraisingEnabled: false,
					loanLenderRepaymentTerm: 12,
					loanTermLenderRepaymentTerm: 12,
					lossLiabilityCurrencyExchange: 'shared',
					repaymentInterval: 'monthly',
					anonymizationLevel: 'none',
					lentTo: false,
					status: 'fundraising',
					disbursalDate: '2024-01-15T12:00:00Z',
				},
				partner: {
					arrearsRate: 0.05,
					avgBorrowerCost: 20,
					avgBorrowerCostType: 'interest',
					avgProfitability: 5,
					chargesFeesInterest: true,
					defaultRate: 0.02,
					id: 1,
					loansAtRiskRate: 0.1,
					name: 'Test Partner',
					riskRating: 3,
					currencyExchangeLossRate: 0.01,
				},
				trustee: {
					id: 0,
					name: '',
					numDefaultedLoans: 0,
					numLoansEndorsedPublic: 0,
					repaymentRate: 0,
					totalLoansValue: '0',
					endorsement: '',
				},
				...dataOverrides,
			};
		},
		mounted() {
			// Skip loadData in tests
		},
	};

	return render(Component, {
		global: {
			...globalOptions,
			stubs,
		},
		props: { loanId: 123, name: 'Maria' },
	});
}

describe('DetailsTabs', () => {
	it('renders loan details tab content', () => {
		const { getByText, getByTestId } = renderDetailsTabs();

		expect(getByText('Loan details')).toBeTruthy();
		expect(getByTestId('bp-loan-details-stub')).toBeTruthy();
	});
});

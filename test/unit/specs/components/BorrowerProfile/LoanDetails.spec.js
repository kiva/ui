import { render } from '@testing-library/vue';
import CookieStore from '#src/util/cookieStore';
import apolloPlugin from '#src/plugins/apollo-plugin';
import LoanDetails from '#src/components/BorrowerProfile/LoanDetails';

const stubs = {
	KvLightbox: {
		template: '<div v-if="visible" data-testid="repayment-lightbox"><slot></slot></div>',
		props: ['visible', 'title'],
		emits: ['lightbox-closed'],
	},
};

function makeApollo({ status = 'payingBack', anonymizationLevel = 'none' } = {}) {
	const data = {
		lend: {
			loan: {
				id: 2000022,
				status,
				lenderRepaymentTerm: 43,
				repaymentInterval: 'Monthly',
				disbursalDate: '2012-07-26T07:00:00Z',
				anonymizationLevel,
				expiredDate: '',
				refundedDate: '',
				defaultedDate: '',
				endedDate: '',
				paidAmount: '100.00',
				loanAmount: '600.00',
				terms: {
					currency: 'INR',
					flexibleFundraisingEnabled: false,
					lenderRepaymentTerm: 43,
					lossLiabilityCurrencyExchange: 'shared',
					disbursalDate: '2012-07-26T07:00:00Z',
					expectedPayments: [],
				},
				partner: { id: 2000100, name: 'Test Partner', chargesFeesInterest: true },
				repayments: [],
			},
		},
	};

	return {
		readFragment: () => {},
		readQuery: () => {},
		query: () => Promise.resolve({ data }),
		watchQuery: () => ({
			subscribe: ({ next }) => next({ data }),
			setVariables: () => {},
		}),
		mutate: () => Promise.resolve({}),
	};
}

function renderLoanDetails({ isPrivileged = true, ...loanOverrides } = {}) {
	return render(LoanDetails, {
		global: {
			plugins: [apolloPlugin],
			directives: { kvTrackEvent: () => {} },
			provide: {
				apollo: makeApollo(loanOverrides),
				cookieStore: new CookieStore(),
			},
			mocks: {
				$kvTrackEvent: () => {},
				$renderConfig: {},
				$route: { query: {} },
			},
			stubs,
		},
		props: { loanId: 2000022, isPrivileged },
	});
}

describe('LoanDetails', () => {
	describe('who sees the repayment schedule', () => {
		const TRIGGER = 'bp-loan-detail-full-repayment-schedule-lightbox-btn';

		it('offers it to a privileged viewer on a paying-back loan', async () => {
			const { findByTestId } = renderLoanDetails({ isPrivileged: true });

			expect(await findByTestId(TRIGGER)).toBeTruthy();
		});

		it('offers it to anyone on an unanonymized fundraising loan', async () => {
			const { findByTestId } = renderLoanDetails({ isPrivileged: false, status: 'fundraising' });

			expect(await findByTestId(TRIGGER)).toBeTruthy();
		});

		// The server sends these viewers no repayments, so offering the schedule showed
		// them an empty one.
		it.each([
			['a paying-back loan', { status: 'payingBack', anonymizationLevel: 'none' }],
			['a pii anonymized fundraising loan', { status: 'fundraising', anonymizationLevel: 'pii' }],
			['a public anonymized fundraising loan', { status: 'fundraising', anonymizationLevel: 'public' }],
		])('withholds it from an unprivileged viewer on %s', async (_label, loan) => {
			const { findByTestId, queryByTestId } = renderLoanDetails({ isPrivileged: false, ...loan });

			await findByTestId('bp-loan-detail-loan-length');

			expect(queryByTestId(TRIGGER)).toBeNull();
		});

		it('withholds it from everyone on a fully anonymized loan', async () => {
			const { findByTestId, queryByTestId } = renderLoanDetails({
				isPrivileged: true,
				anonymizationLevel: 'full',
			});

			await findByTestId('bp-loan-detail-loan-length');

			expect(queryByTestId(TRIGGER)).toBeNull();
		});
	});
});

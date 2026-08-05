import { render, fireEvent } from '@testing-library/vue';
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

function makeApollo(dualStatementNote) {
	const data = {
		lend: {
			loan: {
				id: 453274,
				status: 'payingBack',
				lenderRepaymentTerm: 43,
				repaymentInterval: 'Monthly',
				disbursalDate: '2012-07-26T07:00:00Z',
				anonymizationLevel: 'none',
				expiredDate: '',
				refundedDate: '',
				defaultedDate: '',
				endedDate: '',
				paidAmount: '100.00',
				loanAmount: '600.00',
				dualStatementNote,
				terms: {
					currency: 'INR',
					flexibleFundraisingEnabled: false,
					lenderRepaymentTerm: 43,
					lossLiabilityCurrencyExchange: 'shared',
					disbursalDate: '2012-07-26T07:00:00Z',
					expectedPayments: [],
				},
				partner: { id: 241, name: 'Peoples Forum', chargesFeesInterest: true },
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

function renderLoanDetails(dualStatementNote) {
	return render(LoanDetails, {
		global: {
			plugins: [apolloPlugin],
			directives: { kvTrackEvent: () => {} },
			provide: {
				apollo: makeApollo(dualStatementNote),
				cookieStore: new CookieStore(),
			},
			mocks: {
				$kvTrackEvent: () => {},
				$renderConfig: {},
				$route: { query: {} },
			},
			stubs,
		},
		props: { loanId: 453274, isPrivileged: true },
	});
}

describe('LoanDetails', () => {
	it('links to additional information for a dual-statement loan', async () => {
		const { findByTestId } = renderLoanDetails('Important note about this loan');

		const link = await findByTestId('bp-loan-detail-dual-statement-info');

		expect(link.textContent.trim()).toBe('(Additional information)');
	});

	it('omits the link when the loan is not dual-statement', async () => {
		const { findByTestId, queryByTestId } = renderLoanDetails(null);

		await findByTestId('bp-loan-detail-loan-length');

		expect(queryByTestId('bp-loan-detail-dual-statement-info')).toBeNull();
	});

	it('opens the repayment schedule from the additional information link', async () => {
		const { findByTestId, queryByTestId } = renderLoanDetails('Important note about this loan');

		expect(queryByTestId('repayment-lightbox')).toBeNull();

		await fireEvent.click(await findByTestId('bp-loan-detail-dual-statement-info'));

		expect(await findByTestId('repayment-lightbox')).toBeTruthy();
	});
});

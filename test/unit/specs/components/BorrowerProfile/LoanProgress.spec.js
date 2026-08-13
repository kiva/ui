/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import LoanProgress from '#src/components/BorrowerProfile/LoanProgress';
import { globalOptions, routerLinkStub } from '../../../specUtils';

function mountLoanProgress(props) {
	return mount(LoanProgress, {
		props: { loading: false, loanStatus: 'funded', ...props },
		global: {
			...globalOptions,
			stubs: { RouterLink: routerLinkStub },
			mocks: {
				...globalOptions.mocks,
				$route: { params: { id: '88' } },
			},
		},
	});
}

describe('LoanProgress funded headline', () => {
	it('shows the standard funded headline by default', () => {
		const wrapper = mountLoanProgress();
		expect(wrapper.get('[data-testid="bp-summary-amount-to-go"]').text())
			.toBe('This loan is fully funded!');
	});

	it('shows the live-loan ad fallback headline when isLiveLoanAd is set', () => {
		const wrapper = mountLoanProgress({ isLiveLoanAd: true });
		expect(wrapper.get('[data-testid="bp-summary-amount-to-go"]').text())
			.toBe('This loan was just funded! Find another loan');
	});
});

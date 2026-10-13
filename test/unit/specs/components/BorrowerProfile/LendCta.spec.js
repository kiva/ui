/* eslint-disable import/no-extraneous-dependencies */
import { shallowMount } from '@vue/test-utils';
import LendCta from '#src/components/BorrowerProfile/LendCta';
import { globalOptions } from '../../../specUtils';

function mountLendCta(props = {}) {
	return shallowMount(LendCta, {
		props: {
			loanId: 123,
			loanData: {
				id: 123,
				status: 'fundraising',
				name: 'Maria',
				loanAmount: '500',
				unreservedAmount: '400',
				loanFundraisingInfo: { fundedAmount: '100', reservedAmount: '0', isExpiringSoon: false },
				lenders: { totalCount: 3 },
			},
			...props,
		},
		global: {
			...globalOptions,
			renderStubDefaultSlot: true,
			mocks: { ...globalOptions.mocks, $route: { params: { id: '123' }, query: {} } },
		},
	});
}

describe('LendCta jump links', () => {
	it('shows the divider and the jump links by default (control layout)', () => {
		const wrapper = mountLendCta();

		expect(wrapper.find('[data-testid="bp-lend-cta-jump-links-divider"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="bp-lend-cta-jump-links"]').exists()).toBe(true);
	});

	it('hides the divider and the jump links when hideJumpLinks is on', () => {
		const wrapper = mountLendCta({ hideJumpLinks: true });

		expect(wrapper.find('[data-testid="bp-lend-cta-jump-links-divider"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="bp-lend-cta-jump-links"]').exists()).toBe(false);
	});
});

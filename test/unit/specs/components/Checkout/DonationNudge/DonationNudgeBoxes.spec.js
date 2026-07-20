import { computed } from 'vue';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { mount } from '@vue/test-utils';
import DonationNudgeBoxes from '#src/components/Checkout/DonationNudge/DonationNudgeBoxes';
import { globalOptions } from '../../../../specUtils';

const defaultProps = {
	loanReservationTotal: 100,
	percentageRows: [
		{ percentage: 15, appeal: 'Cover the cost to facilitate this loan' },
		{ percentage: 20, appeal: 'Reach more people around the world!' },
	],
	setDonationAndClose: vi.fn(),
};

describe('DonationNudgeBoxes custom tip default experiment', () => {
	it('resolves the provided experiment version synchronously', () => {
		const wrapper = mount(DonationNudgeBoxes, {
			props: defaultProps,
			global: {
				...globalOptions,
				provide: {
					...globalOptions.provide,
					customTipDefaultVersion: computed(() => 'b'),
				},
			},
		});

		expect(wrapper.vm.customTipDefaultVersion).toBe('b');
	});

	it('defaults to null when no provider exists', () => {
		const wrapper = mount(DonationNudgeBoxes, {
			props: defaultProps,
			global: { ...globalOptions },
		});

		expect(wrapper.vm.customTipDefaultVersion).toBe(null);
	});
});

import { computed } from 'vue';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { shallowMount } from '@vue/test-utils';
import DonationNudgeBoxes from '#src/components/Checkout/DonationNudge/DonationNudgeBoxes';
import { globalOptions } from '../../../../specUtils';

const defaultProps = {
	percentageRows: [],
	setDonationAndClose: () => {},
};

describe('DonationNudgeBoxes custom tip default experiment', () => {
	it('resolves the provided experiment version synchronously', () => {
		const wrapper = shallowMount(DonationNudgeBoxes, {
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
		const wrapper = shallowMount(DonationNudgeBoxes, {
			props: defaultProps,
			global: globalOptions,
		});

		expect(wrapper.vm.customTipDefaultVersion).toBe(null);
	});
});

import { computed } from 'vue';
/* eslint-disable-next-line import/no-extraneous-dependencies -- devDependency used only in tests */
import { shallowMount } from '@vue/test-utils';
import DonationNudgeBoxes from '#src/components/Checkout/DonationNudge/DonationNudgeBoxes';
import { globalOptions } from '../../../../specUtils';

const defaultProps = {
	percentageRows: [],
	setDonationAndClose: () => {},
};

const mountBoxes = ({
	version = null,
	props = {},
	experimentVersion,
	kvTrackEvent = vi.fn(),
} = {}) => shallowMount(DonationNudgeBoxes, {
	props: { ...defaultProps, ...props },
	global: {
		...globalOptions,
		provide: {
			...globalOptions.provide,
			apollo: {
				...globalOptions.provide.apollo,
				// Require the exact cache id so a drifted experiment key fails these tests
				readFragment: ({ id }) => (
					id === 'Experiment:custom_tip_default' && experimentVersion
						? { version: experimentVersion }
						: null
				),
			},
			customTipDefaultVersion: computed(() => version),
		},
		mocks: {
			...globalOptions.mocks,
			$kvTrackEvent: kvTrackEvent,
		},
	},
});

// The amount equals the 15% preset for this total, so the restore path is skipped
const presetMatchProps = {
	currentDonationAmount: '$15.00',
	loanReservationTotal: 100,
	percentageRows: [
		{ percentage: 15, appeal: 'first' },
		{ percentage: 20, appeal: 'second' },
	],
};

describe('DonationNudgeBoxes custom tip default experiment', () => {
	it('resolves the provided experiment version synchronously', () => {
		const wrapper = mountBoxes({ version: 'b' });

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

const focusInput = (wrapper, setSelectionRange = vi.fn()) => {
	wrapper.vm.prefillOnFocus({ target: { value: '$2.00', setSelectionRange } });
	return setSelectionRange;
};

describe('DonationNudgeBoxes custom tip prefill on focus', () => {
	it('keeps a previously chosen $0.00 on open and focus in the treatment variant', () => {
		const wrapper = mountBoxes({ version: 'b', props: { currentDonationAmount: '$0.00' } });

		wrapper.vm.afterLightboxOpens();
		expect(wrapper.vm.customDonationAmount).toBe('$0.00');

		const setSelectionRange = focusInput(wrapper);
		expect(wrapper.vm.customDonationAmount).toBe('$0.00');
		expect(setSelectionRange).not.toHaveBeenCalled();
	});

	it('does not prefill on open in the treatment variant', () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customDonationAmount).toBe(null);
	});

	it('prefills $2.00 with the cursor at the end when the treatment user focuses the empty input', async () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		wrapper.vm.afterLightboxOpens();
		const setSelectionRange = focusInput(wrapper);
		await wrapper.vm.$nextTick();

		expect(wrapper.vm.customDonationAmount).toBe('$2.00');
		expect(setSelectionRange).toHaveBeenCalledWith(5, 5);
	});

	it('prefills $2.00 on focus for the treatment variant when no amount is set', () => {
		const wrapper = mountBoxes({ version: 'b', props: { currentDonationAmount: '' } });

		wrapper.vm.afterLightboxOpens();
		focusInput(wrapper);

		expect(wrapper.vm.customDonationAmount).toBe('$2.00');
	});

	it('prefills on focus through the rendered input', async () => {
		const wrapper = mountBoxes({ version: 'b', props: { currentDonationAmount: '' } });

		wrapper.vm.afterLightboxOpens();
		await wrapper.find('[data-testid="custom-donation-input"]').trigger('focus');

		expect(wrapper.vm.customDonationAmount).toBe('$2.00');
	});

	it('does not replace a $0.00 the user sets after the suggestion', () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		wrapper.vm.afterLightboxOpens();
		focusInput(wrapper);
		wrapper.vm.setInputs('$0.00');
		focusInput(wrapper);

		expect(wrapper.vm.customDonationAmount).toBe('$0.00');
	});

	it('never prefills for the control variant', () => {
		const wrapper = mountBoxes({ version: 'a', props: presetMatchProps });

		wrapper.vm.afterLightboxOpens();
		focusInput(wrapper);

		expect(wrapper.vm.customDonationAmount).toBe(null);
	});

	it('never prefills when the provided version is null', () => {
		const wrapper = mountBoxes({ props: presetMatchProps });

		wrapper.vm.afterLightboxOpens();
		focusInput(wrapper);

		expect(wrapper.vm.customDonationAmount).toBe(null);
	});

	it('restores a prior custom amount and does not replace it on focus in the treatment variant', () => {
		const wrapper = mountBoxes({ version: 'b', props: { currentDonationAmount: '$7.50' } });

		wrapper.vm.afterLightboxOpens();
		focusInput(wrapper);

		expect(wrapper.vm.customDonationAmount).toBe('$7.50');
	});

	it('preserves a typed but unsubmitted amount on reopen in the treatment variant', () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		wrapper.vm.setInputs('$5.00');
		wrapper.vm.afterLightboxOpens();
		focusInput(wrapper);

		expect(wrapper.vm.customDonationAmount).toBe('$5.00');
	});

	it('submits the prefilled amount when the custom option is selected after focusing', () => {
		const setDonationAndClose = vi.fn();
		const wrapper = mountBoxes({ version: 'b', props: { ...presetMatchProps, setDonationAndClose } });

		wrapper.vm.afterLightboxOpens();
		focusInput(wrapper);
		wrapper.vm.setCustomDonationAndClose();

		expect(setDonationAndClose).toHaveBeenCalledWith(2, 'Custom amount');
	});

	it('submits zero when the user edits the prefill back to $0.00', () => {
		const setDonationAndClose = vi.fn();
		const wrapper = mountBoxes({ version: 'b', props: { ...presetMatchProps, setDonationAndClose } });

		wrapper.vm.afterLightboxOpens();
		focusInput(wrapper);
		wrapper.vm.setInputs('$0.00');
		wrapper.vm.setCustomDonationAndClose();

		expect(setDonationAndClose).toHaveBeenCalledWith(0, 'Custom amount');
	});
});

describe('DonationNudgeBoxes custom select button', () => {
	const selectButton = wrapper => wrapper.findComponent('[data-testid="custom-donation-submit-btn"]');

	it('is disabled in the treatment variant while the custom input is empty', () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.selectDisabled).toBe(true);
	});

	it('is disabled in the treatment variant when the input holds only whitespace', () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		wrapper.vm.setInputs('   ');

		expect(wrapper.vm.selectDisabled).toBe(true);
	});

	it('is enabled once the treatment suggestion fills the input', () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		wrapper.vm.afterLightboxOpens();
		focusInput(wrapper);

		expect(wrapper.vm.selectDisabled).toBe(false);
	});

	it('is enabled in the treatment variant for a $0.00 value so a zero tip can still be chosen', () => {
		const wrapper = mountBoxes({ version: 'b', props: { currentDonationAmount: '$0.00' } });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.selectDisabled).toBe(false);
	});

	it.each([['control', 'a'], ['unassigned', null]])('is never disabled for %s users', (label, version) => {
		const wrapper = mountBoxes({ version, props: presetMatchProps });

		wrapper.vm.afterLightboxOpens();

		expect(wrapper.vm.customInputIsEmpty).toBe(true);
		expect(wrapper.vm.selectDisabled).toBe(false);
		expect(selectButton(wrapper).attributes('state')).toBe('');
	});

	it('stays empty and disabled in the treatment variant when a cleared input loses focus', () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		wrapper.vm.afterLightboxOpens();
		focusInput(wrapper);
		wrapper.vm.setInputs('');
		wrapper.vm.validateInput();

		expect(wrapper.vm.customDonationAmount).toBe('');
		expect(wrapper.vm.selectDisabled).toBe(true);
	});

	it('stays empty in the treatment variant when a restored amount is deleted and the input loses focus', () => {
		const wrapper = mountBoxes({ version: 'b', props: { currentDonationAmount: '$2.00' } });

		wrapper.vm.afterLightboxOpens();
		expect(wrapper.vm.customDonationAmount).toBe('$2.00');

		wrapper.vm.setInputs('');
		wrapper.vm.validateInput();

		expect(wrapper.vm.customDonationAmount).toBe('');
		expect(wrapper.vm.selectDisabled).toBe(true);
	});

	it.each([
		['control', 'a'],
		['unassigned', null],
	])('formats a cleared input to $0.00 on blur for %s users', (label, version) => {
		const wrapper = mountBoxes({ version, props: { currentDonationAmount: '$7.50' } });

		wrapper.vm.afterLightboxOpens();
		wrapper.vm.setInputs('');
		wrapper.vm.validateInput();

		expect(wrapper.vm.customDonationAmount).toBe('$0.00');
	});

	it('still formats a typed amount on blur', () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		wrapper.vm.setInputs('3');
		wrapper.vm.validateInput();

		expect(wrapper.vm.customDonationAmount).toBe('$3.00');
	});

	it('passes the disabled state to the button in the treatment variant', async () => {
		const wrapper = mountBoxes({ version: 'b', props: presetMatchProps });

		expect(selectButton(wrapper).attributes('state')).toBe('disabled');

		wrapper.vm.setInputs('$3.00');
		await wrapper.vm.$nextTick();

		expect(selectButton(wrapper).attributes('state')).toBe('');
	});
});

describe('DonationNudgeBoxes experiment exposure on open', () => {
	it('fires the exposure event with the control label when the modal opens', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({ version: 'a', experimentVersion: 'a', kvTrackEvent });

		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).toHaveBeenCalledWith('basket', 'EXP-MP-3039-July2026', 'a', undefined);
	});

	it('fires the exposure event with the treatment label on open without prefilling', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({
			version: 'b',
			experimentVersion: 'b',
			kvTrackEvent,
			props: { currentDonationAmount: '$0.00' },
		});

		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).toHaveBeenCalledWith('basket', 'EXP-MP-3039-July2026', 'b', undefined);
		expect(wrapper.vm.customDonationAmount).toBe('$0.00');
	});

	it('fires once per open with no de-duplication', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({ version: 'a', experimentVersion: 'a', kvTrackEvent });

		wrapper.vm.afterLightboxOpens();
		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).toHaveBeenCalledTimes(2);
	});

	it('does not fire again when the treatment user focuses the input', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({ version: 'b', experimentVersion: 'b', kvTrackEvent });

		wrapper.vm.afterLightboxOpens();
		focusInput(wrapper);

		expect(kvTrackEvent).toHaveBeenCalledTimes(1);
	});

	it('does not fire from rendering alone before the modal is opened', () => {
		const kvTrackEvent = vi.fn();
		mountBoxes({ version: 'a', experimentVersion: 'a', kvTrackEvent });

		expect(kvTrackEvent).not.toHaveBeenCalled();
	});

	it('does not fire when the user is unassigned', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({ version: 'unassigned', experimentVersion: 'unassigned', kvTrackEvent });

		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).not.toHaveBeenCalled();
	});

	it('does not fire when no assignment exists in the cache', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({ version: 'a', kvTrackEvent });

		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).not.toHaveBeenCalled();
	});

	it('does not fire without a provided version even if the cache holds an assignment', () => {
		const kvTrackEvent = vi.fn();
		const wrapper = mountBoxes({ experimentVersion: 'a', kvTrackEvent });

		wrapper.vm.afterLightboxOpens();

		expect(kvTrackEvent).not.toHaveBeenCalled();
	});
});

import { render, fireEvent } from '@testing-library/vue';
import LoanDetailsRailToggle from '#src/components/BorrowerProfile/LoanDetailsRailToggle';
import { globalOptions } from '../../../specUtils';

function renderToggle(props = {}) {
	return render(LoanDetailsRailToggle, {
		props,
		global: { ...globalOptions },
	});
}

describe('LoanDetailsRailToggle', () => {
	it('emits update:modelValue(true) when toggled on', async () => {
		const { getByLabelText, emitted } = renderToggle({ modelValue: false });

		await fireEvent.click(getByLabelText('Show loan details in the sidebar'));

		expect(emitted()['update:modelValue'][0]).toEqual([true]);
	});

	it('emits update:modelValue(false) when toggled off', async () => {
		const { getByLabelText, emitted } = renderToggle({ modelValue: true });

		await fireEvent.click(getByLabelText('Show loan details in the sidebar'));

		expect(emitted()['update:modelValue'][0]).toEqual([false]);
	});
});

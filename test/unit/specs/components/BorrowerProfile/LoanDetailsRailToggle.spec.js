import { render, fireEvent } from '@testing-library/vue';
import LoanDetailsRailToggle from '#src/components/BorrowerProfile/LoanDetailsRailToggle';
import { globalOptions } from '../../../specUtils';

function renderToggle(props = {}) {
	const trackEvent = vi.fn();
	const utils = render(LoanDetailsRailToggle, {
		props: { loanId: 12345, ...props },
		global: {
			...globalOptions,
			mocks: { ...globalOptions.mocks, $kvTrackEvent: trackEvent },
		},
	});
	return { ...utils, trackEvent };
}

describe('LoanDetailsRailToggle', () => {
	it('emits change(true) and tracks "on" when toggled on', async () => {
		const { getByLabelText, emitted, trackEvent } = renderToggle({ checked: false });

		await fireEvent.click(getByLabelText('Show loan details in the sidebar'));

		expect(emitted().change[0]).toEqual([true]);
		expect(trackEvent).toHaveBeenCalledWith('borrower-profile', 'toggle', 'loan-details-sidebar', 'on', 12345);
	});

	it('emits change(false) and tracks "off" when toggled off', async () => {
		const { getByLabelText, emitted, trackEvent } = renderToggle({ checked: true });

		await fireEvent.click(getByLabelText('Show loan details in the sidebar'));

		expect(emitted().change[0]).toEqual([false]);
		expect(trackEvent).toHaveBeenCalledWith('borrower-profile', 'toggle', 'loan-details-sidebar', 'off', 12345);
	});
});

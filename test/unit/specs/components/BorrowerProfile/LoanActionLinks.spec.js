/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import LoanActionLinks from '#src/components/BorrowerProfile/LoanActionLinks';
import { globalOptions } from '../../../specUtils';

function mountLinks() {
	return mount(LoanActionLinks, { global: { ...globalOptions } });
}

describe('LoanActionLinks', () => {
	it('renders a "Loan details" and a "Share" button', () => {
		const wrapper = mountLinks();

		const loanDetails = wrapper.find('[data-testid="bp-summary-loan-details-link"]');
		const share = wrapper.find('[data-testid="bp-summary-share-link"]');

		expect(loanDetails.element.tagName).toBe('BUTTON');
		expect(loanDetails.text()).toBe('Loan details');
		expect(share.element.tagName).toBe('BUTTON');
		expect(share.text()).toBe('Share');
	});

	it('emits loan-details when "Loan details" is clicked', async () => {
		const wrapper = mountLinks();

		await wrapper.find('[data-testid="bp-summary-loan-details-link"]').trigger('click');

		expect(wrapper.emitted('loan-details')).toHaveLength(1);
		expect(wrapper.emitted('share')).toBeUndefined();
	});

	it('emits share when "Share" is clicked', async () => {
		const wrapper = mountLinks();

		await wrapper.find('[data-testid="bp-summary-share-link"]').trigger('click');

		expect(wrapper.emitted('share')).toHaveLength(1);
		expect(wrapper.emitted('loan-details')).toBeUndefined();
	});
});

/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import WhyLoansBanner from '#src/components/BorrowerProfile/WhyLoansBanner';
import { globalOptions } from '../../../specUtils';

function mountBanner(loan = { name: 'Areefa' }) {
	return mount(WhyLoansBanner, {
		props: { loan },
		global: globalOptions,
	});
}

describe('WhyLoansBanner', () => {
	it('renders the heading and the three points in order', () => {
		const wrapper = mountBanner();

		expect(wrapper.find('[data-testid="bp-why-loans-heading"]').text()).toBe('Why loans?');
		const titles = wrapper.findAll('[data-testid="bp-why-loans-point"] h3').map(h => h.text());
		expect(titles).toEqual([
			'Dignity through lending',
			'90% improved their quality of life',
			'Your loan can help again',
		]);
		expect(wrapper.findAll('[data-testid="bp-why-loans-point"] svg')).toHaveLength(3);
	});

	it('uses the borrower name in the first and third points', () => {
		const wrapper = mountBanner();
		const copy = wrapper.findAll('[data-testid="bp-why-loans-point"] p').map(p => p.text());

		expect(copy[0]).toBe('A loan goes beyond one-time support, helping Areefa invest in their own plans.');
		expect(copy[1]).toBe(
			'These loans prioritize social impact through fair, non-predatory lending for long-term success.',
		);
		expect(copy[2]).toBe('96% of Kiva loans are repaid. As Areefa repays, you can relend your money.');
	});

	it.each([
		['the loan has not loaded yet', {}],
		['the loan is fully anonymized', { name: 'Maria', anonymizationLevel: 'full' }],
	])('falls back to "this borrower" when %s', (_, loan) => {
		const wrapper = mountBanner(loan);
		const copy = wrapper.findAll('[data-testid="bp-why-loans-point"] p').map(p => p.text());

		expect(copy[0]).toContain('helping this borrower invest');
		expect(copy[2]).toContain('As this borrower repays');
	});

	it('keeps the placeholder name of a pii-anonymized loan', () => {
		const wrapper = mountBanner({ name: 'Maria', anonymizationLevel: 'pii' });

		expect(wrapper.findAll('[data-testid="bp-why-loans-point"] p')[0].text()).toContain('helping Maria invest');
	});

	it('exposes "How it works" as a real button and emits how-it-works once per click', async () => {
		const wrapper = mountBanner();
		const button = wrapper.find('[data-testid="bp-why-loans-how-it-works"]');

		expect(button.element.tagName).toBe('BUTTON');
		expect(button.attributes('type')).toBe('button');
		expect(button.text()).toBe('How it works');

		await button.trigger('click');

		expect(wrapper.emitted('how-it-works')).toHaveLength(1);
	});
});

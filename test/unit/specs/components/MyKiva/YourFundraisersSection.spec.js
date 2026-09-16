/* eslint-disable import/no-extraneous-dependencies, vue/one-component-per-file */
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import YourFundraisersSection from '#src/components/MyKiva/YourFundraisersSection';

vi.mock('#src/util/imageUtils', () => ({
	optimizeContentfulUrl: url => url,
}));

vi.mock('#src/assets/inline-svgs/logos/kiva-logo.svg', () => ({
	default: defineComponent({
		name: 'KivaLogo',
		template: '<div />',
	}),
}));

vi.mock('@kiva/kv-components', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		KvMaterialIcon: defineComponent({
			name: 'KvMaterialIcon',
			template: '<i />',
		}),
	};
});

const fund = {
	id: 'abc123',
	currentAmountDonated: '1,250.00',
	totalParticipants: 4,
	lendingStats: { totalLivesTouched: 2 },
	display: {
		ctaTitle: "Nathan's birthday fundraiser!",
		avatar: { id: 1, url: 'https://example.test/avatar.jpg' },
	},
	owner: { id: 9, name: 'Nathan' },
};

const mountComponent = (fundOverrides = {}) => mount(YourFundraisersSection, {
	props: { fund: { ...fund, ...fundOverrides } },
	global: {
		directives: {
			'kv-track-event': {},
		},
	},
});

describe('YourFundraisersSection', () => {
	it('renders the owner heading and the fundraiser title', () => {
		const wrapper = mountComponent();
		expect(wrapper.text()).toContain('Your fundraisers');
		expect(wrapper.text()).toContain("Nathan's birthday fundraiser!");
	});

	it('renders the owner avatar when the fund has one', () => {
		const wrapper = mountComponent();
		const avatar = wrapper.find('img[src="https://example.test/avatar.jpg"]');
		expect(avatar.exists()).toBe(true);
	});

	it('falls back to the Kiva logo placeholder when the fund has no avatar', () => {
		const wrapper = mountComponent({ display: { ctaTitle: 'A fund', avatar: null } });
		expect(wrapper.find('img[src="https://example.test/avatar.jpg"]').exists()).toBe(false);
		expect(wrapper.findComponent({ name: 'KivaLogo' }).exists()).toBe(true);
	});

	it('renders the three fund stats', () => {
		const wrapper = mountComponent();
		expect(wrapper.text()).toContain('Participants');
		expect(wrapper.text()).toContain('Dollars raised');
		expect(wrapper.text()).toContain('Lives touched');
		expect(wrapper.text()).toContain('4');
		expect(wrapper.text()).toContain('2');
	});

	it('formats the Money scalar rather than coercing it', () => {
		// Money arrives comma-formatted, so Number() would give NaN above 999.
		const wrapper = mountComponent();
		expect(wrapper.text()).toContain('$1,250.00');
	});

	it('links View to the lenders own fund page', () => {
		const wrapper = mountComponent();
		const hrefs = wrapper.findAll('a').map(a => a.attributes('href'));
		expect(hrefs).toContain('/gf/abc123');
	});

	it('links the companion card to the fundraiser landing page', () => {
		const wrapper = mountComponent();
		const hrefs = wrapper.findAll('a').map(a => a.attributes('href'));
		expect(hrefs).toContain('/lp/event-fundraiser');
		expect(wrapper.text()).toContain("Have another event you'd like to fundraise for?");
	});

	it('falls back to a possessive owner name when the fund has no title', () => {
		const wrapper = mountComponent({ display: { ctaTitle: null, avatar: null } });
		expect(wrapper.text()).toContain("Nathan's fundraiser");
	});
});

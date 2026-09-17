/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import YourFundraiserCard from '#src/components/MyKiva/YourFundraiserCard';

vi.mock('#src/assets/inline-svgs/logos/kiva-logo.svg', () => ({
	default: defineComponent({
		name: 'KivaLogo',
		template: '<div />',
	}),
}));

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

const mountCard = (overrides = {}) => mount(YourFundraiserCard, {
	props: { fund: { ...fund, ...overrides } },
	global: {
		directives: {
			'kv-track-event': {},
		},
	},
});

describe('YourFundraiserCard', () => {
	it('renders the fund title and the three stats', () => {
		const wrapper = mountCard();
		expect(wrapper.text()).toContain("Nathan's birthday fundraiser!");
		expect(wrapper.text()).toContain('Participants');
		expect(wrapper.text()).toContain('Dollars raised');
		expect(wrapper.text()).toContain('Lives touched');
		expect(wrapper.text()).toContain('4');
		expect(wrapper.text()).toContain('2');
	});

	it('formats the Money scalar rather than coercing it', () => {
		// Money arrives comma-formatted, so Number() would give NaN above 999.
		expect(mountCard().text()).toContain('$1,250.00');
	});

	it('links View to the fund page', () => {
		const hrefs = mountCard().findAll('a').map(a => a.attributes('href'));
		expect(hrefs).toContain('/gf/abc123');
	});

	it('renders the owner avatar when the fund has one', () => {
		expect(mountCard().find('img[src="https://example.test/avatar.jpg"]').exists()).toBe(true);
	});

	it('falls back to the Kiva logo placeholder when the fund has no avatar', () => {
		const wrapper = mountCard({ display: { ctaTitle: 'A fund', avatar: null } });
		expect(wrapper.find('img[src="https://example.test/avatar.jpg"]').exists()).toBe(false);
		expect(wrapper.findComponent({ name: 'KivaLogo' }).exists()).toBe(true);
	});

	it('derives the occasion headline when the fund has no title of its own', () => {
		// Must match what the fund page shows, or the lender sees two different names.
		const wrapper = mountCard({ display: { ctaTitle: null, occasion: 'BIRTHDAY', avatar: null } });
		expect(wrapper.text()).toContain("Nathan's birthday fund");
	});

	it('falls back to the lasting impact default with no title and no occasion', () => {
		const wrapper = mountCard({ display: { ctaTitle: null, avatar: null } });
		expect(wrapper.text()).toContain("Nathan's lasting impact fund");
	});

	it('names no event for the OTHER occasion', () => {
		const wrapper = mountCard({ display: { ctaTitle: null, occasion: 'OTHER', avatar: null } });
		expect(wrapper.text()).toContain("Nathan's fund");
	});

	it('uses the generic default for occasions the fund page has no copy for', () => {
		// ANNIVERSARY and INTERNATIONAL_DAY are in the enum but absent from the fund page's
		// registry, so it shows the generic default for them and this has to agree.
		const wrapper = mountCard({ display: { ctaTitle: null, occasion: 'ANNIVERSARY', avatar: null } });
		expect(wrapper.text()).toContain("Nathan's lasting impact fund");
	});
});

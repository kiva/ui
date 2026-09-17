/* eslint-disable import/no-extraneous-dependencies, vue/one-component-per-file */
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import YourFundraisersSection from '#src/components/MyKiva/YourFundraisersSection';

vi.mock('#src/util/imageUtils', () => ({
	optimizeContentfulUrl: url => url,
}));

vi.mock('@kiva/kv-components', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		KvMaterialIcon: defineComponent({
			name: 'KvMaterialIcon',
			template: '<i />',
		}),
		KvCarousel: defineComponent({
			name: 'KvCarousel',
			setup(_, { slots }) {
				// Insertion order, not sorted — that is what KvCarousel renders slots in.
				return () => h(
					'div',
					{ class: 'kv-carousel-stub' },
					Object.keys(slots).map(slotName => slots[slotName]?.())
				);
			},
		}),
	};
});

const fund = (id, ctaTitle) => ({
	id,
	currentAmountDonated: '10.00',
	totalParticipants: 1,
	lendingStats: { totalLivesTouched: 1 },
	display: { ctaTitle, avatar: null },
	owner: { id: 9, name: 'Nathan' },
});

const mountSection = funds => mount(YourFundraisersSection, {
	props: { funds },
	global: {
		directives: {
			'kv-track-event': {},
		},
		stubs: {
			YourFundraiserCard: defineComponent({
				name: 'YourFundraiserCard',
				props: { fund: { type: Object, required: true } },
				template: '<div class="fund-card-stub">{{ fund.display.ctaTitle }}</div>',
			}),
		},
	},
});

describe('YourFundraisersSection', () => {
	it('renders the owner heading', () => {
		expect(mountSection([fund('a', 'First fund')]).text()).toContain('Your fundraisers');
	});

	it('offers a Manage All link to the fund management page instead of the New badge', () => {
		const wrapper = mountSection([fund('a', 'First fund')]);
		expect(wrapper.text()).toContain('Manage All');
		expect(wrapper.text()).not.toContain('New!');
		expect(wrapper.findAll('a').map(a => a.attributes('href'))).toContain('/gfm');
	});

	it('renders a card for every fund', () => {
		const wrapper = mountSection([
			fund('a', 'First fund'),
			fund('b', 'Second fund'),
			fund('c', 'Third fund'),
		]);
		expect(wrapper.findAll('.fund-card-stub')).toHaveLength(3);
		expect(wrapper.text()).toContain('First fund');
		expect(wrapper.text()).toContain('Second fund');
		expect(wrapper.text()).toContain('Third fund');
	});

	it('renders the start-another card after every fund', () => {
		// Vue orders a standalone dynamic slot ahead of v-for generated ones, which put it first.
		const wrapper = mountSection([fund('a', 'First fund'), fund('b', 'Second fund')]);
		const text = wrapper.text();
		expect(text.indexOf('First fund')).toBeLessThan(text.indexOf('Have another event'));
		expect(text.indexOf('Second fund')).toBeLessThan(text.indexOf('Have another event'));
	});

	it('renders the start-another card once regardless of fund count', () => {
		const wrapper = mountSection([fund('a', 'First fund'), fund('b', 'Second fund')]);
		const hrefs = wrapper.findAll('a').map(a => a.attributes('href'));
		expect(hrefs.filter(href => href === '/lp/event-fundraiser')).toHaveLength(1);
		expect(wrapper.text()).toContain("Have another event you'd like to fundraise for?");
	});
});

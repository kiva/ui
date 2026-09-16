/* eslint-disable import/no-extraneous-dependencies, vue/one-component-per-file */
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import FundraisersCarousel from '#src/components/MyKiva/FundraisersCarousel';
import { fundraiserOccasionCards } from '#src/util/fundraiserOccasions';

vi.mock('#src/composables/useBreakpoints', () => ({
	default: () => ({
		isMobile: ref(false),
		isMedium: ref(false),
		isLarge: ref(true),
	}),
}));

vi.mock('#src/util/imageUtils', () => ({
	optimizeContentfulUrl: url => url,
}));

vi.mock('@kiva/kv-components', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		KvCarousel: defineComponent({
			name: 'KvCarousel',
			setup(_, { slots }) {
				return () => h(
					'div',
					{ class: 'kv-carousel-stub' },
					Object.keys(slots).sort().map(slotName => slots[slotName]?.())
				);
			},
		}),
		KvTooltip: defineComponent({
			name: 'KvTooltip',
			setup(_, { slots }) {
				return () => h(
					'div',
					{ class: 'kv-tooltip-stub' },
					[slots.title?.(), slots.default?.(), slots.action?.()]
				);
			},
		}),
		KvMaterialIcon: defineComponent({
			name: 'KvMaterialIcon',
			template: '<i />',
		}),
	};
});

const mountComponent = () => mount(FundraisersCarousel, {
	global: {
		directives: {
			'kv-track-event': {},
		},
	},
});

describe('FundraisersCarousel', () => {
	it('renders the section heading, badge and subhead', () => {
		const wrapper = mountComponent();
		expect(wrapper.text()).toContain('Fundraisers with Kiva');
		expect(wrapper.text()).toContain('New!');
		expect(wrapper.text()).toContain(
			'Easily create and share fundraisers that support the communities and places you choose.'
		);
	});

	it('renders every occasion card', () => {
		const wrapper = mountComponent();
		fundraiserOccasionCards.forEach(card => {
			expect(wrapper.text()).toContain(card.title);
		});
	});

	it('points each occasion card at its own configure deep link', () => {
		const wrapper = mountComponent();
		const hrefs = wrapper.findAll('a').map(a => a.attributes('href'));
		expect(hrefs).toContain('/gf/configure?occasion=holiday');
		expect(hrefs).toContain('/gf/configure?occasion=memorial');
	});

	it('keeps the landing-page card last', () => {
		// It is not an occasion, so it must not be sorted in among the create-flow cards.
		const last = fundraiserOccasionCards[fundraiserOccasionCards.length - 1];
		expect(last.linkLabel).toBe('More about fundraisers');
		expect(last.to).toBe('/lp/event-fundraiser');
	});

	it('links the tooltip to the fundraiser landing page', () => {
		const wrapper = mountComponent();
		const tooltip = wrapper.find('.kv-tooltip-stub');
		expect(tooltip.text()).toContain('Fundraisers at Kiva');
		expect(tooltip.find('a').attributes('href')).toBe('/lp/event-fundraiser');
	});
});

/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import FundraisersSection from '#src/components/MyKiva/FundraisersSection';

const stub = (name, props = []) => defineComponent({
	name,
	props,
	template: `<div class="${name}-stub" />`,
});

const mountComponent = (funds = []) => mount(FundraisersSection, {
	props: { funds },
	global: {
		stubs: {
			FundraisersCarousel: stub('FundraisersCarousel'),
			YourFundraisersSection: stub('YourFundraisersSection', ['funds']),
		},
	},
});

const fundOwnedOn = date => ({ id: `fund-${date}`, createdDate: date });

describe('FundraisersSection', () => {
	it('shows the occasion carousel when the lender owns no fund', () => {
		const wrapper = mountComponent([]);
		expect(wrapper.find('.FundraisersCarousel-stub').exists()).toBe(true);
		expect(wrapper.find('.YourFundraisersSection-stub').exists()).toBe(false);
	});

	it('shows the owner state when the lender owns a fund', () => {
		const wrapper = mountComponent([fundOwnedOn('2026-01-01')]);
		expect(wrapper.find('.YourFundraisersSection-stub').exists()).toBe(true);
		expect(wrapper.find('.FundraisersCarousel-stub').exists()).toBe(false);
	});

	it('passes every fund, most recently created first', () => {
		const wrapper = mountComponent([
			fundOwnedOn('2024-05-01'),
			fundOwnedOn('2026-03-01'),
			fundOwnedOn('2025-07-01'),
		]);
		const passed = wrapper.findComponent({ name: 'YourFundraisersSection' }).props('funds');
		expect(passed.map(f => f.id)).toEqual([
			'fund-2026-03-01',
			'fund-2025-07-01',
			'fund-2024-05-01',
		]);
	});

	it('does not mutate the funds prop while sorting', () => {
		const funds = [fundOwnedOn('2024-05-01'), fundOwnedOn('2026-03-01')];
		mountComponent(funds);
		expect(funds.map(f => f.id)).toEqual(['fund-2024-05-01', 'fund-2026-03-01']);
	});

	it('falls back to the carousel when no funds are provided', () => {
		const wrapper = mount(FundraisersSection, {
			global: {
				stubs: {
					FundraisersCarousel: stub('FundraisersCarousel'),
					YourFundraisersSection: stub('YourFundraisersSection', ['fund']),
				},
			},
		});
		expect(wrapper.find('.FundraisersCarousel-stub').exists()).toBe(true);
	});
});

/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import SideSheetLoanTags from '#src/components/BorrowerSideSheet/SideSheetLoanTags';

vi.mock('@kiva/kv-components', () => ({
	loanCardComputedProperties: () => ({
		loanCallouts: { value: [{ label: 'Default callout' }] },
	}),
	KvLoanCallouts: {
		name: 'KvLoanCallouts',
		props: ['callouts', 'addBgColor'],
		template: '<div class="callouts"><span v-for="(c, i) in callouts" :key="i">{{ c.label }}</span></div>',
	},
	KvLoadingPlaceholder: {
		name: 'KvLoadingPlaceholder',
		template: '<div class="loading" />',
	},
}));

function mountTags(aiLoanPills) {
	return mount(SideSheetLoanTags, {
		props: { aiLoanPills },
		global: {
			provide: {
				borrowerProfile: { loan: { value: { id: 123 } } },
			},
		},
	});
}

describe('SideSheetLoanTags.vue', () => {
	it('shows AI loan pills when they are provided', () => {
		const wrapper = mountTags([{ label: 'Woman-led' }, { label: 'Agriculture' }]);

		expect(wrapper.text()).toContain('Woman-led');
		expect(wrapper.text()).toContain('Agriculture');
		expect(wrapper.text()).not.toContain('Default callout');
	});

	it('falls back to the default loan callouts when there are no AI pills', () => {
		const wrapper = mountTags([]);

		expect(wrapper.text()).toContain('Default callout');
	});
});

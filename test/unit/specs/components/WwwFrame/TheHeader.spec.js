import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import TheHeader from '@/components/WwwFrame/TheHeader';
import kvAnalytics from '@/plugins/kv-analytics-plugin';
import { MockKvAuth0 } from '@/util/KvAuth0';

const localVue = createLocalVue();
localVue.use(kvAnalytics);

describe('TheHeader', () => {
	it('should hide/show the search area when the search toggle button is clicked', () => {
		const wrapper = shallowMount(TheHeader, {
			localVue,
			stubs: {
				RouterLink: RouterLinkStub,
				SearchBar: {
					template: '<div></div>',
					methods: { focus() {} }
				},
			},
			provide: {
				apollo: {},
				kvAuth0: MockKvAuth0,
			},
		});
		const toggle = wrapper.find('.search-toggler');
		const area = wrapper.find('#top-nav-search-area');

		expect(area.attributes()['aria-hidden']).toBe('true');
		toggle.trigger('click');
		expect(area.attributes()['aria-hidden']).toBe('false');
		toggle.trigger('click');
		expect(area.attributes()['aria-hidden']).toBe('true');
	});
});

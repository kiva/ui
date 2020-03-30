import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import TheHeader from '@/components/WwwFrame/TheHeader';
import kvAnalytics from '@/plugins/kv-analytics-plugin';
import { MockKvAuth0 } from '@/util/KvAuth0';
import numeralFilter from '@/plugins/numeral-filter';

const localVue = createLocalVue();
localVue.use(kvAnalytics);
localVue.filter('numeral', numeralFilter);

describe('TheHeader', () => {
	it('should hide/show the search area when the search toggle button is clicked', async () => {
		const focusMethod = jest.fn();
		const wrapper = shallowMount(TheHeader, {
			localVue,
			stubs: {
				RouterLink: RouterLinkStub,
				SearchBar: {
					template: '<div></div>',
					methods: {
						focus: focusMethod
					}
				},
				TheLendMenu: {
					template: '<div></div>'
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
		await localVue.nextTick();
		expect(focusMethod).toHaveBeenCalled();
		expect(area.attributes()['aria-hidden']).toBe('false');

		toggle.trigger('click');
		await localVue.nextTick();
		expect(focusMethod).not.toHaveBeenCalled();
		expect(area.attributes()['aria-hidden']).toBe('true');
	});
});

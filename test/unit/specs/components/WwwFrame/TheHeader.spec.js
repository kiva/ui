import { shallowMount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import VueRouter from 'vue-router';
import TheHeader from '@/components/WwwFrame/TheHeader';
import kvAnalytics from '@/plugins/kv-analytics-plugin';
import CookieStore from '@/util/cookieStore';
import { MockKvAuth0 } from '@/util/KvAuth0';
import numeralFilter from '@/plugins/numeral-filter';

const localVue = createLocalVue();
localVue.use(kvAnalytics);
localVue.use(VueRouter);
localVue.filter('numeral', numeralFilter);
const router = new VueRouter();

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
				apollo: {
					readFragment: () => {}
				},
				cookieStore: new CookieStore(),
				kvAuth0: MockKvAuth0,
			},
			router,
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
		expect(area.attributes()['aria-hidden']).toBe('true');
	});
});

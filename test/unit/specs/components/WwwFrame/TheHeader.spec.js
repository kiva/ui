import { shallow, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Vuex from 'vuex';
import TheHeader from '@/components/WwwFrame/TheHeader';
import createMyModule from '@/store/modules/my';
import createShopModule from '@/store/modules/shop';
import kvAnalytics from '@/plugins/kv-analytics-plugin';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(kvAnalytics);

describe('TheHeader', () => {
	it('should hide/show the search area when the search toggle button is clicked', () => {
		const wrapper = shallow(TheHeader, {
			localVue,
			store: new Vuex.Store({
				modules: {
					my: createMyModule(),
					shop: createShopModule(),
				}
			}),
			stubs: {
				RouterLink: RouterLinkStub,
				SearchBar: {
					template: '<div></div>',
					methods: { focus() {} }
				},
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

	it('asyncData() should dispatch the \'getMyKivaInfo\' action', () => {
		const store = {
			dispatch: jest.fn()
		};
		TheHeader.asyncData({ store });
		expect(store.dispatch.mock.calls[0][0]).toBe('getMyKivaInfo');
	});
});

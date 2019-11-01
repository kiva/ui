import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import RouteListing from '@/pages/UiSiteMap/RouteListing';
import routes from '@/router/routes';

const localVue = createLocalVue();
localVue.use(VueRouter);

// Async components in route causes some issues with components that use
// require.context. Lets remove the component from the route since we are
// just testing the number of routes
const routesWithOutComponents = routes.map(route => ({
	path: route.path
}));

const router = new VueRouter({ routes: routesWithOutComponents });

describe('RouteListing.vue', () => {
	it('should render 2 labels', () => {
		const wrapper = shallowMount(RouteListing, {
			localVue,
			router,
		});
		const list = wrapper.findAll('li');
		expect(list.length).toEqual(routes.length);
	});
});

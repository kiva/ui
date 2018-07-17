import Vue from 'vue';
import RouteListing from '@/pages/UiSiteMap/RouteListing';
import routes from '@/router/routes';
import createRouter from '@/router';


describe('RouteListing.vue', () => {
	it('should render 2 labels', () => {
		const router = createRouter();
		const Constructor = Vue.extend(RouteListing);
		const vm = new Constructor({ router }).$mount();
		expect(vm.$el.querySelectorAll('li').length).toEqual(routes.length);
	});
});

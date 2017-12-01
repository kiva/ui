import Vue from 'vue';
import RouteListing from '@/components/RouteListing';

describe('RouteListing.vue', () => {
	it('should render 2 labels', () => {
		const Constructor = Vue.extend(RouteListing);
		const vm = new Constructor().$mount();
		expect(vm.$el.querySelectorAll('label').length)
			.to.equal(2);
	});
});

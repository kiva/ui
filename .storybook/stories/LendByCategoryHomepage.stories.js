import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import StoryRouter from 'storybook-vue-router';
import LendByCategoryHomepage from '@/pages/Homepage/LendByCategoryHomepage';

export default {
	title: 'Promos/LendByCategoryHomepage',
	component: LendByCategoryHomepage,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		'lend-by-category-homepage': LendByCategoryHomepage,
	},
	provide: {
		apollo: {
			mutate() {
				return Promise.resolve({});
			},
			watchQuery() {
				return {
					subscribe() {}
				}
			},
			readQuery() {
				return Promise.resolve({});
			},
			query() {
				return Promise.resolve({});
			}
		},
	},
	template: `
		<lend-by-category-homepage style="margin: -2rem" />
	`,
});

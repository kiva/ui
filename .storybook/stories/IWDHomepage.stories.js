import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import StoryRouter from 'storybook-vue-router';
import IWDHomepage from '@/pages/Homepage/iwd/IWDHomepage';

export default {
	title: 'Promos/IWD',
	component: IWDHomepage,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		'iwd-homepage': IWDHomepage,
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
			query() {
				return Promise.resolve({});
			}
		},
	},
	template: `
		<iwd-homepage style="margin: -2rem" />
	`,
});

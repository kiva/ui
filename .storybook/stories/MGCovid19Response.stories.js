import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import StoryRouter from 'storybook-vue-router';
import MGCovid19 from '@/pages/LandingPages/MGCovid19/MGCovid19.vue';

export default {
	title: 'Promos/MGCovid19Response',
	component: MGCovid19,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		MGCovid19,
	},
	provide: {
		apollo: {
			watchQuery() {
				return {
					subscribe() {}
				}
			},
		},
		federation: {
			query() {
				return Promise.resolve({});
			}
		},
		kvAuth0: {}
	},
	template: `
		<m-g-covid-19 style="margin: -2rem" />
	`,
});

import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import StoryRouter from 'storybook-vue-router';
import MGCovid19 from '@/pages/LandingPages/MGCovid19/MGCovid19.vue';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';

export default {
	title: 'Page/MGCovid19Response',
	component: MGCovid19,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		MGCovid19,
	},
	mixins: [apolloStoryMixin(), kvAuth0StoryMixin],
	template: `
		<m-g-covid-19 style="margin: -2rem" />
	`,
});

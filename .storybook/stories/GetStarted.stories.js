import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import StoryRouter from 'storybook-vue-router';
import GetStartedCauses from '@/pages/GetStarted/GetStartedCauses';
import GetStartedPlaces from '@/pages/GetStarted/GetStartedPlaces';
import GetStartedResults from '@/pages/GetStarted/GetStartedResults';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

export default {
	title: 'Pages/GetStarted',
	component: GetStartedCauses,
	decorators: [StoryRouter()],
};

export const Causes = () => ({
	components: {
		GetStartedCauses
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
	template: `
		<get-started-causes />
	`,
});

export const Places = () => ({
	components: {
		GetStartedPlaces
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
	template: `
		<get-started-places />
	`,
});

export const Results = () => ({
	components: {
		GetStartedResults
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin()],
	template: `
		<get-started-results />
	`,
});

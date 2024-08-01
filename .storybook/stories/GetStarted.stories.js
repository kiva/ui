import Vue from 'vue'

// import plugins
import kivaPlugins from '#src/plugins';
Vue.use(kivaPlugins)

import GetStartedCauses from '#src/pages/GetStarted/GetStartedCauses';
import GetStartedPlaces from '#src/pages/GetStarted/GetStartedPlaces';
import GetStartedResults from '#src/pages/GetStarted/GetStartedResults';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';

export default {
	title: 'Page/GetStarted',
	component: GetStartedCauses,
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

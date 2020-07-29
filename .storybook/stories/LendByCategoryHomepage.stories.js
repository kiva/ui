import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import StoryRouter from 'storybook-vue-router';
import LendByCategoryHomepage from '@/pages/Homepage/LendByCategoryHomepage';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

export default {
	title: 'Promos/LendByCategoryHomepage',
	component: LendByCategoryHomepage,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		'lend-by-category-homepage': LendByCategoryHomepage,
	},
	mixins: [apolloStoryMixin],
	template: `
		<lend-by-category-homepage style="margin: -2rem" />
	`,
});

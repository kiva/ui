import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import StoryRouter from 'storybook-vue-router';
import BorrowerProfile from '@/pages/BorrowerProfile/BorrowerProfile'
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';


export default {
	title: '/Pages/Borrower Profile',
	component: BorrowerProfile,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	components: {
		'borrower-profile': BorrowerProfile,
	},
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `<borrower-profile />`,
});

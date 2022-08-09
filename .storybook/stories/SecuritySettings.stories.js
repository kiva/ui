import Vue from 'vue'

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins)

import apolloStoryMixin from '../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';

import SecuritySettingsPage from '@/pages/Settings/SecuritySettings';
import TwoStepVerificationPage from '@/pages/Settings/TwoStepVerificationPage';

export default {
	title: 'Page/Security Settings',
	component: SecuritySettingsPage,
};

export const SecurityAndLogin = () => ({
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	components: {
		SecuritySettingsPage,
	},
	template: `
		<security-settings-page />
	`,
});

export const TwoStepVerification = () => ({
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	components: {
		TwoStepVerificationPage,
	},
	template: `
		<two-step-verification-page />
	`,
});

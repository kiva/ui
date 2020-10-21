import StoryRouter from 'storybook-vue-router';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';

import SecuritySettingsPage from '@/pages/Settings/SecuritySettings';

export default {
	title: 'Pages/settings/security',
	component: SecuritySettingsPage,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	mixins: [apolloStoryMixin(), kvAuth0StoryMixin],
	components: {
		SecuritySettingsPage,
	},
	template:`
	<security-settings-page />
	`,
});

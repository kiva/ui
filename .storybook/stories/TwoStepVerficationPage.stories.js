import StoryRouter from 'storybook-vue-router';
import apolloStoryMixin from '../mixins/apollo-story-mixin';
import kvAuth0StoryMixin from '../mixins/kv-auth0-story-mixin';

import TwoStepVerificationPage from '@/pages/Settings/TwoStepVerificationPage';

export default {
	title: 'Pages/settings/security/mfa',
	component: TwoStepVerificationPage,
	decorators: [StoryRouter()],
};

export const Default = () => ({
	mixins: [apolloStoryMixin(), kvAuth0StoryMixin],
	components: {
		TwoStepVerificationPage,
	},
	template: `
	<two-step-verification-page />
	`,
});

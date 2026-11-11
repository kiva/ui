import apolloStoryMixin from '../../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../../mixins/kv-auth0-story-mixin';
import WwwPageAccount from '#src/components/WwwFrame/WwwPageAccount';

const args = {
	eyebrow: 'Your account',
	title: 'James, here\'s the impact you\'ve made!',
	subtitle: 'Your portfolio, milestones, and the borrowers behind every dollar.',
};

export default {
	title: 'Portfolio/ImpactStats/WwwPageAccount',
	component: WwwPageAccount,
	args,
};

const Template = (templateArgs, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: { WwwPageAccount },
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	setup() { return { args: templateArgs }; },
	template: `
		<www-page-account v-bind="args">
			<div class="tw-bg-white tw-rounded tw-p-3">Page content</div>
		</www-page-account>
	`,
});

export const Default = Template.bind({});

export const Mobile = Template.bind({});
Mobile.parameters = {
	viewport: { defaultViewport: 'mobile2' },
};

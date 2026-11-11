import apolloStoryMixin from '../../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../../mixins/kv-auth0-story-mixin';
import WwwPageAccount from '#src/components/WwwFrame/WwwPageAccount';
import ImpactStatsLayout from '#src/components/Portfolio/ImpactStats/ImpactStatsLayout';

export default {
	title: 'Portfolio/ImpactStats/ImpactStatsPage',
};

const Template = () => ({
	components: { WwwPageAccount, ImpactStatsLayout },
	mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
	template: `
		<www-page-account
			eyebrow="Your account"
			title="James, here's the impact you've made!"
			subtitle="Your portfolio, milestones, and the borrowers behind every dollar."
		>
			<impact-stats-layout />
		</www-page-account>
	`,
});

export const Desktop = Template.bind({});
Desktop.parameters = {
	viewport: { defaultViewport: 'largeBreakpoint' },
};

export const Mobile = Template.bind({});
Mobile.parameters = {
	viewport: { defaultViewport: 'mobile2' },
};

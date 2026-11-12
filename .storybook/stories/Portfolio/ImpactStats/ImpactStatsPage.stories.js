import apolloStoryMixin from '../../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../../mixins/cookie-store-story-mixin';
import kvAuth0StoryMixin from '../../../mixins/kv-auth0-story-mixin';
import WwwPageAccount from '#src/components/WwwFrame/WwwPageAccount';
import ImpactStatsLayout from '#src/components/Portfolio/ImpactStats/ImpactStatsLayout';

export default {
	title: 'Portfolio/ImpactStats/ImpactStatsPage',
};

const lender = {
	id: 1,
	userAccount: {
		id: 1, firstName: 'James', balance: '847.23', promoBalance: '0.00',
	},
	userStats: { amount_outstanding: '3240.00' },
};

const story = my => {
	const template = () => ({
		components: { WwwPageAccount, ImpactStatsLayout },
		mixins: [apolloStoryMixin({ queryResult: { data: { my } } }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
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
	return template.bind({});
};

export const Desktop = story(lender);
Desktop.parameters = {
	viewport: { defaultViewport: 'largeBreakpoint' },
};

export const Mobile = story(lender);
Mobile.parameters = {
	viewport: { defaultViewport: 'mobile2' },
};

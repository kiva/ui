import apolloStoryMixin from '../../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../../mixins/cookie-store-story-mixin';
import AccountOverviewCard from '#src/components/Portfolio/ImpactStats/AccountOverviewCard';

export default {
	title: 'Portfolio/ImpactStats/AccountOverviewCard',
};

const lender = ({ balance = '847.23', amountOutstanding = '3240.00' } = {}) => ({
	id: 1,
	userAccount: {
		id: 1, firstName: 'James', balance, promoBalance: '0.00',
	},
	userStats: { amount_outstanding: amountOutstanding },
});

const story = ({ my, loading = false, wrapperStyle = 'max-width: 568px;' } = {}) => {
	const { apollo } = apolloStoryMixin({ queryResult: { data: { my } }, loading }).provide;
	const template = () => ({
		components: { AccountOverviewCard },
		mixins: [cookieStoreStoryMixin()],
		// The mixin's readQuery always returns data, which would skip the loading state
		provide: { apollo: loading ? { ...apollo, readQuery: () => null } : apollo },
		template: `<div style="${wrapperStyle}"><account-overview-card /></div>`,
	});
	return template.bind({});
};

const desktop = { viewport: { defaultViewport: 'largeBreakpoint' } };
const mobile = { viewport: { defaultViewport: 'mobile2' } };

export const Populated = story({ my: lender() });
Populated.parameters = desktop;

export const Zero = story({ my: lender({ balance: '0.00', amountOutstanding: '0.00' }) });
Zero.parameters = desktop;

export const Loading = story({ my: lender(), loading: true });
Loading.parameters = desktop;

export const PopulatedMobile = story({ my: lender(), wrapperStyle: '' });
PopulatedMobile.parameters = mobile;

export const ZeroMobile = story({ my: lender({ balance: '0.00', amountOutstanding: '0.00' }), wrapperStyle: '' });
ZeroMobile.parameters = mobile;

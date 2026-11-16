import apolloStoryMixin from '../../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../../mixins/cookie-store-story-mixin';
import GivingFundCard from '#src/components/Portfolio/ImpactStats/GivingFundCard';

export default {
	title: 'Portfolio/ImpactStats/GivingFundCard',
};

const lender = ({ deposits = '1000.00', funds = [] } = {}) => ({
	id: 1,
	givingFundParticipation: { totalAmount: deposits, totalCount: 3 },
	givingFunds: { totalCount: funds.length, values: funds },
});

const ownedFunds = [{ id: 'a', currentAmountDonated: '1000.00' }, { id: 'b', currentAmountDonated: '25.00' }];

const story = ({ my, wrapperStyle = 'max-width: 568px;' } = {}) => {
	const template = () => ({
		components: { GivingFundCard },
		mixins: [apolloStoryMixin({ queryResult: { data: { my } } }), cookieStoreStoryMixin()],
		template: `<div style="${wrapperStyle}"><giving-fund-card /></div>`,
	});
	return template.bind({});
};

const desktop = { viewport: { defaultViewport: 'largeBreakpoint' } };
const mobile = { viewport: { defaultViewport: 'mobile2' } };

export const Owner = story({ my: lender({ funds: ownedFunds }) });
Owner.parameters = desktop;

export const NonOwner = story({ my: lender() });
NonOwner.parameters = desktop;

export const Zero = story({ my: lender({ deposits: '0.00', funds: [{ id: 'a', currentAmountDonated: '0.00' }] }) });
Zero.parameters = desktop;

export const OwnerMobile = story({ my: lender({ funds: ownedFunds }), wrapperStyle: '' });
OwnerMobile.parameters = mobile;

export const NonOwnerMobile = story({ my: lender(), wrapperStyle: '' });
NonOwnerMobile.parameters = mobile;

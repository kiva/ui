import apolloStoryMixin from '../../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../../mixins/cookie-store-story-mixin';
import { impactStatsLender, impactStatsPublicData, sectorNames } from '../../../mock-data/impact-stats-data-mock';
import ImpactBreakdownCard from '#src/components/Portfolio/ImpactStats/ImpactBreakdownCard';

export default {
	title: 'Portfolio/ImpactStats/ImpactBreakdownCard',
};

const story = ({ my, loading = false, wrapperStyle = 'max-width: 757px;' } = {}) => {
	const { apollo } = apolloStoryMixin({
		queryResult: { data: { my, ...impactStatsPublicData } },
		loading,
	}).provide;
	const template = () => ({
		components: { ImpactBreakdownCard },
		mixins: [cookieStoreStoryMixin()],
		// The mixin's readQuery always returns data, which would skip the loading state
		provide: { apollo: loading ? { ...apollo, readQuery: () => null } : apollo },
		template: `<div style="${wrapperStyle}"><impact-breakdown-card type="sector" /></div>`,
	});
	return template.bind({});
};

const desktop = { viewport: { defaultViewport: 'largeBreakpoint' } };
const mobile = { viewport: { defaultViewport: 'mobile2' } };

const everythingLent = impactStatsLender({
	sectorLoans: sectorNames.filter(name => name !== 'Entertainment').map((name, index) => [name, 15 - index]),
});
const noLoans = impactStatsLender({ sectorLoans: [] });

export const Populated = story({ my: impactStatsLender() });
Populated.parameters = desktop;

export const EverythingLent = story({ my: everythingLent });
EverythingLent.parameters = desktop;

export const NoLoans = story({ my: noLoans });
NoLoans.parameters = desktop;

export const Loading = story({ my: impactStatsLender(), loading: true });
Loading.parameters = desktop;

export const Error = story({ my: null });
Error.parameters = desktop;

export const PopulatedMobile = story({ my: impactStatsLender(), wrapperStyle: '' });
PopulatedMobile.parameters = mobile;

export const EverythingLentMobile = story({ my: everythingLent, wrapperStyle: '' });
EverythingLentMobile.parameters = mobile;

export const NoLoansMobile = story({ my: noLoans, wrapperStyle: '' });
NoLoansMobile.parameters = mobile;

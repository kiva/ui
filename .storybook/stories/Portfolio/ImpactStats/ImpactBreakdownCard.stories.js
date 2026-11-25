import apolloStoryMixin from '../../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../../mixins/cookie-store-story-mixin';
import {
	activityNames, impactStatsLender, impactStatsPublicData, sectorNames,
} from '../../../mock-data/impact-stats-data-mock';
import ImpactBreakdownCard from '#src/components/Portfolio/ImpactStats/ImpactBreakdownCard';

export default {
	title: 'Portfolio/ImpactStats/ImpactBreakdownCard',
};

const story = ({
	type = 'sector', my, loading = false, wrapperStyle = 'max-width: 757px;',
} = {}) => {
	const { apollo } = apolloStoryMixin({
		queryResult: { data: { my, ...impactStatsPublicData } },
		loading,
	}).provide;
	const template = () => ({
		components: { ImpactBreakdownCard },
		mixins: [cookieStoreStoryMixin()],
		// The mixin's readQuery always returns data, which would skip the loading state
		provide: { apollo: loading ? { ...apollo, readQuery: () => null } : apollo },
		template: `<div style="${wrapperStyle}"><impact-breakdown-card type="${type}" /></div>`,
	});
	return template.bind({});
};

const desktop = { viewport: { defaultViewport: 'largeBreakpoint' } };
const mobile = { viewport: { defaultViewport: 'mobile2' } };

const everythingLent = impactStatsLender({
	sectorLoans: sectorNames.filter(name => name !== 'Entertainment').map((name, index) => [name, 15 - index]),
});
const everythingLentActivities = impactStatsLender({
	activityLoans: activityNames.filter(name => name !== 'Weaving').reverse().map((name, index) => [name, 15 - index]),
});
const noLoans = impactStatsLender({ sectorLoans: [], activityLoans: [] });

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

export const ActivityPopulated = story({ type: 'activity', my: impactStatsLender() });
ActivityPopulated.parameters = desktop;

export const ActivityEverythingLent = story({ type: 'activity', my: everythingLentActivities });
ActivityEverythingLent.parameters = desktop;

export const ActivityNoLoans = story({ type: 'activity', my: noLoans });
ActivityNoLoans.parameters = desktop;

export const ActivityLoading = story({ type: 'activity', my: impactStatsLender(), loading: true });
ActivityLoading.parameters = desktop;

export const ActivityError = story({ type: 'activity', my: null });
ActivityError.parameters = desktop;

export const ActivityPopulatedMobile = story({ type: 'activity', my: impactStatsLender(), wrapperStyle: '' });
ActivityPopulatedMobile.parameters = mobile;

export const ActivityEverythingLentMobile = story({ type: 'activity', my: everythingLentActivities, wrapperStyle: '' });
ActivityEverythingLentMobile.parameters = mobile;

export const ActivityNoLoansMobile = story({ type: 'activity', my: noLoans, wrapperStyle: '' });
ActivityNoLoansMobile.parameters = mobile;

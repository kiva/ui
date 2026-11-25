import apolloStoryMixin from '../../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../../mixins/cookie-store-story-mixin';
import { impactStatsLender, impactStatsPublicData } from '../../../mock-data/impact-stats-data-mock';
import GeographicReachCard from '#src/components/Portfolio/ImpactStats/GeographicReachCard';

export default {
	title: 'Portfolio/ImpactStats/GeographicReachCard',
};

const story = ({ my, loading = false } = {}) => {
	const { apollo } = apolloStoryMixin({
		queryResult: { data: { my, ...impactStatsPublicData } },
		loading,
	}).provide;
	const template = () => ({
		components: { GeographicReachCard },
		mixins: [cookieStoreStoryMixin()],
		// The mixin's readQuery always returns data, which would skip the loading state
		provide: { apollo: loading ? { ...apollo, readQuery: () => null } : apollo },
		template: '<div style="max-width: 757px;"><geographic-reach-card /></div>',
	});
	return template.bind({});
};

const desktop = { viewport: { defaultViewport: 'largeBreakpoint' } };

const zero = impactStatsLender({ borrowers: 0, loans: [] });

export const Populated = story({ my: impactStatsLender() });
Populated.parameters = desktop;

export const Zero = story({ my: zero });
Zero.parameters = desktop;

export const Loading = story({ my: impactStatsLender(), loading: true });
Loading.parameters = desktop;

export const Error = story({ my: null });
Error.parameters = desktop;

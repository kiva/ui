import apolloStoryMixin from '../../../mixins/apollo-story-mixin';
import cookieStoreStoryMixin from '../../../mixins/cookie-store-story-mixin';
import { impactStatsLender, impactStatsPublicData } from '../../../mock-data/impact-stats-data-mock';
import ImpactStatsRow from '#src/components/Portfolio/ImpactStats/ImpactStatsRow';

export default {
	title: 'Portfolio/ImpactStats/ImpactStatsRow',
};

const story = ({ my, loading = false, wrapperStyle = 'max-width: 760px;' } = {}) => {
	const { apollo } = apolloStoryMixin({
		queryResult: { data: { my, ...impactStatsPublicData } },
		loading,
	}).provide;
	const template = () => ({
		components: { ImpactStatsRow },
		mixins: [cookieStoreStoryMixin()],
		// The mixin's readQuery always returns data, which would skip the loading state
		provide: { apollo: loading ? { ...apollo, readQuery: () => null } : apollo },
		template: `<div style="${wrapperStyle}"><impact-stats-row /></div>`,
	});
	return template.bind({});
};

const desktop = { viewport: { defaultViewport: 'largeBreakpoint' } };
const mobile = { viewport: { defaultViewport: 'mobile2' } };

const zero = impactStatsLender({
	borrowers: 0, countries: 0, donated: '0.00', lifetimeLent: '0.00',
});
const large = impactStatsLender({
	borrowers: 12345, countries: 81, donated: '123456.78', lifetimeLent: '1234567.00',
});

export const Populated = story({ my: impactStatsLender() });
Populated.parameters = desktop;

export const Zero = story({ my: zero });
Zero.parameters = desktop;

export const Loading = story({ my: impactStatsLender(), loading: true });
Loading.parameters = desktop;

export const PopulatedMobile = story({ my: impactStatsLender(), wrapperStyle: '' });
PopulatedMobile.parameters = mobile;

export const ZeroMobile = story({ my: zero, wrapperStyle: '' });
ZeroMobile.parameters = mobile;

export const LargeMobile = story({ my: large, wrapperStyle: '' });
LargeMobile.parameters = mobile;

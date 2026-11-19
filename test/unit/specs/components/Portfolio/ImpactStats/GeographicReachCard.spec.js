import { render, within } from '@testing-library/vue';
import { computed, ref } from 'vue';
import { globalOptions } from '#src/../test/unit/specUtils';
import { buildRegions, toMapCountries } from '#src/util/geographicReach';
import GeographicReachCard from '#src/components/Portfolio/ImpactStats/GeographicReachCard';

const impactStats = {};
const geographicReach = {};

vi.mock('#src/composables/useImpactStats', () => ({
	default: () => impactStats,
}));

vi.mock('#src/composables/useGeographicReach', () => ({
	default: () => geographicReach,
}));

const c = (isoCode, name, region) => ({ isoCode, name, region });
const PH = c('PH', 'Philippines', 'Asia');
const IN = c('IN', 'India', 'Asia');
const ID = c('ID', 'Indonesia', 'Asia');
const HT = c('HT', 'Haiti', 'North America');
const DO = c('DO', 'Dominican Republic', 'North America');
const KE = c('KE', 'Kenya', 'Africa');
const GH = c('GH', 'Ghana', 'Africa');
const stat = (country, loanCount) => ({ loanCount, country });

const AVAILABLE = [PH, IN, ID, HT, DO, KE, GH];
const LENDER_STATS = [stat(PH, 32), stat(IN, 1), stat(HT, 3), stat(DO, 2), stat(KE, 1)];

let mapProps;

const KvSimpleMap = {
	name: 'KvSimpleMap',
	props: ['countries', 'loanCountTiers', 'fitToCountries', 'allowDragging', 'showZoomControls', 'oceanColor'],
	setup(props) {
		mapProps = props;
	},
	template: '<div data-testid="map"></div>',
};

const renderCard = ({
	stats = LENDER_STATS,
	countriesLentTo = 7,
	countriesAvailable = 73,
	loading = false,
	error = false,
} = {}) => {
	mapProps = null;
	const regions = loading || error ? null : buildRegions(stats, AVAILABLE);
	Object.assign(impactStats, {
		countriesLentTo: computed(() => countriesLentTo),
		countriesAvailable: computed(() => countriesAvailable),
	});
	Object.assign(geographicReach, {
		regions: computed(() => regions),
		mapCountries: computed(() => regions && toMapCountries(regions)),
		loading: ref(loading),
		error: computed(() => error),
	});
	const tracked = [];
	const result = render(GeographicReachCard, {
		global: {
			...globalOptions,
			stubs: { ...globalOptions.stubs, KvSimpleMap },
			directives: { kvTrackEvent: { mounted: (el, { value }) => tracked.push(value) } },
		},
	});
	return { ...result, tracked, regions };
};

const regionHeading = region => within(region).getByRole('heading', { level: 4 }).textContent.trim();

const regionNamed = (getAllByTestId, name) => getAllByTestId('impact-region')
	.find(region => regionHeading(region) === name);

const rowFor = (getAllByTestId, name) => getAllByTestId('impact-country-row')
	.find(row => within(row).queryByRole('link', { name }));

describe('GeographicReachCard', () => {
	it('shows the title, subtitle and countries pill', () => {
		const { getByRole, getByText, getByTestId } = renderCard();

		getByRole('heading', { level: 3, name: 'Geographic Reach' });
		getByText('Countries where you have lent');
		expect(getByTestId('impact-geographic-reach-count').textContent.trim()).toBe('7 of 73 countries');
	});

	it('hides the pill when either count is unknown', () => {
		const { queryByTestId } = renderCard({ countriesAvailable: null });

		expect(queryByTestId('impact-geographic-reach-count')).toBeNull();
	});

	it('shows the key in tier order', () => {
		const { getByTestId } = renderCard();
		const labels = within(getByTestId('impact-geographic-reach-key')).getAllByRole('listitem', { hidden: true })
			.map(item => item.textContent.trim());

		expect(labels).toEqual(['No loans yet', '1–3', '4–6', '7–9', '10–12', '13+ loans']);
	});

	it('lists each region and its countries in order', () => {
		const { getAllByTestId } = renderCard();

		expect(getAllByTestId('impact-region').map(regionHeading)).toEqual(['Africa', 'Asia', 'North America']);
		expect(within(regionNamed(getAllByTestId, 'Asia')).getAllByRole('link').map(link => link.textContent.trim()))
			.toEqual(['Philippines', 'India', 'Indonesia']);
	});

	it('shows each lent-to country\'s share and tells screen readers it is lent to', () => {
		const { getAllByTestId } = renderCard();
		const philippines = rowFor(getAllByTestId, 'Philippines').textContent;
		const indonesia = rowFor(getAllByTestId, 'Indonesia').textContent;

		expect(philippines).toContain('82%');
		expect(philippines).toContain('Lent to');
		expect(rowFor(getAllByTestId, 'India').textContent).toContain('3%');
		expect(indonesia).not.toMatch(/%/);
		expect(indonesia).not.toContain('Lent to');
	});

	it('wraps and hyphenates a long name in its own space, clear of the share', () => {
		const { getByRole } = renderCard();
		const link = getByRole('link', { name: 'Philippines' });

		expect(link.parentElement.classList).toContain('tw-flex-1');
		expect(link.parentElement.classList).toContain('tw-min-w-0');
		expect(link.parentElement.classList).toContain('tw-break-words');
		expect(link.parentElement.classList).toContain('tw-hyphens-auto');
		expect(link.classList).not.toContain('tw-flex-1');
	});

	it('marks complete regions', () => {
		const { getAllByTestId } = renderCard();
		const complete = getAllByTestId('impact-region-complete');

		expect(complete).toHaveLength(1);
		expect(complete[0].textContent.trim()).toBe('Complete');
		expect(regionNamed(getAllByTestId, 'North America').contains(complete[0])).toBe(true);
	});

	it('links every country to the lend filter and tracks it', () => {
		const { getByRole, tracked } = renderCard();

		expect(getByRole('link', { name: 'Indonesia' }).getAttribute('href')).toBe('/lend/filter?country=ID');
		expect(tracked).toContainEqual(['portfolio', 'click', 'geographic-reach-country', 'PH']);
	});

	it('gives the map every country with the tiers', () => {
		const { regions } = renderCard();

		expect(mapProps.countries).toEqual(toMapCountries(regions));
		expect(mapProps.loanCountTiers).toEqual([1, 4, 7, 10, 13]);
		expect(mapProps.fitToCountries).toBe(false);
		expect(mapProps.allowDragging).toBe(false);
		expect(mapProps.showZoomControls).toBe(false);
	});

	it('shows a lender with no loans', () => {
		const { getByTestId, getAllByTestId, queryByTestId } = renderCard({ stats: [], countriesLentTo: 0 });

		expect(getByTestId('impact-geographic-reach-count').textContent.trim()).toBe('0 of 73 countries');
		getAllByTestId('impact-country-row').forEach(row => expect(row.textContent).not.toMatch(/%/));
		expect(queryByTestId('impact-region-complete')).toBeNull();
	});

	it('shows the loading state', () => {
		const { queryAllByTestId, queryByTestId } = renderCard({ loading: true });

		expect(queryAllByTestId('impact-country-row')).toHaveLength(0);
		expect(queryByTestId('map')).toBeNull();
	});

	it('shows the error state', () => {
		const { getByRole, queryAllByTestId, queryByTestId } = renderCard({ error: true });

		expect(getByRole('alert').textContent).toContain('We couldn\'t load this right now.');
		expect(queryAllByTestId('impact-country-row')).toHaveLength(0);
		expect(queryByTestId('impact-geographic-reach-count')).toBeNull();
	});
});

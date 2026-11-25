import { fireEvent, render, within } from '@testing-library/vue';
import { computed, nextTick, ref } from 'vue';
import { globalOptions } from '#src/../test/unit/specUtils';
import ImpactBreakdownCard from '#src/components/Portfolio/ImpactStats/ImpactBreakdownCard';

const breakdown = {};

vi.mock('#src/composables/useSectorBreakdown', () => ({
	default: () => breakdown,
}));

vi.mock('#src/composables/useActivityBreakdown', () => ({
	default: () => breakdown,
}));

vi.mock('@kiva/kv-components', async importOriginal => ({
	...await importOriginal(),
	KvLightbox: {
		name: 'KvLightbox',
		props: ['visible', 'title'],
		template: '<div v-if="visible" data-testid="lightbox"><h2>{{ title }}</h2><slot></slot></div>',
	},
}));

const SECTORS = [
	{ id: 1, name: 'Agriculture' },
	{ id: 9, name: 'Arts' },
	{ id: 15, name: 'Education' },
	{ id: 12, name: 'Entertainment' },
	{ id: 4, name: 'Food' },
	{ id: 6, name: 'Health' },
	{ id: 10, name: 'Housing' },
	{ id: 8, name: 'Wholesale' },
];
const named = name => SECTORS.find(sector => sector.name === name);
const DEFAULT_LENT = { Agriculture: 32, Education: 24, Housing: 18 };

let chartProps;

const KvPieChartV2 = {
	name: 'KvPieChartV2',
	props: ['values', 'layout', 'listHeader', 'moreLinkLabel', 'listGap', 'segmentGap'],
	setup(props) {
		chartProps = props;
	},
	template: '<div data-testid="chart"></div>',
};

const renderCard = ({
	type = 'sector', lent = DEFAULT_LENT, loading = false, error = false,
} = {}) => {
	chartProps = null;
	const lentTo = Object.entries(lent).map(([name, loanCount]) => ({ ...named(name), loanCount }));
	const notLentTo = SECTORS.filter(sector => !(sector.name in lent));
	const ready = !loading && !error;
	Object.assign(breakdown, {
		lentTo: computed(() => (ready ? lentTo : null)),
		notLentTo: computed(() => (ready ? notLentTo : null)),
		chartValues: computed(() => (ready ? lentTo.map(item => ({ label: item.name, value: item.loanCount })) : null)),
		lentCount: computed(() => (ready ? lentTo.length : null)),
		totalCount: computed(() => (ready ? lentTo.length + notLentTo.length : null)),
		loading: ref(loading),
		error: computed(() => error),
	});
	const tracked = [];
	const result = render(ImpactBreakdownCard, {
		props: { type },
		global: {
			...globalOptions,
			stubs: { ...globalOptions.stubs, KvPieChartV2 },
			directives: { kvTrackEvent: { mounted: (el, { value }) => tracked.push(value) } },
		},
	});
	return { ...result, tracked };
};

const linkNames = links => links.map(link => link.textContent.trim());

describe('ImpactBreakdownCard', () => {
	const { innerWidth } = window;

	afterEach(() => {
		window.innerWidth = innerWidth;
	});

	it('shows the lent-to share and the pill', () => {
		const { getByRole, getByTestId } = renderCard();

		getByRole('heading', { level: 3, name: 'By Sector' });
		expect(getByTestId('impact-sector-count').textContent.trim()).toBe('3 of 8');
		expect(chartProps.layout).toBe('two-column');
		expect(chartProps.listHeader).toBe('Lent to');
		expect(chartProps.moreLinkLabel).toBe('+{count} more');
		expect(chartProps.values).toEqual([
			{ label: 'Agriculture', value: 32 },
			{ label: 'Education', value: 24 },
			{ label: 'Housing', value: 18 },
		]);
	});

	it('lists four not-lent-to sectors and a more link', () => {
		const { getByRole, getAllByTestId, getByTestId } = renderCard();
		const links = getAllByTestId('impact-sector-not-lent-item');

		expect(getByRole('heading', { level: 4, name: 'Not yet lent to' }).classList).toContain('tw-text-button-link');
		expect(linkNames(links)).toEqual(['Arts', 'Entertainment', 'Food', 'Health']);
		expect(links.map(link => link.getAttribute('href'))).toEqual([
			'/lend/filter?sector=9',
			'/lend/filter?sector=12',
			'/lend/filter?sector=4',
			'/lend/filter?sector=6',
		]);
		expect(getByTestId('impact-sector-more').textContent.trim()).toBe('+ 1 more');
	});

	it('lists every not-lent-to sector when there are four', () => {
		const { getAllByTestId, queryByTestId } = renderCard({ lent: { ...DEFAULT_LENT, Wholesale: 2 } });

		expect(getAllByTestId('impact-sector-not-lent-item')).toHaveLength(4);
		expect(queryByTestId('impact-sector-more')).toBeNull();
	});

	it('opens the lightbox with every not-lent-to sector', async () => {
		const { getByTestId, queryByTestId, getAllByTestId } = renderCard();

		expect(queryByTestId('lightbox')).toBeNull();
		await fireEvent.click(getByTestId('impact-sector-more'));

		const lightbox = getByTestId('lightbox');
		within(lightbox).getByRole('heading', { name: 'Not yet lent to' });
		const items = getAllByTestId('impact-sector-lightbox-item');
		expect(linkNames(items)).toEqual(['Arts', 'Entertainment', 'Food', 'Health', 'Wholesale']);
		expect(items[4].getAttribute('href')).toBe('/lend/filter?sector=8');
	});

	it('links the button to every not-lent-to sector', () => {
		const { getByTestId } = renderCard();
		const button = getByTestId('impact-sector-lend-new');

		expect(button.textContent.trim()).toBe('Lend to a new sector');
		expect(button.getAttribute('href')).toBe('/lend/filter?sector=9,12,4,6,8');
	});

	it('tracks every link and button', async () => {
		const { getByTestId, tracked } = renderCard();
		await fireEvent.click(getByTestId('impact-sector-more'));

		expect(tracked).toEqual(expect.arrayContaining([
			['portfolio', 'click', 'sector-breakdown-not-lent-to', 9],
			['portfolio', 'click', 'sector-breakdown-not-lent-to', 6],
			['portfolio', 'click', 'sector-breakdown-more'],
			['portfolio', 'click', 'sector-breakdown-lend-new'],
			['portfolio', 'click', 'sector-breakdown-not-lent-to', 8],
		]));
	});

	it('hides not-lent-to when everything is lent to', () => {
		const lent = Object.fromEntries(SECTORS.map(sector => [sector.name, 1]));
		const { getByTestId, queryByText, queryByTestId } = renderCard({ lent });

		expect(getByTestId('impact-sector-count').textContent.trim()).toBe('8 of 8');
		expect(queryByText('Not yet lent to')).toBeNull();
		expect(queryByTestId('impact-sector-lend-new')).toBeNull();
		getByTestId('chart');
	});

	it('shows the no-loans state', async () => {
		const {
			getByTestId, getByText, getAllByTestId, queryByTestId, queryByText,
		} = renderCard({ lent: {} });

		expect(getByTestId('impact-sector-count').textContent.trim()).toBe('8 to explore');
		const noLoans = getByTestId('impact-sector-no-loans');
		expect(noLoans.textContent.trim()).toBe('No loans yet');
		expect(noLoans.parentElement.classList).toContain('tw-text-tertiary');
		expect(getByText('Start anywhere').classList).toContain('tw-text-tertiary');
		expect(linkNames(getAllByTestId('impact-sector-not-lent-item'))).toEqual(['Agriculture', 'Arts', 'Education']);
		expect(queryByTestId('impact-sector-lend-new')).toBeNull();
		expect(queryByTestId('chart')).toBeNull();
		expect(queryByText('Not yet lent to')).toBeNull();

		const more = getByTestId('impact-sector-more');
		expect(more.textContent.trim()).toBe('+5 more');
		await fireEvent.click(more);
		expect(getAllByTestId('impact-sector-lightbox-item')).toHaveLength(8);
	});

	it('shows the loading state', () => {
		const { getByTestId, queryByTestId } = renderCard({ loading: true });

		const skeleton = getByTestId('impact-sector-loading');
		expect(skeleton.querySelectorAll('.kv-loading-text-line')).toHaveLength(4);
		expect(queryByTestId('impact-sector-not-lent-item')).toBeNull();
		expect(queryByTestId('chart')).toBeNull();
	});

	it('shows the error state, never a zero card', () => {
		const { getByText, queryByTestId } = renderCard({ error: true });

		getByText('We couldn\'t load this right now.');
		expect(queryByTestId('impact-sector-count')).toBeNull();
		expect(queryByTestId('impact-sector-no-loans')).toBeNull();
		expect(queryByTestId('chart')).toBeNull();
	});

	it.each([
		[400, 2, 7],
		[1024, 5, 5],
	])('at %ipx wide uses list gap %i and segment gap %i', async (width, listGap, segmentGap) => {
		window.innerWidth = width;
		renderCard();
		await nextTick();

		expect(chartProps.listGap).toBe(listGap);
		expect(chartProps.segmentGap).toBe(segmentGap);
	});

	describe('activity type', () => {
		it('shows the title and the pill', () => {
			const { getByRole, getByTestId } = renderCard({ type: 'activity' });

			getByRole('heading', { level: 3, name: 'By Activity' });
			expect(getByTestId('impact-activity-count').textContent.trim()).toBe('3 of 8');
		});

		it('links not-lent-to activities to the lend page', () => {
			const { getAllByTestId, getByTestId } = renderCard({ type: 'activity' });

			expect(getAllByTestId('impact-activity-not-lent-item').map(link => link.getAttribute('href'))).toEqual([
				'/lend?activity=9',
				'/lend?activity=12',
				'/lend?activity=4',
				'/lend?activity=6',
			]);
			expect(getByTestId('impact-activity-more').textContent.trim()).toBe('+ 1 more');
		});

		it('links the button to every not-lent-to activity', () => {
			const { getByTestId } = renderCard({ type: 'activity' });
			const button = getByTestId('impact-activity-lend-new');

			expect(button.textContent.trim()).toBe('Lend to a new activity');
			expect(button.getAttribute('href')).toBe('/lend?activity=9,12,4,6,8');
		});

		it('links lightbox activities to the lend page', async () => {
			const { getByTestId, getAllByTestId } = renderCard({ type: 'activity' });
			await fireEvent.click(getByTestId('impact-activity-more'));

			expect(getAllByTestId('impact-activity-lightbox-item')[4].getAttribute('href')).toBe('/lend?activity=8');
		});

		it('tracks every link and button', async () => {
			const { getByTestId, tracked } = renderCard({ type: 'activity' });
			await fireEvent.click(getByTestId('impact-activity-more'));

			expect(tracked).toEqual(expect.arrayContaining([
				['portfolio', 'click', 'activity-breakdown-not-lent-to', 9],
				['portfolio', 'click', 'activity-breakdown-more'],
				['portfolio', 'click', 'activity-breakdown-lend-new'],
				['portfolio', 'click', 'activity-breakdown-not-lent-to', 8],
			]));
		});
	});
});

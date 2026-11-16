import { render } from '@testing-library/vue';
import { computed, ref } from 'vue';
import { globalOptions } from '#src/../test/unit/specUtils';
import numeralFilter from '#src/plugins/numeral-filter';
import ImpactStatsRow from '#src/components/Portfolio/ImpactStats/ImpactStatsRow';

const mockState = {};

vi.mock('#src/composables/useImpactStats', () => ({
	default: () => mockState,
}));

const KvTooltip = {
	props: ['controller'],
	template: '<div data-testid="tooltip" :data-controller="controller"><slot></slot></div>',
};

const RouterLink = {
	props: ['to'],
	template: '<a :href="to"><slot></slot></a>',
};

const VALUE_IDS = ['impact-lives-touched', 'impact-countries', 'impact-donations', 'impact-total-impact'];

const renderRow = ({
	livesTouched = 284,
	countriesLentTo = 7,
	countriesAvailable = 73,
	donations = 120,
	totalImpact = 4240,
	loading = false,
} = {}) => {
	Object.assign(mockState, {
		livesTouched: computed(() => livesTouched),
		countriesLentTo: computed(() => countriesLentTo),
		countriesAvailable: computed(() => countriesAvailable),
		donations: computed(() => donations),
		totalImpact: computed(() => totalImpact),
		loading: ref(loading),
	});
	const tracked = [];
	const result = render(ImpactStatsRow, {
		global: {
			...globalOptions,
			stubs: { ...globalOptions.stubs, KvTooltip },
			components: { RouterLink },
			directives: { kvTrackEvent: { mounted: (el, { value }) => tracked.push(value) } },
			mocks: { ...globalOptions.mocks, $filters: { numeral: numeralFilter } },
		},
	});
	return { ...result, tracked };
};

const valueOf = (getByTestId, id) => getByTestId(id).textContent.trim();

describe('ImpactStatsRow', () => {
	it('shows each stat', () => {
		const { getByTestId, getByText } = renderRow();

		['Lives touched', 'Countries', 'Donations', 'Total impact'].forEach(label => getByText(label));
		expect(valueOf(getByTestId, 'impact-lives-touched')).toBe('284');
		expect(valueOf(getByTestId, 'impact-countries')).toBe('7');
		expect(valueOf(getByTestId, 'impact-countries-total')).toBe('of 73 countries');
		expect(valueOf(getByTestId, 'impact-donations')).toBe('$120');
		expect(valueOf(getByTestId, 'impact-total-impact')).toBe('$4,240');
		getByText('from your account');
	});

	it('shows zeros for a lender with no loans', () => {
		const { getByTestId } = renderRow({
			livesTouched: 0, countriesLentTo: 0, donations: 0, totalImpact: 0,
		});

		expect(VALUE_IDS.map(id => valueOf(getByTestId, id))).toEqual(['0', '0', '$0', '$0']);
		expect(valueOf(getByTestId, 'impact-countries-total')).toBe('of 73 countries');
	});

	it('shows cents only when an amount has them', () => {
		const { getByTestId } = renderRow({ donations: 12.5 });

		expect(valueOf(getByTestId, 'impact-donations')).toBe('$12.50');
	});

	it('shows a lent-to count above the total as it is', () => {
		const { getByTestId } = renderRow({ countriesLentTo: 81 });

		expect(valueOf(getByTestId, 'impact-countries')).toBe('81');
		expect(valueOf(getByTestId, 'impact-countries-total')).toBe('of 73 countries');
	});

	it('hides the countries total when it is unknown', () => {
		const { queryByTestId } = renderRow({ countriesAvailable: null });

		expect(queryByTestId('impact-countries-total')).toBeNull();
	});

	it('shows dashes when the lender\'s stats are unknown', () => {
		const { getByTestId } = renderRow({
			livesTouched: null, countriesLentTo: null, donations: null, totalImpact: null,
		});

		expect(VALUE_IDS.map(id => valueOf(getByTestId, id))).toEqual(['—', '—', '—', '—']);
	});

	it('shows loading text while loading', () => {
		const { getByTestId } = renderRow({ loading: true });

		VALUE_IDS.forEach(id => expect(getByTestId(id).querySelector('.kv-loading-text')).not.toBeNull());
	});

	it('links to loans, borrower updates and tax receipts', () => {
		const { getByRole } = renderRow();

		expect(getByRole('link', { name: /View my loans/ }).getAttribute('href')).toBe('/portfolio/loans');
		expect(getByRole('link', { name: /See borrower updates/ }).getAttribute('href'))
			.toBe('/portfolio/borrower-messages');
		expect(getByRole('link', { name: /View tax receipts/ }).getAttribute('href')).toBe('/portfolio/donations');
	});

	it('tracks each link', () => {
		const { tracked } = renderRow();

		expect(tracked).toEqual(expect.arrayContaining([
			['portfolio', 'click', 'view-my-loans'],
			['portfolio', 'click', 'see-borrower-updates'],
			['portfolio', 'click', 'view-tax-receipts'],
		]));
	});

	it('explains each stat in a tooltip', () => {
		const { getAllByTestId } = renderRow();

		expect(getAllByTestId('tooltip').map(tooltip => tooltip.textContent.trim())).toEqual([
			'The number of borrowers you\'ve lent to.',
			'Countries you\'ve lent to, out of the countries where Kiva lends today.',
			'Your total donations to Kiva.',
			'The total you\'ve lent from your account, including repayments you\'ve lent again.',
		]);
	});

	it('carries the row test id', () => {
		const { getByTestId } = renderRow();

		expect(getByTestId('impact-stats').tagName).toBe('SECTION');
	});
});

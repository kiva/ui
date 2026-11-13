import { render } from '@testing-library/vue';
import { computed } from 'vue';
import ImpactStatsLayout from '#src/components/Portfolio/ImpactStats/ImpactStatsLayout';

const GROUP_HEADINGS = ['Account overview', 'Your impact diversity', 'Achievements', 'Remember them?'];
const LEFT = [
	'impact-stats',
	'impact-geographic-reach',
	'impact-sector',
	'impact-activity',
	'impact-gender',
	'impact-partner',
];
const RIGHT = ['impact-goal', 'impact-percentile', 'impact-badges', 'impact-first-loan'];

const mockState = {};

vi.mock('#src/composables/useImpactStats', () => ({
	default: () => mockState,
}));

const renderLayout = ({ showGivingFund = false } = {}) => {
	Object.assign(mockState, { showGivingFund: computed(() => showGivingFund) });

	return render(ImpactStatsLayout, {
		global: {
			stubs: {
				AccountOverviewCard: {
					name: 'AccountOverviewCard',
					template: '<div data-testid="impact-account-overview"></div>',
				},
				GivingFundCard: {
					name: 'GivingFundCard',
					template: '<div data-testid="impact-giving-fund"></div>',
				},
			},
		},
	});
};

describe('ImpactStatsLayout', () => {
	it('shows the group headings as h2', () => {
		const { getByRole } = renderLayout();

		GROUP_HEADINGS.forEach(name => getByRole('heading', { level: 2, name }));
	});

	it('renders a card per section', () => {
		const { getByTestId } = renderLayout();

		['impact-account-overview', ...LEFT, ...RIGHT].forEach(id => getByTestId(id));
	});

	it('orders the account overview, then the left column, then the right column', () => {
		const { container } = renderLayout();
		const order = [...container.querySelectorAll('[data-testid^="impact-"]')].map(el => el.dataset.testid);

		expect(order).toEqual(['impact-account-overview', ...LEFT, ...RIGHT]);
	});

	it('puts "Remember them?" between badges and the first loan', () => {
		const { container } = renderLayout();
		const order = [...container.querySelectorAll('h2, [data-testid^="impact-"]')]
			.map(el => el.dataset.testid ?? el.textContent.trim());

		expect(order.slice(-3)).toEqual(['impact-badges', 'Remember them?', 'impact-first-loan']);
	});

	it('shows the giving fund card beside the account overview card for giving fund lenders', () => {
		const { getByTestId } = renderLayout({ showGivingFund: true });
		const accountOverview = getByTestId('impact-account-overview');
		const givingFund = getByTestId('impact-giving-fund');

		expect(accountOverview.nextElementSibling).toBe(givingFund);
		expect(givingFund.parentElement.classList).toContain('md:tw-grid-cols-2');
	});

	it('hides the giving fund card for other lenders', () => {
		const { getByTestId, queryByTestId } = renderLayout();

		expect(queryByTestId('impact-giving-fund')).toBeNull();
		expect(getByTestId('impact-account-overview').classList).toContain('lg:tw-col-span-8');
	});

	it('spans the account overview 8 of 12 columns from lg', () => {
		const { getByTestId } = renderLayout();

		expect(getByTestId('impact-account-overview').classList).toContain('lg:tw-col-span-8');
	});
});

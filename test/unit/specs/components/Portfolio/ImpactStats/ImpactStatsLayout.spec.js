import { render } from '@testing-library/vue';
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

const renderLayout = () => render(ImpactStatsLayout, {
	global: {
		stubs: {
			AccountOverviewCard: {
				name: 'AccountOverviewCard',
				template: '<div data-testid="impact-account-overview"></div>',
			},
		},
	},
});

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

	it('has no giving fund card', () => {
		const { queryByTestId } = renderLayout();

		expect(queryByTestId('impact-giving-fund')).toBeNull();
	});

	it('spans the account overview 8 of 12 columns from lg', () => {
		const { getByTestId } = renderLayout();

		expect(getByTestId('impact-account-overview').classList).toContain('lg:tw-col-span-8');
	});
});

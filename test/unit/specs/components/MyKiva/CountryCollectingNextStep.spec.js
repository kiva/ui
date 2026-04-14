import { render, fireEvent } from '@testing-library/vue';
import CountryCollectingNextStep from '#src/components/MyKiva/CountryCollectingNextStep';

const mockTrackEvent = vi.fn();
const mockPush = vi.fn();

vi.mock('vue-router', () => ({
	useRouter: () => ({ push: mockPush }),
}));

const baseRegionsData = [
	{
		name: 'Africa', hasLoans: true, countries: ['KE', 'UG'], count: 50
	},
	{
		name: 'Asia', hasLoans: true, countries: ['PH', 'KH'], count: 40
	},
	{
		name: 'South America', hasLoans: false, countries: ['PE', 'EC', 'CO'], count: 30
	},
	{
		name: 'Central America', hasLoans: false, countries: ['SV', 'NI'], count: 20
	},
	{
		name: 'Oceania', hasLoans: false, countries: ['WS', 'FJ'], count: 10
	},
	{
		name: 'Middle East', hasLoans: false, countries: ['JO', 'LB'], count: 8
	},
	{
		name: 'Eastern Europe', hasLoans: false, countries: ['AL', 'GE'], count: 5
	},
	{
		name: 'North America', hasLoans: false, countries: ['US', 'MX'], count: 3
	},
];

const renderComponent = (regionsData = baseRegionsData) => {
	return render(CountryCollectingNextStep, {
		props: { regionsData },
		global: {
			provide: {
				$kvTrackEvent: mockTrackEvent,
			},
		},
	});
};

describe('CountryCollectingNextStep', () => {
	beforeEach(() => {
		mockTrackEvent.mockClear();
		mockPush.mockClear();
	});

	it('recommends the first unlent region by priority order', () => {
		const { getByText } = renderComponent();
		expect(getByText(/Help your first person in/)).toBeTruthy();
		expect(getByText(/South America/)).toBeTruthy();
	});

	it('renders the globe pill header', () => {
		const { getByText } = renderComponent();
		expect(getByText('Make a global impact')).toBeTruthy();
	});

	it('renders the CTA button', () => {
		const { getByText } = renderComponent();
		expect(getByText('Support a new region')).toBeTruthy();
	});

	it('navigates to combo page filtered by region countries on click', async () => {
		const { getByText } = renderComponent();
		await fireEvent.click(getByText('Support a new region'));
		expect(mockPush).toHaveBeenCalledWith('/lend/filter?country=PE,EC,CO');
	});

	it('tracks click with region name', async () => {
		const { getByText } = renderComponent();
		await fireEvent.click(getByText('Support a new region'));
		expect(mockTrackEvent).toHaveBeenCalledWith(
			'portfolio',
			'click',
			'next-step-intro-lending-stats',
			'South America'
		);
	});

	it('recommends Africa when no regions have loans', () => {
		const allUnlent = baseRegionsData.map(r => ({ ...r, hasLoans: false }));
		const { getByText } = renderComponent(allUnlent);
		expect(getByText(/Africa/)).toBeTruthy();
	});
});

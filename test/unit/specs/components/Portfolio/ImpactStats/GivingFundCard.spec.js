import { render } from '@testing-library/vue';
import { computed, ref } from 'vue';
import { globalOptions } from '#src/../test/unit/specUtils';
import GivingFundCard from '#src/components/Portfolio/ImpactStats/GivingFundCard';

const mockState = {};

vi.mock('#src/composables/useImpactStats', () => ({
	default: () => mockState,
}));

const renderCard = ({
	givingFundDeposits = 1000, fundraisersRaised = 1025, ownsGivingFunds = true, loading = false,
} = {}) => {
	Object.assign(mockState, {
		givingFundDeposits: computed(() => givingFundDeposits),
		fundraisersRaised: computed(() => fundraisersRaised),
		ownsGivingFunds: computed(() => ownsGivingFunds),
		loading: ref(false),
		givingFundLoading: ref(loading),
	});
	const tracked = [];
	const result = render(GivingFundCard, {
		global: {
			...globalOptions,
			directives: { kvTrackEvent: { mounted: (el, { value }) => tracked.push(value) } },
		},
	});
	return { ...result, tracked };
};

const valueOf = (getByTestId, id) => getByTestId(id).textContent.trim();

describe('GivingFundCard', () => {
	it('shows deposits and what the lender\'s fundraisers raised for a fund owner', () => {
		const { getByTestId, getByText } = renderCard();

		getByText('Giving Fund deposits');
		getByText('Your fundraisers');
		expect(valueOf(getByTestId, 'impact-giving-fund-deposits')).toBe('$1,000.00');
		expect(valueOf(getByTestId, 'impact-fundraisers')).toBe('$1,025.00');
	});

	it('shows deposits alone for a lender who owns no funds', () => {
		const { getByTestId, queryByText, queryByTestId } = renderCard({
			fundraisersRaised: 0, ownsGivingFunds: false,
		});

		expect(valueOf(getByTestId, 'impact-giving-fund-deposits')).toBe('$1,000.00');
		expect(queryByText('Your fundraisers')).toBeNull();
		expect(queryByTestId('impact-fundraisers')).toBeNull();
	});

	it('shows zero deposits as $0.00', () => {
		const { getByTestId } = renderCard({ givingFundDeposits: 0, fundraisersRaised: 0 });

		expect(valueOf(getByTestId, 'impact-giving-fund-deposits')).toBe('$0.00');
		expect(valueOf(getByTestId, 'impact-fundraisers')).toBe('$0.00');
	});

	it('shows loading text while the lender\'s data loads', () => {
		const { getByTestId } = renderCard({ givingFundDeposits: null, fundraisersRaised: null, loading: true });

		expect(getByTestId('impact-giving-fund-deposits').querySelector('.kv-loading-text')).not.toBeNull();
	});

	it('links Manage funds to /gfm in the same tab', () => {
		const { getByRole } = renderCard();
		const link = getByRole('link', { name: 'Manage funds' });

		expect(link.getAttribute('href')).toBe('/gfm');
		expect(link.hasAttribute('target')).toBe(false);
	});

	it('tracks Manage funds clicks', () => {
		const { tracked } = renderCard();

		expect(tracked).toContainEqual(['portfolio', 'click', 'manage-funds']);
	});

	it('carries the giving fund test id', () => {
		const { getByTestId } = renderCard();

		getByTestId('impact-giving-fund');
	});
});

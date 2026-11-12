import { render } from '@testing-library/vue';
import { computed, ref } from 'vue';
import { globalOptions } from '#src/../test/unit/specUtils';
import AccountOverviewCard from '#src/components/Portfolio/ImpactStats/AccountOverviewCard';

const mockState = {};

vi.mock('#src/composables/useImpactStats', () => ({
	default: () => mockState,
}));

const renderCard = ({ availableToLend = 847.23, lentOut = 3240, loading = false } = {}) => {
	Object.assign(mockState, {
		availableToLend: computed(() => availableToLend),
		lentOut: computed(() => lentOut),
		loading: ref(loading),
	});
	const tracked = [];
	const result = render(AccountOverviewCard, {
		global: {
			...globalOptions,
			directives: { kvTrackEvent: { mounted: (el, { value }) => tracked.push(value) } },
		},
	});
	return { ...result, tracked };
};

const valueOf = (getByTestId, id) => getByTestId(id).textContent.trim();

describe('AccountOverviewCard', () => {
	it('shows available to lend and lent out', () => {
		const { getByTestId, getByText } = renderCard();

		getByText('Available to lend');
		getByText('Lent out');
		expect(valueOf(getByTestId, 'impact-available-to-lend')).toBe('$847.23');
		expect(valueOf(getByTestId, 'impact-lent-out')).toBe('$3,240.00');
	});

	it('shows zero balances as $0.00', () => {
		const { getByTestId } = renderCard({ availableToLend: 0, lentOut: 0 });

		expect(valueOf(getByTestId, 'impact-available-to-lend')).toBe('$0.00');
		expect(valueOf(getByTestId, 'impact-lent-out')).toBe('$0.00');
	});

	it('shows loading text while the lender\'s data loads', () => {
		const { getByTestId } = renderCard({ availableToLend: null, lentOut: null, loading: true });

		expect(valueOf(getByTestId, 'impact-available-to-lend')).not.toContain('$');
		expect(valueOf(getByTestId, 'impact-lent-out')).not.toContain('$');
	});

	it('shows dashes when there is no data', () => {
		const { getByTestId } = renderCard({ availableToLend: null, lentOut: null });

		expect(valueOf(getByTestId, 'impact-available-to-lend')).toBe('—');
		expect(valueOf(getByTestId, 'impact-lent-out')).toBe('—');
	});

	it('links Find a loan to /lend-by-category', () => {
		const { getByRole } = renderCard();

		expect(getByRole('link', { name: 'Find a loan' }).getAttribute('href')).toBe('/lend-by-category');
	});

	it('tracks Find a loan clicks', () => {
		const { tracked } = renderCard();

		expect(tracked).toContainEqual(['portfolio', 'click', 'find-a-loan']);
	});

	it('carries the account overview test id', () => {
		const { getByTestId } = renderCard();

		getByTestId('impact-account-overview');
	});
});

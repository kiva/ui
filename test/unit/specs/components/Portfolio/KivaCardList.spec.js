import { render } from '@testing-library/vue';
import KivaCardList from '#src/components/Portfolio/KivaCardList';

const renderList = props => render(KivaCardList, {
	props,
	global: {
		stubs: {
			KvGrid: { template: '<div><slot /></div>' },
			KvLoadingPlaceholder: { template: '<div data-testid="skeleton" />' },
			KivaCardListItem: {
				props: ['card'],
				template: '<div data-testid="card-item">{{ card.id }}</div>',
			},
		},
	},
});

describe('KivaCardList', () => {
	it('renders skeletons while loading', () => {
		const { getAllByTestId, queryByTestId } = renderList({ loading: true, cards: [] });
		expect(getAllByTestId('skeleton').length).toBeGreaterThan(0);
		expect(queryByTestId('card-item')).toBeNull();
	});

	it('renders an item per card when loaded', () => {
		const { getAllByTestId } = renderList({
			loading: false,
			cards: [{ id: 1 }, { id: 2 }],
		});
		expect(getAllByTestId('card-item').length).toBe(2);
	});

	it('shows the error state on error', () => {
		const { getByTestId } = renderList({ loading: false, hasError: true, cards: [] });
		expect(getByTestId('kiva-cards-error-message')).toBeTruthy();
	});

	it('shows the empty state for a withdrawable account with no cards', () => {
		const { getByTestId } = renderList({ loading: false, cards: [], canWithdraw: true });
		expect(getByTestId('no-kiva-cards-message')).toBeTruthy();
	});

	it('hides the empty state for a non-withdrawable account with no cards', () => {
		const { queryByTestId } = renderList({ loading: false, cards: [], canWithdraw: false });
		expect(queryByTestId('no-kiva-cards-message')).toBeNull();
	});
});

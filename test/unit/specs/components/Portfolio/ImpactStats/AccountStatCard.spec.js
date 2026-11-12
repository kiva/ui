import { render } from '@testing-library/vue';
import AccountStatCard from '#src/components/Portfolio/ImpactStats/AccountStatCard';

const STATS = [
	{
		label: 'Available to lend', value: 847.23, testId: 'first', highlight: true,
	},
	{ label: 'Lent out', value: 3240, testId: 'second' },
];

const renderCard = ({ stats = STATS, loading = false, attrs = {} } = {}) => render(AccountStatCard, {
	props: { stats, loading, ...attrs },
	slots: { default: '<button>Act</button>' },
});

describe('AccountStatCard', () => {
	it('renders each stat as a term and its formatted value', () => {
		const { getByText, getByTestId } = renderCard();

		expect(getByText('Available to lend').tagName).toBe('DT');
		expect(getByText('Lent out').tagName).toBe('DT');
		expect(getByTestId('first').textContent.trim()).toBe('$847.23');
		expect(getByTestId('second').textContent.trim()).toBe('$3,240.00');
	});

	it('formats zero as $0.00', () => {
		const { getByTestId } = renderCard({ stats: [{ label: 'Lent out', value: 0, testId: 'zero' }] });

		expect(getByTestId('zero').textContent.trim()).toBe('$0.00');
	});

	it('shows a dash when a value is null', () => {
		const { getByTestId } = renderCard({ stats: [{ label: 'Lent out', value: null, testId: 'none' }] });

		expect(getByTestId('none').textContent.trim()).toBe('—');
	});

	it('shows loading text instead of values while loading', () => {
		const { getByTestId } = renderCard({ loading: true });

		expect(getByTestId('first').querySelector('.kv-loading-text')).not.toBeNull();
		expect(getByTestId('first').textContent).not.toContain('$');
	});

	it('colors only highlighted values with the action color', () => {
		const { getByTestId } = renderCard();

		expect(getByTestId('first').classList).toContain('tw-text-action');
		expect(getByTestId('second').classList).toContain('tw-text-primary');
		expect(getByTestId('second').classList).not.toContain('tw-text-action');
	});

	it('renders the action slot after the stats', () => {
		const { container, getByRole } = renderCard();
		const button = getByRole('button', { name: 'Act' });

		expect(container.querySelector('dl').compareDocumentPosition(button))
			.toBe(Node.DOCUMENT_POSITION_FOLLOWING);
	});

	it('puts fallthrough attributes on the card root', () => {
		const { container } = renderCard({ attrs: { 'data-testid': 'card' } });

		expect(container.firstElementChild.dataset.testid).toBe('card');
	});
});

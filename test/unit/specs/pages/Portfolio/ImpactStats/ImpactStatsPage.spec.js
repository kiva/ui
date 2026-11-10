import { render } from '@testing-library/vue';
import { computed, ref } from 'vue';
import { useHead } from '@unhead/vue';
import ImpactStatsPage from '#src/pages/Portfolio/ImpactStats/ImpactStatsPage';

const mockState = {};

vi.mock('@unhead/vue', () => ({
	useHead: vi.fn(),
}));

vi.mock('#src/composables/useImpactStats', () => ({
	default: () => mockState,
}));

const renderPage = ({ firstName = 'James' } = {}) => {
	Object.assign(mockState, {
		firstName: computed(() => firstName),
		loading: ref(false),
		error: ref(null),
	});

	return render(ImpactStatsPage, {
		global: {
			stubs: {
				WwwPage: { template: '<div><slot /></div>' },
				ImpactStatsLayout: { template: '<div data-testid="impact-layout"></div>' },
			},
		},
	});
};

describe('ImpactStatsPage', () => {
	it('greets the lender by name', () => {
		const { getByRole, getByText } = renderPage();

		expect(getByRole('heading', { level: 1 }).textContent.trim()).toBe('James, here\'s the impact you\'ve made!');
		getByText('Your account');
		getByText('Your portfolio, milestones, and the borrowers behind every dollar.');
	});

	it('drops the name when there is none', () => {
		const { getByRole } = renderPage({ firstName: '' });

		getByRole('heading', { level: 1, name: 'Here\'s the impact you\'ve made!' });
	});

	it('sets the page title', () => {
		renderPage();

		expect(useHead).toHaveBeenCalledWith({ title: 'Your impact' });
	});

	it('renders the layout', () => {
		const { getByTestId } = renderPage();

		getByTestId('impact-layout');
	});

	it('hides only the lender\'s name from session recordings', () => {
		const { getByText, getByRole } = renderPage();

		expect(getByText('James').hasAttribute('data-hj-suppress')).toBe(true);
		expect(getByRole('heading', { level: 1 }).hasAttribute('data-hj-suppress')).toBe(false);
	});
});

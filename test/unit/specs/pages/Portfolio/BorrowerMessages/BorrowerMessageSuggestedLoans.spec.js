import { render, fireEvent } from '@testing-library/vue';
import { ref } from 'vue';
import useBorrowerMessageSuggestedLoans from '#src/composables/useBorrowerMessageSuggestedLoans';
import BorrowerMessageSuggestedLoans from '#src/pages/Portfolio/BorrowerMessages/BorrowerMessageSuggestedLoans';

const mockPush = vi.fn();

vi.mock('vue-router', () => ({
	useRouter: () => ({ push: mockPush }),
}));

vi.mock('#src/composables/useBorrowerMessageSuggestedLoans', () => ({
	default: vi.fn(),
}));

const LOANS = [{ id: 101 }, { id: 102 }, { id: 103 }];

const buildLoan = overrides => ({
	id: 456,
	name: 'Dina Teresa',
	geocode: { country: { id: 1, name: 'El Salvador' } },
	partner: { id: 3, name: 'CrediCampo' },
	...overrides,
});

const renderSection = ({ loans = LOANS, isFallback = false, loan = buildLoan() } = {}) => {
	useBorrowerMessageSuggestedLoans.mockReturnValue({ loans: ref(loans), isFallback: ref(isFallback) });
	return render(BorrowerMessageSuggestedLoans, {
		props: { loan },
		global: {
			provide: {
				$appConfig: { photoPath: 'https://www.kiva.org/img/' },
				$kvTrackEvent: vi.fn(),
			},
			directives: {
				kvTrackEvent: {
					beforeMount(el, { value }) {
						el.setAttribute('data-track-event', JSON.stringify(value));
					},
				},
			},
			stubs: {
				KvClassicLoanCardContainer: {
					props: ['loanId'],
					template: '<div data-testid="classic-card">{{ loanId }}</div>',
				},
				KvCompactLoanCard: {
					props: {
						loanId: Number,
						loan: Object,
						showLightView: Boolean,
						customLoanDetails: Boolean,
						externalLinks: Boolean,
						customHref: String,
						photoPath: String,
					},
					emits: ['show-loan-details'],
					template: `<button
						data-testid="compact-card"
						:data-light-view="showLightView"
						:data-custom-details="customLoanDetails"
						:data-external-links="externalLinks"
						:data-href="customHref"
						@click="$emit('show-loan-details')"
					>
						{{ loanId }}
					</button>`,
				},
			},
		},
	});
};

const texts = elements => elements.map(el => el.textContent.trim());

beforeEach(() => {
	mockPush.mockClear();
	useBorrowerMessageSuggestedLoans.mockReset();
});

describe('BorrowerMessageSuggestedLoans', () => {
	it('passes the partner id to the loans composable', () => {
		renderSection();

		expect(useBorrowerMessageSuggestedLoans).toHaveBeenCalledWith([3]);
	});

	it('renders nothing until loans load', () => {
		const { queryByTestId } = renderSection({ loans: null });

		expect(queryByTestId('borrower-message-suggested-loans')).toBeNull();
	});

	it('renders nothing when there are no loans', () => {
		const { queryByTestId } = renderSection({ loans: [] });

		expect(queryByTestId('borrower-message-suggested-loans')).toBeNull();
	});

	it('shows the partner copy', () => {
		const { getByRole, getByText } = renderSection();

		getByRole('heading', { level: 2, name: "More loans from Dina Teresa's community" });
		getByText("CrediCampo, the lending partner behind Dina Teresa's loan, "
			+ 'is raising funds for these entrepreneurs in El Salvador right now.');
	});

	it('does not add a possessive to a group loan name', () => {
		const { getByRole, getByText } = renderSection({ loan: buildLoan({ name: "Sokha's Group" }) });

		getByRole('heading', { level: 2, name: "More loans from Sokha's Group community" });
		getByText("CrediCampo, the lending partner behind Sokha's Group loan, "
			+ 'is raising funds for these entrepreneurs in El Salvador right now.');
	});

	it('uses a bare apostrophe after a name ending in s', () => {
		const { getByRole } = renderSection({ loan: buildLoan({ name: 'Carlos' }) });

		getByRole('heading', { level: 2, name: "More loans from Carlos' community" });
	});

	it('drops the country from the partner subhead when the loan has none', () => {
		const { getByText } = renderSection({ loan: buildLoan({ geocode: { country: null } }) });

		getByText("CrediCampo, the lending partner behind Dina Teresa's loan, "
			+ 'is raising funds for these entrepreneurs right now.');
	});

	it("links to the partner's loans", () => {
		const { getAllByRole } = renderSection();
		const links = getAllByRole('link', { name: 'View all CrediCampo loans' });

		expect(links).toHaveLength(2);
		links.forEach(link => {
			expect(link.getAttribute('href')).toBe('/lend/filter?partner=3');
			expect(JSON.parse(link.dataset.trackEvent))
				.toEqual(['portfolio', 'click', 'Borrower message view partner loans', 3]);
		});
	});

	it('shows the fallback copy and link', () => {
		const {
			getByRole, getByText, getAllByRole, queryByText,
		} = renderSection({ isFallback: true });

		getByRole('heading', { level: 2, name: 'Loans you might like' });
		getByText('Entrepreneurs raising funds on Kiva right now.');
		const links = getAllByRole('link', { name: 'View more loans' });
		expect(links).toHaveLength(2);
		links.forEach(link => {
			expect(link.getAttribute('href')).toBe('/lend-by-category');
			expect(JSON.parse(link.dataset.trackEvent))
				.toEqual(['portfolio', 'click', 'Borrower message view more loans']);
		});
		expect(queryByText(/CrediCampo/)).toBeNull();
	});

	it('renders a classic and a compact card per loan', () => {
		const { getAllByTestId } = renderSection();

		expect(texts(getAllByTestId('classic-card'))).toEqual(['101', '102', '103']);
		expect(texts(getAllByTestId('compact-card'))).toEqual(['101', '102', '103']);
	});

	it('gives each compact card its loan page as the link href', () => {
		const { getAllByTestId } = renderSection();
		const [card] = getAllByTestId('compact-card');

		expect([card.dataset.externalLinks, card.dataset.href]).toEqual(['true', '/lend/101']);
	});

	it('opens the loan page from a compact card', async () => {
		const { getAllByTestId } = renderSection();

		const [card] = getAllByTestId('compact-card');
		expect([card.dataset.lightView, card.dataset.customDetails]).toEqual(['true', 'true']);

		await fireEvent.click(card);

		expect(mockPush).toHaveBeenCalledWith('/lend/101');
	});
});

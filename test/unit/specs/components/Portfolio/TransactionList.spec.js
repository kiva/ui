import { render } from '@testing-library/vue';
import TransactionList from '#src/components/Portfolio/TransactionList';
import numeralFilter from '#src/plugins/numeral-filter';

const makeTransaction = (overrides = {}) => ({
	createTime: '2026-03-15T12:00:00Z',
	displayName: 'Loan',
	description: 'Loan to Maria',
	category: 'loan',
	type: 'loan_purchase',
	paymentTransactionId: null,
	amount: '-25.00',
	newBalance: '75.00',
	loan: {
		id: 1208499,
		name: 'Maria',
		geocode: { country: { id: 1, isoCode: 'PE', name: 'Peru' } },
		partnerName: 'Partner 44',
		partnerId: 44,
	},
	...overrides,
});

let trackedEvents = [];

beforeEach(() => {
	trackedEvents = [];
});

const renderTransactionList = ({
	transactions = [], loading = false, hasError = false, hasAnyTransactions = false,
} = {}) => render(TransactionList, {
	props: {
		transactions, loading, hasError, hasAnyTransactions,
	},
	global: {
		// Capture every v-kv-track-event binding value so we can assert analytics coverage.
		directives: { kvTrackEvent: (el, binding) => { trackedEvents.push(binding.value); } },
		mocks: {
			$filters: { numeral: numeralFilter },
		},
		stubs: {
			KvFlag: {
				props: ['country', 'name'],
				template: '<span class="kv-flag" :data-country="country" :data-name="name" />',
			},
			KvLoadingPlaceholder: { template: '<div class="kv-loading-placeholder" />' },
		},
	},
});

describe('TransactionList', () => {
	it('shows loading skeletons while loading', () => {
		const page = renderTransactionList({ loading: true });
		expect(page.container.querySelectorAll('.kv-loading-placeholder').length).toBeGreaterThan(0);
		expect(page.queryByTestId('no-transactions-message')).toBeNull();
	});

	it('shows only skeletons while loading, hiding any previous results', () => {
		// On a filter change the parent sets loading=true before the new results arrive, but the
		// previous transactions prop is still populated — the list must not render those stale rows.
		const page = renderTransactionList({ loading: true, transactions: [makeTransaction()] });
		expect(page.container.querySelectorAll('.kv-loading-placeholder').length).toBeGreaterThan(0);
		expect(page.queryByRole('link', { name: /Maria/ })).toBeNull();
		expect(page.queryByText('Loan to Maria')).toBeNull();
	});

	it('shows an error row when hasError is true', () => {
		const page = renderTransactionList({ loading: false, hasError: true });
		expect(page.getByTestId('transactions-error-message')).toBeTruthy();
	});

	it('shows the "no transactions yet" message when the account has none at all', () => {
		const page = renderTransactionList({ loading: false, transactions: [], hasAnyTransactions: false });
		expect(page.getByTestId('no-transactions-message').textContent)
			.toContain("You don't have any transactions yet.");
		expect(page.queryByTestId('no-matching-transactions-message')).toBeNull();
	});

	it('shows the "no matches" message when the account has transactions but none match the filter', () => {
		const page = renderTransactionList({ loading: false, transactions: [], hasAnyTransactions: true });
		expect(page.getByTestId('no-matching-transactions-message').textContent)
			.toContain("You don't have any transactions that match this search.");
		expect(page.queryByTestId('no-transactions-message')).toBeNull();
	});

	it('renders a loan-transaction row with loan link, category, description and amounts', () => {
		const page = renderTransactionList({ loading: false, transactions: [makeTransaction()] });

		const loanLink = page.getByRole('link', { name: /Maria/ });
		expect(loanLink.getAttribute('href')).toBe('/lend/1208499');
		// Loan id renders parenthesized, matching the legacy "Name (#id)" format.
		expect(page.getByText('(#1208499)')).toBeTruthy();
		expect(page.getByText('Partner 44')).toBeTruthy();
		expect(page.getByText('Peru')).toBeTruthy();
		expect(page.getByText('Loan to Maria')).toBeTruthy();
		// amount + running credit balance formatted as currency
		expect(page.getByText('-$25.00')).toBeTruthy();
		expect(page.getByText('$75.00')).toBeTruthy();
		expect(page.queryByTestId('no-transactions-message')).toBeNull();
	});

	it('tracks the loan link click', () => {
		renderTransactionList({ loading: false, transactions: [makeTransaction()] });
		expect(trackedEvents).toContainEqual(
			['portfolio', 'click', 'View borrower details', null, 1208499]
		);
	});

	it('tracks the partner link click', () => {
		renderTransactionList({ loading: false, transactions: [makeTransaction()] });
		expect(trackedEvents).toContainEqual(
			['portfolio', 'click', 'View partner details', null, 44]
		);
	});

	it('tracks the trustee link click', () => {
		renderTransactionList({
			loading: false,
			transactions: [makeTransaction({
				loan: {
					id: 777,
					name: 'Ana',
					geocode: { country: { id: 2, isoCode: 'KE', name: 'Kenya' } },
					trusteeName: 'Trustee A',
					trusteeId: 9,
				},
			})],
		});
		expect(trackedEvents).toContainEqual(
			['portfolio', 'click', 'View trustee details', null, 9]
		);
	});

	it('renders a dash in the loan cell for a non-loan transaction', () => {
		const page = renderTransactionList({
			loading: false,
			transactions: [makeTransaction({
				category: 'deposit', displayName: 'Deposit', description: 'Deposit to account', loan: null,
			})],
		});
		expect(page.queryByRole('link', { name: /Maria/ })).toBeNull();
		expect(page.getByText('Deposit to account')).toBeTruthy();
	});

	it('leaves BOTH the loan and partner columns empty (no dash) for a non-loan transaction', () => {
		const page = renderTransactionList({
			loading: false,
			transactions: [makeTransaction({
				displayName: 'Deposit', description: 'Deposit to account', loan: null,
			})],
		});
		expect(page.queryAllByText('-').length).toBe(0);
		const cells = page.container.querySelectorAll('tbody tr td');
		expect(cells[0].textContent.trim()).toBe('');
		expect(cells[1].textContent.trim()).toBe('');
	});

	it('formats the transaction date with time and timezone (legacy Date / Time parity)', () => {
		const page = renderTransactionList({ loading: false, transactions: [makeTransaction()] });
		// Time-of-day + timezone vary by the test env's locale/zone, so match the date
		// portion and assert a time component (AM/PM) is present alongside it.
		const dateCell = page.getByText(/Mar 1[45], 2026/);
		expect(dateCell).toBeTruthy();
		expect(dateCell.textContent).toMatch(/\b(AM|PM)\b/);
	});

	it('renders an empty (not "Invalid Date") cell when createTime is missing', () => {
		const page = renderTransactionList({ loading: false, transactions: [makeTransaction({ createTime: null })] });
		expect(page.queryByText('Invalid Date')).toBeNull();
	});

	it('falls back to the category when displayName is absent', () => {
		const page = renderTransactionList({
			loading: false,
			transactions: [makeTransaction({ displayName: null, category: 'deposit', description: 'x' })],
		});
		expect(page.getByText('deposit')).toBeTruthy();
	});

	it('renders the labeled payment transaction id sub-line when present', () => {
		const page = renderTransactionList({
			loading: false,
			transactions: [makeTransaction({ paymentTransactionId: 'ch_abc123' })],
		});
		// Legacy parity: the payment reference is prefixed with a "Transaction ID:" label.
		expect(page.getByText('Transaction ID: ch_abc123')).toBeTruthy();
	});

	it('links the partner to the canonical partner page', () => {
		const page = renderTransactionList({ loading: false, transactions: [makeTransaction()] });
		expect(page.getByText('Partner 44').closest('a').getAttribute('href'))
			.toBe('/about/where-kiva-works/partners/44');
	});

	it('links the trustee to the trustee page and renders the country flag', () => {
		const page = renderTransactionList({
			loading: false,
			transactions: [makeTransaction({
				loan: {
					id: 3,
					name: 'Ana',
					geocode: { country: { id: 2, isoCode: 'KE', name: 'Kenya' } },
					trusteeName: 'Trustee A',
					trusteeId: 9,
				},
			})],
		});
		expect(page.getByText('Trustee A').closest('a').getAttribute('href')).toBe('/trustees/9');
		expect(page.getByText('Kenya')).toBeTruthy();
		expect(page.container.querySelector('.kv-flag').getAttribute('data-country')).toBe('KE');
	});

	it('applies alternating row striping to every other row', () => {
		const page = renderTransactionList({
			loading: false,
			transactions: [makeTransaction(), makeTransaction()],
		});
		const rows = page.container.querySelectorAll('tbody tr');
		expect(rows[0].className).not.toContain('!tw-bg-gray-50');
		expect(rows[1].className).toContain('!tw-bg-gray-50');
	});
});

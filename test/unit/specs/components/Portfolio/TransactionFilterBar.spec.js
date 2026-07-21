import { render, fireEvent } from '@testing-library/vue';
import TransactionFilterBar from '#src/components/Portfolio/TransactionFilterBar';

const lastEmittedPayload = emitted => {
	const events = emitted()['filters-changed'];
	return events[events.length - 1][0];
};

let trackEvent;

beforeEach(() => {
	trackEvent = vi.fn();
	// The export button navigates via window.location.href; make it writable/inspectable.
	delete window.location;
	window.location = { href: '' };
});

const renderTransactionFilterBar = ({ props = {} } = {}) => render(TransactionFilterBar, {
	props: {
		totalTransactions: 12,
		filters: {},
		keywordSearch: '',
		...props,
	},
	global: {
		mocks: { $kvTrackEvent: trackEvent },
		directives: { kvTrackEvent: () => {} },
		stubs: {
			KvTextInput: {
				props: ['id', 'modelValue', 'placeholder', 'canClear'],
				emits: ['update:modelValue'],
				template: `
					<input
						:id="id"
						:value="modelValue"
						:placeholder="placeholder"
						@input="$emit('update:modelValue', $event.target.value)"
					>
				`,
			},
			KvSelect: {
				props: ['id', 'modelValue'],
				emits: ['update:modelValue'],
				template: `
					<select
						:id="id"
						:value="modelValue"
						@change="$emit('update:modelValue', $event.target.value)"
					>
						<slot />
					</select>
				`,
			},
			KvButton: {
				props: ['state'],
				emits: ['click'],
				template: `
					<button
						type="button"
						:disabled="state === 'disabled' || state === 'loading'"
						@click="$emit('click', $event)"
					>
						<slot />
					</button>
				`,
			},
			// KvDatePicker's model is a Date and it emits update:model-value + change (like the real
			// component). Emit both from a native input so v-model syncs before @change reads it.
			KvDatePicker: {
				props: ['id', 'modelValue'],
				emits: ['update:model-value', 'change'],
				methods: {
					onChange(event) {
						const value = event.target.value ? new Date(`${event.target.value}T00:00:00`) : null;
						this.$emit('update:model-value', value);
						this.$emit('change', value);
					},
				},
				template: '<input :id="id" @change="onChange">',
			},
		},
	},
});

describe('TransactionFilterBar', () => {
	it('emits the selected category (omitting the default "all")', async () => {
		const { container, emitted } = renderTransactionFilterBar();
		await fireEvent.update(container.querySelector('select#transaction-category-select'), 'deposit');
		expect(lastEmittedPayload(emitted).filters.category).toBe('deposit');
	});

	it('emits the sort order', async () => {
		const { container, emitted } = renderTransactionFilterBar();
		await fireEvent.update(container.querySelector('select#transaction-sort-select'), 'oldest');
		expect(lastEmittedPayload(emitted).filters.sortBy).toBe('oldest');
	});

	it('emits the keyword search on blur', async () => {
		const { container, emitted } = renderTransactionFilterBar();
		const input = container.querySelector('input#transaction-filter-text-input');
		await fireEvent.update(input, '12345');
		await fireEvent.blur(input);
		expect(lastEmittedPayload(emitted).keywordSearch).toBe('12345');
	});

	it('emits a start date when one is set', async () => {
		const { container, emitted } = renderTransactionFilterBar();
		const input = container.querySelector('input#transaction-start-date');
		await fireEvent.update(input, '2026-01-01');
		await fireEvent.change(input);
		expect(lastEmittedPayload(emitted).filters.startDate).toBe('2026-01-01');
	});

	it('tracks category changes', async () => {
		const { container } = renderTransactionFilterBar();
		await fireEvent.update(container.querySelector('select#transaction-category-select'), 'deposit');
		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'transactions-filter-category', 'deposit');
	});

	it('tracks sort changes', async () => {
		const { container } = renderTransactionFilterBar();
		await fireEvent.update(container.querySelector('select#transaction-sort-select'), 'oldest');
		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'transactions-sort', 'oldest');
	});

	it('tracks a keyword search without logging the term', async () => {
		const { container } = renderTransactionFilterBar();
		const input = container.querySelector('input#transaction-filter-text-input');
		await fireEvent.update(input, '12345');
		await fireEvent.blur(input);
		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'transactions-keyword-search');
	});

	it('tracks a date-range change', async () => {
		const { container } = renderTransactionFilterBar();
		const input = container.querySelector('input#transaction-start-date');
		await fireEvent.update(input, '2026-01-01');
		await fireEvent.change(input);
		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'transactions-filter-date-range');
	});

	it('tracks clearing filters', async () => {
		const { getByTestId } = renderTransactionFilterBar({
			props: { filters: { category: 'deposit', sortBy: 'newest' } },
		});
		await fireEvent.click(getByTestId('clear-transaction-filters'));
		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'transactions-clear-filters');
	});

	it('omits category when set to "all" but always sends sortBy', async () => {
		const { container, emitted } = renderTransactionFilterBar({
			props: { filters: { category: 'deposit', sortBy: 'newest' } },
		});
		await fireEvent.update(container.querySelector('select#transaction-category-select'), 'all');
		const payload = lastEmittedPayload(emitted);
		expect(payload.filters.category).toBeUndefined();
		expect(payload.filters.sortBy).toBe('newest');
	});

	it('emits an end date when one is set', async () => {
		const { container, emitted } = renderTransactionFilterBar();
		const input = container.querySelector('input#transaction-end-date');
		await fireEvent.update(input, '2026-02-01');
		await fireEvent.change(input);
		expect(lastEmittedPayload(emitted).filters.endDate).toBe('2026-02-01');
	});

	it('commits the keyword search on Enter', async () => {
		const { container, emitted } = renderTransactionFilterBar();
		const input = container.querySelector('input#transaction-filter-text-input');
		await fireEvent.update(input, 'ch_9');
		await fireEvent.keyUp(input, { key: 'Enter' });
		expect(lastEmittedPayload(emitted).keywordSearch).toBe('ch_9');
	});

	it('does not re-emit the keyword search when it is unchanged', async () => {
		const { container, emitted } = renderTransactionFilterBar({ props: { keywordSearch: 'abc' } });
		await fireEvent.blur(container.querySelector('input#transaction-filter-text-input'));
		expect(emitted()['filters-changed']).toBeUndefined();
	});

	it('commits a cleared search when the input is emptied (KvTextInput X)', async () => {
		const { container, emitted } = renderTransactionFilterBar({ props: { keywordSearch: 'abc' } });
		await fireEvent.update(container.querySelector('input#transaction-filter-text-input'), '');
		expect(lastEmittedPayload(emitted).keywordSearch).toBeNull();
	});

	it('hides "Clear filters" when nothing is active and shows it when a filter is active', () => {
		expect(renderTransactionFilterBar().queryByTestId('clear-transaction-filters')).toBeNull();
		const active = renderTransactionFilterBar({ props: { filters: { category: 'deposit', sortBy: 'newest' } } });
		expect(active.getByTestId('clear-transaction-filters')).toBeTruthy();
	});

	it('clearing filters emits an empty filter set with the default sort', async () => {
		const { getByTestId, emitted } = renderTransactionFilterBar({
			props: { filters: { category: 'deposit', sortBy: 'newest' } },
		});
		await fireEvent.click(getByTestId('clear-transaction-filters'));
		expect(lastEmittedPayload(emitted)).toEqual({ filters: { sortBy: 'newest' }, keywordSearch: null });
	});

	it('renders a comma-formatted, pluralized transaction count', () => {
		const countText = totalTransactions => renderTransactionFilterBar({ props: { totalTransactions } })
			.container.querySelector('[data-testid="transactions-count"]').textContent.trim();
		expect(countText(1234)).toBe('1,234 transactions');
		expect(countText(1)).toBe('1 transaction');
		expect(countText(0)).toBe('0 transactions');
	});

	it('re-syncs the selects when the parent filters prop changes', async () => {
		const { container, rerender } = renderTransactionFilterBar();
		await rerender({ totalTransactions: 12, filters: { category: 'gift', sortBy: 'oldest' }, keywordSearch: '' });
		expect(container.querySelector('select#transaction-category-select').value).toBe('gift');
		expect(container.querySelector('select#transaction-sort-select').value).toBe('oldest');
	});

	it('navigates to the legacy export route carrying the applied filters', async () => {
		const page = renderTransactionFilterBar({
			props: {
				filters: {
					sortBy: 'oldest', category: 'loan', startDate: '2026-01-01', endDate: '2026-03-31',
				},
				keywordSearch: '123456',
			},
		});
		await fireEvent.click(page.getByTestId('export-transactions'));
		const { href } = window.location;
		expect(href).toContain('/portfolio/transactions?');
		expect(href).toContain('export_excel=true');
		expect(href).toContain('category=loan');
		expect(href).toContain('sortBy=oldest');
		expect(href).toContain('startDate=2026-01-01');
		expect(href).toContain('endDate=2026-03-31');
		expect(href).toContain('queryString=123456');
	});

	it('omits unset filters from the export URL', async () => {
		const page = renderTransactionFilterBar({ props: { filters: { sortBy: 'newest' }, keywordSearch: '' } });
		await fireEvent.click(page.getByTestId('export-transactions'));
		const { href } = window.location;
		expect(href).toContain('export_excel=true');
		expect(href).toContain('sortBy=newest');
		expect(href).not.toContain('category=');
		expect(href).not.toContain('startDate=');
		expect(href).not.toContain('queryString=');
	});

	it('renders the export button label with the filtered, pluralized transaction count', () => {
		expect(renderTransactionFilterBar({ props: { totalTransactions: 1234 } })
			.getByText('Export 1,234 transactions')).toBeTruthy();
		expect(renderTransactionFilterBar({ props: { totalTransactions: 1 } })
			.getByText('Export 1 transaction')).toBeTruthy();
	});

	it('disables the export button when there are no transactions to export', () => {
		const page = renderTransactionFilterBar({ props: { totalTransactions: 0 } });
		expect(page.getByText('Export 0 transactions').closest('button').disabled).toBe(true);
	});

	it('tracks a click on the export button', async () => {
		const page = renderTransactionFilterBar();
		await fireEvent.click(page.getByTestId('export-transactions'));
		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'transactions-export');
	});
});

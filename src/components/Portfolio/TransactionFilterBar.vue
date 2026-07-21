<template>
	<div>
		<div class="tw-flex tw-flex-col">
			<kv-text-input
				id="transaction-filter-text-input"
				v-model="searchText"
				:can-clear="true"
				placeholder="Search by loan ID or payment transaction ID"
				@keyup.enter.prevent="emitDraftKeywordSearchIfChanged"
				@blur="emitDraftKeywordSearchIfChanged"
			/>
			<div class="tw-flex tw-flex-col tw-gap-2 tw-mt-2">
				<!-- Category + Sort share one row, each taking half the width from md up. -->
				<div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-2">
					<div class="tw-flex tw-items-center tw-gap-2 md:tw-flex-1 md:tw-min-w-0">
						<span class="tw-whitespace-nowrap">Category:</span>
						<kv-select
							id="transaction-category-select"
							class="transaction-filter-control"
							v-model="selectedCategory"
							@update:model-value="handleCategoryChange"
						>
							<option
								v-for="option in categoryOptions"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
							</option>
						</kv-select>
					</div>
					<div class="tw-flex tw-items-center tw-gap-2 md:tw-flex-1 md:tw-min-w-0">
						<span class="tw-whitespace-nowrap">Sort:</span>
						<kv-select
							id="transaction-sort-select"
							class="transaction-filter-control"
							v-model="selectedSort"
							@update:model-value="handleSortChange"
						>
							<option
								v-for="option in sortOptions"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
							</option>
						</kv-select>
					</div>
				</div>
				<!-- Date range on its own row, From/To each taking half the width from md up. -->
				<div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-2">
					<div class="tw-flex tw-items-center tw-gap-2 md:tw-flex-1 md:tw-min-w-0">
						<span class="tw-whitespace-nowrap">From:</span>
						<div class="transaction-filter-control">
							<kv-date-picker
								id="transaction-start-date"
								v-model="startDate"
								:enable-time-picker="false"
								:clearable="true"
								:teleport="true"
								format="yyyy-MM-dd"
								:max-date="endDate || undefined"
								@change="handleDateChange"
							/>
						</div>
					</div>
					<div class="tw-flex tw-items-center tw-gap-2 md:tw-flex-1 md:tw-min-w-0">
						<span class="tw-whitespace-nowrap">To:</span>
						<div class="transaction-filter-control">
							<kv-date-picker
								id="transaction-end-date"
								v-model="endDate"
								:enable-time-picker="false"
								:clearable="true"
								:teleport="true"
								format="yyyy-MM-dd"
								:min-date="startDate || undefined"
								@change="handleDateChange"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="tw-flex tw-items-center tw-gap-2 tw-mt-2">
			<!-- Reuses the legacy server-side Excel export at /portfolio/transactions -->
			<kv-button
				variant="primary"
				:state="totalTransactions ? '' : 'disabled'"
				data-testid="export-transactions"
				@click="handleExportClick"
			>
				{{ exportLabel }}
			</kv-button>
			<span class="tw-ml-auto tw-text-subhead" data-testid="transactions-count">
				{{ transactionCountLabel }}
			</span>
		</div>
		<div class="tw-flex tw-items-center tw-gap-2 tw-mt-1">
			<button
				v-if="hasActiveFilters"
				type="button"
				class="tw-text-action tw-text-small tw-underline"
				data-testid="clear-transaction-filters"
				@click="clearAllFilters"
			>
				Clear filters
			</button>
		</div>
	</div>
</template>

<script>
import {
	KvSelect, KvTextInput, KvButton, KvDatePicker,
} from '@kiva/kv-components';

const ALL_CATEGORIES_VALUE = 'all';
const DEFAULT_SORT = 'newest';

// KvDatePicker's model is a Date, but the filter contract (GraphQL filter + the legacy export URL)
// is a `yyyy-mm-dd` string. Convert using LOCAL date parts on both sides so a date never shifts a
// day across the UTC boundary (which `toISOString()`/`new Date('yyyy-mm-dd')` would do).
function fromIsoDate(value) {
	if (!value) {
		return null;
	}
	if (value instanceof Date) {
		return value;
	}
	const [year, month, day] = String(value).split('-').map(Number);
	if (!year || !month || !day) {
		return null;
	}
	return new Date(year, month - 1, day);
}

function toIsoDate(value) {
	if (!value) {
		return '';
	}
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) {
		return '';
	}
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

const categoryOptions = [
	{ value: ALL_CATEGORIES_VALUE, label: 'All categories' },
	{ value: 'loan', label: 'Loans' },
	{ value: 'gift', label: 'Gifts' },
	{ value: 'deposit', label: 'Deposits' },
	{ value: 'withdrawal', label: 'Withdrawals' },
	{ value: 'donation', label: 'Donations' },
];

const sortOptions = [
	{ value: 'newest', label: 'Newest first' },
	{ value: 'oldest', label: 'Oldest first' },
];

export default {
	name: 'TransactionFilterBar',
	components: {
		KvSelect,
		KvTextInput,
		KvButton,
		KvDatePicker,
	},
	props: {
		totalTransactions: {
			type: Number,
			default: 0
		},
		filters: {
			type: Object,
			default: () => ({})
		},
		keywordSearch: {
			type: String,
			default: ''
		}
	},
	emits: ['filters-changed'],
	data() {
		return {
			categoryOptions,
			sortOptions,
			searchText: this.keywordSearch || '',
			selectedCategory: this.filters.category || ALL_CATEGORIES_VALUE,
			selectedSort: this.filters.sortBy || DEFAULT_SORT,
			// Held as Date|null for KvDatePicker; converted to `yyyy-mm-dd` in buildActiveFilters.
			startDate: fromIsoDate(this.filters.startDate),
			endDate: fromIsoDate(this.filters.endDate),
		};
	},
	computed: {
		transactionCountLabel() {
			const count = this.totalTransactions || 0;
			return `${count.toLocaleString('en-US')} ${count === 1 ? 'transaction' : 'transactions'}`;
		},
		// The export respects the applied filters (see exportHref), so the count matches the
		// filtered total shown on the page — not every transaction on the account.
		exportLabel() {
			const count = this.totalTransactions || 0;
			return `Export ${count.toLocaleString('en-US')} ${count === 1 ? 'transaction' : 'transactions'}`;
		},
		// Mirror the legacy transactions export: a GET to /portfolio/transactions with
		// export_excel=true plus the currently applied filters (the same param names the
		// legacy view reads). The legacy backend streams the generated .xls download.
		exportHref() {
			const params = new URLSearchParams({ export_excel: 'true' });
			const applied = this.filters || {};
			if (applied.category) {
				params.set('category', applied.category);
			}
			if (applied.sortBy) {
				params.set('sortBy', applied.sortBy);
			}
			if (applied.startDate) {
				params.set('startDate', applied.startDate);
			}
			if (applied.endDate) {
				params.set('endDate', applied.endDate);
			}
			const keyword = this.appliedKeywordSearch();
			if (keyword) {
				params.set('queryString', keyword);
			}
			return `/portfolio/transactions?${params.toString()}`;
		},
		hasActiveFilters() {
			return (
				this.selectedCategory !== ALL_CATEGORIES_VALUE
				|| this.selectedSort !== DEFAULT_SORT
				|| Boolean(this.startDate)
				|| Boolean(this.endDate)
				// Gate on the APPLIED keyword search, not the draft input, so typing alone doesn't
				// surface "Clear filters" before the search is committed.
				|| this.appliedKeywordSearch() !== null
			);
		},
	},
	watch: {
		filters: {
			handler(filters) {
				this.selectedCategory = filters.category || ALL_CATEGORIES_VALUE;
				this.selectedSort = filters.sortBy || DEFAULT_SORT;
				this.startDate = fromIsoDate(filters.startDate);
				this.endDate = fromIsoDate(filters.endDate);
			},
			deep: true,
		},
		keywordSearch(keywordSearch) {
			this.searchText = keywordSearch || '';
		},
		// KvTextInput's clear ("X") button only resets the input value, so commit the cleared search
		// whenever the field empties out and there is an applied keyword search left to clear.
		searchText(newValue, previousValue) {
			if (newValue === '' && previousValue !== '' && this.appliedKeywordSearch() !== null) {
				this.emitFiltersChanged(this.draftKeywordSearch());
			}
		},
	},
	methods: {
		buildActiveFilters() {
			// sortBy is always sent (the resolver defaults to newest); the rest are omitted when unset
			// so an empty filter object round-trips as "no filter applied".
			const filters = { sortBy: this.selectedSort };

			if (this.selectedCategory !== ALL_CATEGORIES_VALUE) {
				filters.category = this.selectedCategory;
			}
			const startDate = toIsoDate(this.startDate);
			const endDate = toIsoDate(this.endDate);
			if (startDate) {
				filters.startDate = startDate;
			}
			if (endDate) {
				filters.endDate = endDate;
			}

			return filters;
		},
		normalizeKeywordSearch(keywordSearch) {
			if (typeof keywordSearch !== 'string') {
				return null;
			}
			return keywordSearch.trim() || null;
		},
		appliedKeywordSearch() {
			return this.normalizeKeywordSearch(this.keywordSearch);
		},
		draftKeywordSearch() {
			return this.normalizeKeywordSearch(this.searchText);
		},
		emitFiltersChanged(keywordSearch = this.appliedKeywordSearch()) {
			this.$emit('filters-changed', {
				filters: this.buildActiveFilters(),
				keywordSearch,
			});
		},
		handleCategoryChange() {
			this.$kvTrackEvent('portfolio', 'click', 'transactions-filter-category', this.selectedCategory);
			this.emitFiltersChanged();
		},
		handleSortChange() {
			this.$kvTrackEvent('portfolio', 'click', 'transactions-sort', this.selectedSort);
			this.emitFiltersChanged();
		},
		handleDateChange() {
			// The typed term is intentionally omitted from analytics — dates aren't sensitive, but we
			// keep filter events uniform (label only, no user-entered value).
			this.$kvTrackEvent('portfolio', 'click', 'transactions-filter-date-range');
			this.emitFiltersChanged();
		},
		emitDraftKeywordSearchIfChanged() {
			// Search is a draft until Enter/blur; only commit when the applied value actually changes.
			if (this.draftKeywordSearch() !== this.appliedKeywordSearch()) {
				// Track the event but not the term — it's a loan/transaction id (user data).
				this.$kvTrackEvent('portfolio', 'click', 'transactions-keyword-search');
				this.emitFiltersChanged(this.draftKeywordSearch());
			}
		},
		handleExportClick() {
			this.$kvTrackEvent('portfolio', 'click', 'transactions-export');
			// Navigate to the legacy export route so the browser streams the generated .xls/.zip
			// download; the URL carries the currently applied filters (see exportHref).
			window.location.href = this.exportHref;
		},
		clearAllFilters() {
			this.$kvTrackEvent('portfolio', 'click', 'transactions-clear-filters');
			this.selectedCategory = ALL_CATEGORIES_VALUE;
			this.selectedSort = DEFAULT_SORT;
			this.startDate = null;
			this.endDate = null;
			this.searchText = '';
			this.$emit('filters-changed', { filters: { sortBy: DEFAULT_SORT }, keywordSearch: null });
		},
	},
};
</script>

<style lang="postcss" scoped>
/* Each control fills the remaining space in its half-width cell so the two controls on a row
   (Category/Sort, then From/To) render at equal 50% widths from the md breakpoint up. Below md
   the cells stack full-width, so the controls simply fill the row. */
.transaction-filter-control {
	@apply tw-flex-1 tw-min-w-0;
}

.transaction-filter-control :deep(select),
.transaction-filter-control :deep(input) {
	@apply tw-w-full tw-min-w-0;
}

/* KvDatePicker nests VueDatePicker a few levels deep; stretch each wrapper so the picker input
   fills the half-width cell like the selects do. */
.transaction-filter-control :deep(.kv-datepicker),
.transaction-filter-control :deep(.kv-datepicker__content),
.transaction-filter-control :deep(.dp__main) {
	@apply tw-w-full tw-min-w-0;
}
</style>

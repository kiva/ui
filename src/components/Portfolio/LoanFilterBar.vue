<template>
	<div>
		<div class="tw-flex tw-flex-col">
			<kv-text-input
				id="loan-filter-text-input"
				v-model="searchText"
				:can-clear="true"
				placeholder="Search by name, ID, partner or location"
				@keyup.enter.prevent="emitDraftKeywordSearchIfChanged"
				@blur="emitDraftKeywordSearchIfChanged"
			/>
			<!-- On small screens the status/location/partner filters collapse behind a Filters/Hide filters toggle;
				they are always shown from the lg breakpoint up. -->
			<kv-button
				class="lg:tw-hidden tw-self-start tw-mt-2"
				variant="secondary"
				:aria-expanded="filtersExpanded ? 'true' : 'false'"
				aria-controls="loan-filters"
				data-testid="filters-toggle"
				v-kv-track-event="['portfolio', 'click', 'toggle-loan-filters']"
				@click="filtersExpanded = !filtersExpanded"
			>
				{{ filtersExpanded ? 'Hide filters' : 'Filters' }}
			</kv-button>
			<div
				id="loan-filters"
				:class="[
					filtersExpanded ? 'tw-flex' : 'tw-hidden',
					'lg:tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-center tw-gap-2 tw-mt-2'
				]"
			>
				<div class="tw-flex tw-items-center tw-gap-2">
					<span class="tw-text-secondary tw-whitespace-nowrap">Status:</span>
					<kv-select
						id="loan-status-select"
						v-model="selectedStatus"
						@update:model-value="emitFiltersChanged()"
					>
						<option
							v-for="status in statusOptions"
							:key="status.value"
							:value="status.value"
						>
							{{ status.label }}
						</option>
					</kv-select>
				</div>
				<div class="tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-center tw-gap-2">
					<span class="tw-text-secondary tw-whitespace-nowrap">Filter by:</span>
					<kv-select
						id="loan-country-select"
						class="loan-filter-select tw-min-w-0"
						v-model="selectedCountry"
						@update:model-value="emitFiltersChanged()"
					>
						<option value="all">
							All locations
						</option>
						<option
							v-for="country in countries"
							:key="country.isoCode"
							:value="country.isoCode"
						>
							{{ country.name }}
						</option>
					</kv-select>
					<kv-select
						id="loan-partner-select"
						class="loan-filter-select tw-min-w-0"
						v-model="selectedPartner"
						@update:model-value="emitFiltersChanged()"
					>
						<option value="all">
							All partners
						</option>
						<option
							v-for="partner in partners"
							:key="partner.id"
							:value="partner.id"
						>
							{{ partner.name }}
						</option>
					</kv-select>
				</div>
			</div>
			<div :class="[filtersExpanded ? 'tw-mt-2' : 'tw-mt-1.5', 'lg:tw-mt-2 tw-flex tw-items-center tw-gap-2']">
				<kv-button
					variant="primary"
					:state="totalLoans ? '' : 'disabled'"
					v-kv-track-event="['portfolio', 'click', 'export-loans']"
					@click="handleExportClick"
				>
					{{ exportLabel }}
				</kv-button>
				<span class="tw-ml-auto tw-text-subhead" data-testid="loans-count">{{ loanCountLabel }}</span>
			</div>
		</div>
		<div class="tw-flex tw-items-center tw-gap-2 tw-mt-1">
			<button
				v-if="hasActiveFilters"
				type="button"
				class="tw-text-action tw-text-small tw-underline"
				data-testid="clear-filters"
				v-kv-track-event="['portfolio', 'click', 'clear-filters']"
				@click="clearAllFilters"
			>
				Clear filters
			</button>
			<span class="tw-ml-auto tw-text-secondary tw-text-small">Sorted by date posted on Kiva</span>
		</div>
	</div>
</template>

<script setup>
import {
	ref, computed, inject, watch,
} from 'vue';
import { KvSelect, KvTextInput, KvButton } from '@kiva/kv-components';
import logReadQueryError from '#src/util/logReadQueryError';
import userIdQuery from '#src/graphql/query/userId.graphql';
import logFormatter from '#src/util/logFormatter';
import {
	DEFAULTED,
	ENDED,
	EXPIRED,
	FUNDRAISING,
	PAYING_BACK,
	RAISED,
	REFUNDED,
} from '#src/api/fixtures/LoanStatusEnum';

const ALL_FILTERS_VALUE = 'all';
const DELINQUENT = 'delinquent';
const ENDED_WITH_LOSS = 'ended_with_loss';
const LEGACY_FUNDRAISING_STATUS = 'fundRaising';

const statusOptions = [
	{ value: ALL_FILTERS_VALUE, label: 'All loans' },
	{ value: FUNDRAISING, label: 'Fundraising' },
	// Legacy parity: the `raised` status is labelled "Funded" everywhere on the legacy
	// page (getHumanizedStatusFromString) and in the new stats grid, so the filter
	// dropdown matches rather than showing "Raised".
	{ value: RAISED, label: 'Funded' },
	{ value: PAYING_BACK, label: 'Paying back' },
	{ value: DELINQUENT, label: 'Delinquent' },
	{ value: ENDED, label: 'Repaid' },
	{ value: ENDED_WITH_LOSS, label: 'Repaid with currency loss' },
	{ value: DEFAULTED, label: 'Defaulted' },
	{ value: REFUNDED, label: 'Refunded' },
	{ value: EXPIRED, label: 'Expired' },
];

const props = defineProps({
	totalLoans: {
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
	},
	countries: {
		type: Array,
		default: () => []
	},
	partners: {
		type: Array,
		default: () => []
	}
});

const emit = defineEmits(['filters-changed']);

const apollo = inject('apollo');

function getFirstFilterValue(values) {
	if (Array.isArray(values) && values.length) {
		return `${values[0]}`;
	}
	return ALL_FILTERS_VALUE;
}

function getSelectedStatus(filters = {}) {
	return filters.status || ALL_FILTERS_VALUE;
}

const searchText = ref(props.keywordSearch || '');
const selectedStatus = ref(getSelectedStatus(props.filters));
const selectedCountry = ref(getFirstFilterValue(props.filters.country));
const selectedPartner = ref(getFirstFilterValue(props.filters.partner));
// Small-screen filter accordion: collapsed by default; the lg breakpoint shows the filters regardless of this flag.
const filtersExpanded = ref(false);

function buildActiveFilters() {
	const filters = {};

	if (selectedStatus.value !== ALL_FILTERS_VALUE) {
		filters.status = selectedStatus.value;
	}

	if (selectedCountry.value !== ALL_FILTERS_VALUE) {
		filters.country = [selectedCountry.value];
	}

	if (selectedPartner.value !== ALL_FILTERS_VALUE) {
		filters.partner = [Number(selectedPartner.value)];
	}

	return filters;
}

function normalizeKeywordSearch(keywordSearch) {
	if (typeof keywordSearch !== 'string') {
		return null;
	}

	const trimmedKeywordSearch = keywordSearch.trim();
	return trimmedKeywordSearch || null;
}

function appliedKeywordSearch() {
	return normalizeKeywordSearch(props.keywordSearch);
}

function draftKeywordSearch() {
	return normalizeKeywordSearch(searchText.value);
}

function emitFiltersChanged(keywordSearch = appliedKeywordSearch()) {
	emit('filters-changed', {
		filters: buildActiveFilters(),
		keywordSearch,
	});
}

function emitDraftKeywordSearch() {
	emitFiltersChanged(draftKeywordSearch());
}

function emitDraftKeywordSearchIfChanged() {
	if (draftKeywordSearch() !== appliedKeywordSearch()) {
		emitDraftKeywordSearch();
	}
}

function getLegacyExportStatus(status) {
	return status === FUNDRAISING ? LEGACY_FUNDRAISING_STATUS : status;
}

const loanCountLabel = computed(() => {
	const count = props.totalLoans || 0;
	return `${count.toLocaleString('en-US')} ${count === 1 ? 'loan' : 'loans'}`;
});

const exportLabel = computed(() => {
	const count = props.totalLoans || 0;
	return `Export ${count.toLocaleString('en-US')} ${count === 1 ? 'loan' : 'loans'}`;
});

const hasActiveFilters = computed(() => (
	selectedStatus.value !== ALL_FILTERS_VALUE
	|| selectedCountry.value !== ALL_FILTERS_VALUE
	|| selectedPartner.value !== ALL_FILTERS_VALUE
	// Gate on the APPLIED keyword search, not the draft input — the status/location/partner
	// selects apply on change, but search is a draft until Enter/blur, so typing alone must
	// not surface "Clear filters" before the search is actually applied.
	|| appliedKeywordSearch() !== null
));

function clearAllFilters() {
	if (!hasActiveFilters.value) {
		return;
	}
	selectedStatus.value = ALL_FILTERS_VALUE;
	selectedCountry.value = ALL_FILTERS_VALUE;
	selectedPartner.value = ALL_FILTERS_VALUE;
	searchText.value = '';
	emit('filters-changed', { filters: {}, keywordSearch: null });
}

watch(() => props.filters, filters => {
	selectedStatus.value = getSelectedStatus(filters);
	selectedCountry.value = getFirstFilterValue(filters.country);
	selectedPartner.value = getFirstFilterValue(filters.partner);
}, { deep: true });

watch(() => props.keywordSearch, keywordSearch => {
	searchText.value = keywordSearch || '';
});

// KvTextInput's clear ("X") button only resets the input value, so commit the cleared search
// whenever the field empties out and there is an applied keyword search left to clear.
watch(searchText, (newValue, previousValue) => {
	if (newValue === '' && previousValue !== '' && appliedKeywordSearch() !== null) {
		emitDraftKeywordSearch();
	}
});

function addIfPresent(queryParams, key, value) {
	if (value !== null && value !== undefined && value !== '') {
		queryParams.set(key, value.toString());
	}
}

const handleExportClick = async () => {
	try {
		const { data } = await apollo.query({
			query: userIdQuery
		});

		const userId = data?.my?.userAccount?.id;
		if (!userId) {
			logFormatter('No user ID available for export');
			return;
		}

		const filters = buildActiveFilters();
		const queryParams = new URLSearchParams({
			iDisplayStart: '0',
			iDisplayLength: props.totalLoans.toString(),
			user_id: userId.toString()
		});

		addIfPresent(queryParams, 'sSearch', appliedKeywordSearch());
		addIfPresent(queryParams, 'sStatus', getLegacyExportStatus(filters.status));
		addIfPresent(queryParams, 'sCountries', filters.country?.join(','));
		addIfPresent(queryParams, 'sPartners', filters.partner?.join(','));

		window.location.href = `/portfolio/loans/export?${queryParams.toString()}`;
	} catch (error) {
		logReadQueryError(error, 'LoanFilterBar userIdQuery');
	}
};
</script>

<style lang="postcss" scoped>
/* From the lg breakpoint up the filters lay out in a row; give the location and partner
   selects an equal flex-basis there so they render at the same width (below lg they stack
   full-width, so no basis is applied — it would otherwise size their height in the column). */
@media (width >= 1024px) {
	.loan-filter-select {
		flex-basis: 12rem;
	}
}

/* Make each inner native select fill its (equal-basis) container so both dropdowns match
   width; without this the longer partner names stretch the partner select wider. */
.loan-filter-select :deep(select) {
	@apply tw-w-full tw-min-w-0;
}
</style>

<template>
	<div>
		<fieldset class="tw-flex tw-flex-col tw-gap-2 tw-mb-2">
			<legend class="tw-sr-only">
				Sort order radio group
			</legend>
			<kv-radio
				v-for="(option, index) in validSortOptions"
				:key="index"
				:value="option.name"
				:checked="option.name === validatedSortBy"
				@change="setSortBy"
			>
				{{ option.label }}
			</kv-radio>
			<span v-if="showInfo" class="tw-text-small tw-text-secondary tw-flex tw-gap-1">
				<kv-material-icon class="tw-min-w-2 tw-h-2" :icon="mdiInformation" /> {{ infoCopy }}
			</span>
		</fieldset>
	</div>
</template>

<script>
import { mdiInformation } from '@mdi/js';
import { FLSS_QUERY_TYPE, STANDARD_QUERY_TYPE } from '@/util/loanSearch/filterUtils';
import { sortByNameToDisplay } from '@/util/loanSearch/filters/sortOptions';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvRadio from '~/@kiva/kv-components/vue/KvRadio';

export default {
	name: 'LoanSearchSortBy',
	components: {
		KvMaterialIcon,
		KvRadio,
	},
	props: {
		/**
		 * allSortOptions contains all sort emuns tagged with their type
		 * lend > loans > sortBy:LoanSearchSortByEnum
		 * fundraisingLoans > sortBy:SortEnum
		 *   {
		 *     name: 'expiringSoon',
		 *     sortSrc: 'flss' or 'standard',
		 *   }
		 */
		allSortOptions: {
			type: Array,
			default: undefined
		},
		extendFlssFilters: {
			type: Boolean,
			default: false,
		},
		isLoggedIn: {
			type: Boolean,
			default: false
		},
		sort: {
			type: String,
			default: null
		},
		queryType: {
			type: String,
			default: FLSS_QUERY_TYPE
		}
	},
	data() {
		const defaultSort = this.queryType === FLSS_QUERY_TYPE ? 'personalized' : 'popularity';

		return {
			mdiInformation,
			defaultSort,
			selectedSort: this.sort || defaultSort,
			showInfo: true,
		};
	},
	computed: {
		infoCopy() {
			if (this.isLoggedIn) {
				return 'Loans we think you\'ll love based on your lending history.';
			}
			return 'Loans recommended by others. Log in for personalized recommendations.';
		},
		/**
		 * Produces an array of sort options with mapped label for display
		 * {
		 *   name: 'expiringSoon',
		 *   sortSrc: 'flss' or 'standard',
		 *   label: 'Ending Soon'
		 * }
		 */
		validSortOptions() {
			return this.allSortOptions?.filter(sortOption => {
				if (this.queryType === FLSS_QUERY_TYPE) {
					return sortOption.sortSrc === FLSS_QUERY_TYPE;
				}
				return sortOption.sortSrc === STANDARD_QUERY_TYPE;
			}).map(option => {
				return {
					...option,
					label: sortByNameToDisplay[option.name]
				};
			}) ?? [];
		},
		validatedSortBy() {
			// Handle async loading of search facets
			if (!this.allSortOptions) return this.selectedSort;

			return this.validSortOptions.map(s => s.name).includes(this.selectedSort)
				? this.selectedSort
				: this.defaultSort;
		},
	},
	methods: {
		setSortBy(sortBy) {
			if (sortBy !== this.selectedSort) {
				this.selectedSort = sortBy;

				this.$emit('updated', { sortBy: this.selectedSort });

				this.$kvTrackEvent?.('Lending', 'click-sortBy-filter', this.selectedSort);
			}
		}
	},
	watch: {
		sort(next) {
			if (next !== this.selectedSort) {
				// Don't emit when value is changed via the component prop
				this.selectedSort = next;
			}
		},
	}
};
</script>

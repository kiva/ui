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
				v-model="selectedSort"
			>
				{{ option.label }}
			</kv-radio>
			<span v-if="showInfo" class="tw-text-small tw-text-secondary tw-flex tw-gap-1">
				<kv-material-icon class="tw-w-2 tw-h-2" :icon="mdiInformation" /> Learn about sort orders
			</span>
		</fieldset>
	</div>
</template>

<script>
import { mdiInformation } from '@mdi/js';
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
			default: () => []
		},
		initialSort: {
			type: String,
			default: null
		},
		queryType: {
			type: String,
			default: 'flss'
		}
	},
	data() {
		return {
			mdiInformation,
			nameToDisplayMap: {
				// shared
				expiringSoon: 'Ending soon',
				// standard
				amountLeft: 'Amount left',
				loanAmount: 'Amount: Low to High',
				loanAmountDesc: 'Amount: High to Low',
				newest: 'Most recent',
				popularity: 'Trending now',
				random: 'Random',
				repaymentTerm: 'Loan length',
				// flss specific
				amountHighToLow: 'Amount: High to Low',
				amountLowToHigh: 'Amount: Low to High',
				personalized: 'Recommended'
			},
			selectedSort: this.initialSort || (this.queryType === 'flss' ? 'personalized' : 'popularity'),
			// TODO: Setup Lightbox, Finalize copy + use Contentful for content
			showInfo: true,
		};
	},
	computed: {
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
				if (this.queryType === 'flss') {
					return sortOption.sortSrc === 'flss';
				}
				return sortOption.sortSrc === 'standard';
			}).map(option => {
				return {
					...option,
					label: this.nameToDisplayMap?.[option.name]
				};
			});
		}
	},
	watch: {
		selectedSort(next, prev) {
			if (next !== prev) {
				this.$emit('updated', { sortBy: this.selectedSort });
			}
		}
	}
};
</script>

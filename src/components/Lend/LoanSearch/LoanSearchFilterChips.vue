<template>
	<div class="tw-flex tw-flex-wrap tw-gap-1.5 tw-my-.5 tw-mb-1">
		<div v-for="(item, i) in items" :key="i" class="tw-inline-block">
			<kv-chip-classic :value="item.value">
				{{ item.name }}
			</kv-chip-classic>
		</div>
	</div>
</template>

<script>
import KvChipClassic from '@/components/Kv/KvChipClassic';

export default {
	name: 'LoanSearchFilterChips',
	components: {
		KvChipClassic,
	},
	props: {
		/**
		 * Facet options based on the loans available. Format:
		 * {
		 *   regions: [
		 *     {
		 *       region: '',
		 *       numLoansFundraising: 1,
		 *       countries: [
		 *         {
		 *           name: '',
		 *           region: '',
		 *           isoCode: '',
		 *           numLoansFundraising: 1,
		 *         }
		 *       ]
		 *     }
		 *   ],
		 *   sectors: [
		 *     {
		 *       id: 1,
		 *       name: '',
		 *     }
		 *   ],
		 *   themes: [
		 *     {
		 *       id: 1,
		 *       name: '',
		 *       numLoansFundraising: 1,
		 *     }
		 *   ],
		 * }
		 */
		loanSearchState: {
			type: Object,
			default: () => {}
		},
		/**
         * All available facet options from lend API. Format:
         * {
         *   countryFacets: [
         *     {
         *       name: '',
         *       isoCode: '',
         *       region: '',
         *     }
         *   ],
         *   sectorFacets: [
         *     {
         *       id: 1,
         *       name: '',
         *     }
         *   ],
         *   themeFacets: [
         *     {
         *       id: 1,
         *       name: '',
         *     }
         *   ],
         * }
         */
		allFacets: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			items: []
		};
	},
	methods: {
		getLabelsFromState() {
		}
	},
	mounted() {
		// this.items = [...this.loanSearchState.gender];
		console.log(this.loanSearchState);
		console.log(this.allFacets);
	},
	watch: {
		loanSearchState(newVal) {
			console.log(newVal.gender);
			if (newVal) {
				this.items.gender = newVal;
			}
		},
		items(val) {
			console.log(val);
		}
	}
};
</script>

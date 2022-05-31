<template>
	<form class="tw-flex tw-flex-col tw-gap-1.5 tw-mb-2" @submit.prevent>
		<fieldset>
			<kv-checkbox-list :items="items" @updated="updateSectors" />
		</fieldset>
	</form>
</template>

<script>
import KvCheckboxList from '@/components/Kv/KvCheckboxList';
import { getUpdatedSectors } from '@/util/loanSearchUtils';

export default {
	name: 'LoanSearchSectorFilter',
	components: {
		KvCheckboxList,
	},
	props: {
		/**
		 * The sectors list to display has checkboxes. Expected format:
		 *   sectors: [
		 *     {
		 *       id: 1,
		 *       name: '',
		 *     }
		 *   ],
		 */
		sectors: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			displayedSectors: this.sectors,
			// results: []
		};
	},
	computed: {
		items() {
			return this.displayedSectors.map(c => ({
				value: c.id.toString(),
				title: c.name,
			}));
		}
	},
	methods: {
		updateSectors(sectors) {
			// eslint-disable-next-line radix
			// this.results = sectors.map(sector => parseInt(sector));
			this.$emit('updated', { sectorId: sectors });
		}
	},
	watch: {
		sectors(nextSectors) {
			this.displayedSectors = getUpdatedSectors(this.displayedSectors, nextSectors);
		},
	},
};
</script>

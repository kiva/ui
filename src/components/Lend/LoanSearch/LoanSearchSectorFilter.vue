<template>
	<form class="tw-flex tw-flex-col tw-gap-1.5 tw-mb-2" @submit.prevent>
		<fieldset>
			<kv-checkbox-list :items="items" :selected-values="selectedValues" @updated="updateSectors" />
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
		},
		sectorIds: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			displayedSectors: this.sectors,
			selectedSectorIds: this.sectorIds,
		};
	},
	computed: {
		items() {
			return this.displayedSectors.map(s => ({ value: s.id.toString(), title: s.name }));
		},
		selectedValues() {
			return this.selectedSectorIds.map(s => s.toString());
		}
	},
	methods: {
		updateSectors(sectors) {
			this.$emit('updated', { sectorId: sectors.map(s => +s) });
		}
	},
	watch: {
		sectors(nextSectors) {
			this.displayedSectors = getUpdatedSectors(this.displayedSectors, nextSectors);
		},
		sectorIds(next) {
			if ([...next].sort().toString() !== [...this.selectedSectorIds].sort().toString()) {
				// Don't emit when value is changed via the component prop
				this.selectedSectorIds = next;
			}
		},
	},
};
</script>

<template>
	<form class="tw-flex tw-flex-col tw-gap-1.5 tw-mb-2" @submit.prevent>
		<fieldset>
			<kv-checkbox-list :items="items" :selected-values="selectedValues" @updated="updateSectors" />
		</fieldset>
	</form>
</template>

<script>
import KvCheckboxList from '@/components/Kv/KvCheckboxList';
import { getUpdatedNumLoansFundraising, getCheckboxLabel } from '@/util/loanSearchUtils';

export default {
	name: 'LoanSearchSectorFilter',
	components: {
		KvCheckboxList,
	},
	props: {
		/**
		 * The sectors list to display has checkboxes. Expected format:
		 * [{
		 *   id: 1,
		 *   name: '',
		 *   numLoansFundraising: 1,
		 * }],
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
			return this.displayedSectors.map(s => ({
				value: s.id.toString(),
				title: getCheckboxLabel(s),
				disabled: s.numLoansFundraising === 0
			}));
		},
		selectedValues() {
			return this.selectedSectorIds.map(s => s.toString());
		}
	},
	methods: {
		updateSectors({ values, changed }) {
			this.$emit('updated', { sectorId: values.map(s => +s) });

			const sector = this.displayedSectors.find(s => s.id === +changed);

			if (sector) {
				this.$kvTrackEvent?.(
					'Lending',
					'click-sector-filter',
					sector.name,
					values.includes(sector.id) ? 'selected' : 'deselected'
				);
			}
		}
	},
	watch: {
		sectors(nextSectors) {
			this.displayedSectors = getUpdatedNumLoansFundraising(this.displayedSectors, nextSectors);
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

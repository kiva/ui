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
			filterResults: []
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
			this.filterResults = sectors.map(sector => parseInt(sector, 10));
			this.$emit('updated', { sectorId: this.filterResults });
		}
	},
	watch: {
		sectors(nextSectors) {
			this.displayedSectors = getUpdatedSectors(this.displayedSectors, nextSectors);
		},
	},
};
</script>

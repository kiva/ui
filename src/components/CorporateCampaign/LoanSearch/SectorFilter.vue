<template>
	<div>
		<div class="row collapse">
			<div class="small-12 columns">
				<check-list
					key="sectors"
					:items="sectorsWithSelected"
					:use-columns="true"
					@change="onChange"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import anyOrSelectedAutolendingFilter from '@/plugins/any-or-selected-autolending-filter-mixin';
import CheckList from '@/pages/Autolending/CheckList';

export default {
	name: 'SectorFilter',
	components: {
		CheckList,
	},
	mixins: [
		anyOrSelectedAutolendingFilter
	],
	props: {
		allSectors: {
			type: Array,
			default: () => []
		},
		initialSectors: {
			type: Array,
			default: () => []
		},
		selectedSectors: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			currentSectorIds: [],
		};
	},
	created() {
		this.setFilterState();
	},
	computed: {
		sectorsWithSelected() {
			return this.eligibleSectors.map(({ id, name }) => {
				return {
					id,
					name,
					selected: this.currentSectorIds.indexOf(id) > -1,
				};
			});
		},
		eligibleSectors() {
			// filters all sectors against prescribed lsc sectors
			const eligibleSectors = this.allSectors.filter(sector => {
				if (this.initialSectors.length) {
					return this.initialSectors.includes(sector.id) || false;
				}
				return true;
			});
			return eligibleSectors || [];
		},
	},
	watch: {
		initialSectors(next, prev) {
			if (!this.selectedSectors && next !== prev) {
				this.setFilterState();
			}
		},
		selectedSectors(next, prev) {
			if (next !== prev) {
				this.setFilterState();
			}
		}
	},
	methods: {
		onChange(checked, values) {
			// Filter mixin function that calls mutation function
			this.changeSectors(this.getValues(checked, values, this.currentSectorIds));
		},
		changeSectors(sectors) {
			this.currentSectorIds = sectors;
			this.$emit('updated-filters', {
				sector: sectors.length ? sectors : null
			});
		},
		setFilterState() {
			// set currently selected if present
			if (this.selectedSectors) {
				this.currentSectorIds = this.selectedSectors;
				return true;
			}
			// fallback to initial settings if present
			if (this.initialSectors) {
				this.currentSectorIds = this.initialSectors;
				return true;
			}
		}
	},
};
</script>

<style lang="scss" scoped>
// @import 'settings';

</style>

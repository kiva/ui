<template>
	<div>
		<h3 class="filter-title">
			Sectors
		</h3>
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
// import _map from 'lodash/map';
import _sortBy from 'lodash/sortBy';
import gql from 'graphql-tag';
import anyOrSelectedAutolendingFilter from '@/plugins/any-or-selected-autolending-filter-mixin';
import CheckList from '@/pages/Autolending/CheckList';

const sectorListQuery = gql`
	query sectorList {
		lend {
			sector {
				id
				name
			}
		}
	}
`;

export default {
	inject: ['apollo'],
	components: {
		CheckList,
	},
	mixins: [
		anyOrSelectedAutolendingFilter
	],
	props: {
		initialSectors: {
			type: Array,
			default: () => []
		},
	},
	data() {
		return {
			allSectors: [],
			currentSectorIds: [],
		};
	},
	apollo: {
		query: sectorListQuery,
		preFetch: true,
		result({ data }) {
			this.allSectors = _sortBy(data.lend?.sector || [], 'name');
		},
	},
	created() {
		this.currentSectorIds = this.initialSectors;
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
			const eligibleSectors = this.allSectors.filter(sector => {
				return this.initialSectors.includes(sector.id) || false;
			});
			return eligibleSectors || [];
		},
	},
	watch: {
		initialSectors(next, prev) {
			if (next !== prev) {
				this.currentSectorIds = this.initialSectors;
			}
		}
	},
	methods: {
		onChange(checked, values) {
			console.log('onChange: ', checked, values);
			// Filter mixin function that calls mutation function
			this.changeSectors(this.getValues(checked, values, this.currentSectorIds));
		},
		changeSectors(sectors) {
			console.log('change sectors: ', sectors);
			this.currentSectorIds = sectors;
			this.$emit('updated-filters', { sector: sectors });
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

// .specific-filter-title {
// 	font-size: 1rem;
// 	margin: 0 auto 0.5rem;
// 	font-weight: $global-weight-highlight;
// }
</style>

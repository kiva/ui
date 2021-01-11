<template>
	<div class="loan-search-filters">
		<div class="filter-list">
			<h3>Filters:</h3>
			<ul>
				<li @click="showFilters">
					Gender
				</li>
				<!-- <li @click="showFilters">
					Location
				</li> -->
				<li @click="showFilters">
					Sector
				</li>
			</ul>
		</div>

		<kv-lightbox
			class="filter-controls-lightbox"
			id="filterControlsLightbox"
			:visible="filtersVisible"
			@lightbox-closed="filtersVisible = false"
		>
			<gender-filter
				:initial-gender="initialGender"
				@updated-filters="handleUpdatedFilters"
			/>

			<sector-filter
				:initial-sectors="initialSectors"
				@updated-filters="handleUpdatedFilters"
			/>

			<kv-button
				class="button smallest"
				@click.native.prevent="applyFilters"
			>
				Apply Filters
			</kv-button>
		</kv-lightbox>
	</div>
</template>

<script>
// import gql from 'graphql-tag';
import KvButton from '@/components/Kv/KvButton';
import KvLightbox from '@/components/Kv/KvLightbox';
import GenderFilter from '@/components/CorporateCampaign/LoanSearch/GenderFilter';
import SectorFilter from '@/components/CorporateCampaign/LoanSearch/SectorFilter';

export default {
	components: {
		KvButton,
		KvLightbox,
		SectorFilter,
		GenderFilter,
	},
	props: {
		initialFilters: {
			type: Object,
			default: () => {}
		},
	},
	data() {
		return {
			filtersVisible: false,
			// gender: 'both',
			updatedFilters: null,
			modifiedFilters: null,
		};
	},
	methods: {
		showFilters() {
			this.filtersVisible = true;
		},
		// updateFilter(filter, value) {
		// 	if (this.updatedFilters[filter] !== value) {
		// 		this.updatedFilters[filter] = value;
		// 		this.$emit(
		// 			'new-filters-selected',
		// 			{
		// 				filter,
		// 				filters: this.updatedFilters
		// 			}
		// 		);
		// 	}
		// },
		handleUpdatedFilters(payload) {
			console.log('handleUpdatedFilters: ', payload);
			const filterKeys = Object.keys(payload);
			console.log('filterKeys: ', filterKeys);
			filterKeys.forEach(key => {
				this.modifiedFilters[key] = payload[key];
			});
		},
		applyFilters() {
			console.log(this.modifiedFilters);
			this.$emit('updated-filters', this.modifiedFilters);
			this.filtersVisible = false;
		},
		copyFilters(initialFilters) {
			const filtersCopy = {};

			const initialFilterKeys = Object.keys(initialFilters);
			initialFilterKeys.forEach(key => {
				// copy an object
				if (
					typeof initialFilters[key] === 'object'
					&& initialFilters[key]
					&& initialFilters[key] === 'undefined'
				) {
					filtersCopy[key] = { ...initialFilters[key] };

				// copy an array
				} else if (
					typeof initialFilters[key] === 'object'
					&& initialFilters[key]
					&& initialFilters[key].length
				) {
					filtersCopy[key] = initialFilters[key].slice();

				// copy a string
				} else if (typeof initialFilters[key] === 'string') {
					filtersCopy[key] = initialFilters[key].toString();

				// copy a boolean
				} else if (typeof initialFilters[key] === 'boolean') {
					filtersCopy[key] = Boolean(initialFilters[key]);

				// handle undefined defaults
				} else if (typeof initialFilters[key] === 'undefined') {
					filtersCopy[key] = undefined;

				// handle null defaults and all others
				} else {
					filtersCopy[key] = null;
				}
			});

			return filtersCopy;
		},
	},
	computed: {
		initialGender() {
			console.log('initial sector:', this.initialFilters.gender);
			return this.initialSectors.gender || 'both';
		},
		initialSectors() {
			console.log('initial sector:', this.initialFilters.sector);
			return this.initialFilters.sector || [];
		}
	},
	watch: {
		updatedFilters: {
			handler(next, prev) {
				console.log('updatedFilters watch: ', next, prev);
				console.log('updated filters comparison: ', JSON.stringify(next) !== JSON.stringify(prev));
				// if (JSON.stringify(next) !== JSON.stringify(prev)) {
				// 	this.$emit('new-filters-selected', next);
				// }
			},
			immediate: true,
			deep: true,
		},
		initialFilters: {
			handler(next, prev) {
				console.log('initialFilters watch: ', next, prev);
				this.modifiedFilters = this.copyFilters(this.initialFilters);
				this.updatedFilters = this.initialFilters;
				// if (JSON.stringify(next) !== JSON.stringify(prev)) {
				// 	this.$emit('new-filters-selected', next);
				// }
			},
			immediate: true,
			deep: true,
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.filter-list {
	display: flex;

	h3 {
		padding: 0.5rem;
	}

	ul {
		display: flex;

		li {
			padding: 0.5rem;
		}
	}
}
</style>

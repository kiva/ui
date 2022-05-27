<template>
	<div class="location-refinements-controller">
		<div
			v-for="item in items"
			:key="item.label"
		>
			<div
				v-if="item.isRegion"
				class="region"
				:id="item.region|changeCase('paramCase')"
				:class="{open: isRegionOpen(item.region)}"
			>
				<button
					class="region-title-row"
					@click="toggleRegionOpenState(item.region)"
				>
					<kv-icon
						name="large-chevron"
						class="hierarchical-menu-item-chevron"
						:from-sprite="true"
					/>
					<div
						class="region-label"
						:id="item.label|changeCase('paramCase')"
					>
						{{ item.label }} ({{ item.count }})
					</div>
				</button>
				<div
					v-if="isRegionOpen(item.region)"
					class="select-all-toggle-container"
				>
					<button
						v-if="!item.allCountriesSelected"
						class="tw-text-link"
						@click="selectAllCountries(item.countries, item.region)"
						:id="'select-all-'+item.region|changeCase('paramCase')"
					>
						Select all
					</button>
					<button
						v-else
						class="tw-text-link"
						@click="deselectAllCountries(item.countries, item.region)"
						:id="'deselect-all-'+item.region|changeCase('paramCase')"
					>
						Deselect all
					</button>
				</div>
			</div>
			<kv-checkbox
				v-else-if="isRegionOpen(item.region)"
				class="country"
				:id="item.label|changeCase('paramCase')"
				:disabled="item.count === 0"
				:checked="isCountryChecked(item.isRefined, item.region)"
				@change="handleCountryCheckboxInput(item)"
			>
				{{ item.label }} ({{ item.count }})
			</kv-checkbox>
		</div>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';
import KvCheckbox from '@/components/Kv/KvCheckbox';

export default {
	name: 'LocationMultiRefinements',
	components: {
		KvCheckbox,
		KvIcon,
	},
	data() {
		return {
			regionMap: {
				Africa: {
					open: false,
					temporaryRefinement: null,
				},
				Asia: {
					open: false,
					temporaryRefinement: null,
				},
				'Central America': {
					open: false,
					temporaryRefinement: null,
				},
				'Eastern Europe': {
					open: false,
					temporaryRefinement: null,
				},
				'Middle East': {
					open: false,
					temporaryRefinement: null,
				},
				'North America': {
					open: false,
					temporaryRefinement: null,
				},
				Oceania: {
					open: false,
					temporaryRefinement: null,
				},
				'South America': {
					open: false,
					temporaryRefinement: null,
				},
			},
		};
	},
	props: {
		items: {
			type: Array,
			default: () => [],
		},
		refine: {
			type: Function,
			default: () => {},
		},
	},
	methods: {
		handleCountryCheckboxInput(item) {
			this.refine(item.value);
		},
		refineAllCountries(countries, refineTo) {
			countries.forEach(({ isRefined, value }) => {
				if (isRefined !== refineTo) {
					this.refine(value);
				}
			});
		},
		selectAllCountries(countries, region) {
			if (this.regionMap[region].temporaryRefinement !== null) {
				return;
			}
			this.$kvTrackEvent(
				'Lending',
				'filter-location-select-all',
				region,
			);
			this.regionMap[region].temporaryRefinement = true;
			this.resetTemporaryRefinement(region);
			this.refineAllCountries(countries, true);
		},
		deselectAllCountries(countries, region) {
			if (this.regionMap[region].temporaryRefinement !== null) {
				return;
			}
			this.$kvTrackEvent(
				'Lending',
				'filter-location-deselect-all',
				region,
			);
			this.regionMap[region].temporaryRefinement = false;
			this.resetTemporaryRefinement(region);
			this.refineAllCountries(countries, false);
		},
		resetTemporaryRefinement(region) {
			setTimeout(() => { this.regionMap[region].temporaryRefinement = null; }, 500);
		},
		isCountryChecked(refinedByAlgolia, region) {
			if (this.regionMap[region].temporaryRefinement === null) {
				return refinedByAlgolia;
			}
			return this.regionMap[region].temporaryRefinement;
		},
		toggleRegionOpenState(region) {
			this.regionMap[region].open = !this.regionMap[region].open;
		},
		isRegionOpen(region) {
			return this.regionMap[region].open;
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.location-refinements-controller {
	$filter-transition-timing: 0.15s ease-in;

	.region-children {
		margin-left: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.region {
		.region-title-row {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			margin-bottom: 0;
			padding-bottom: 0.5rem;
			transition: margin-bottom $filter-transition-timing;

			.hierarchical-menu-item-chevron {
				height: rem-calc(6);
				width: rem-calc(10);
				margin-right: 0.5rem;
				transform: rotate(-90deg);
				transition: transform $filter-transition-timing;
			}
		}

		.region-label {
			margin-top: 0.125rem;
		}

		.select-all-toggle-container {
			@extend .region-children;

			margin-bottom: rem-calc(6);
		}

		&.open {
			.region-title-row {
				padding-bottom: 0;
				margin-bottom: 0.5rem;

				.hierarchical-menu-item-chevron {
					transform: initial;
				}
			}
		}
	}

	.country {
		@extend .region-children;
	}
}
</style>

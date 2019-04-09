<template>
	<div id="lend-filter-menu" class="small-12 columns" :class="{open: filterMenuOpen}">
		<div id="lend-filter-overlay" @click="hideFilterMenu"></div>
		<div id="lend-filter-wrapper">
			<div id="filter-toggle" @click="toggleFilterMenu">
				<div>Filters</div>
				<kv-icon class="filter-toggle-chevron" name="large-chevron" />
			</div>
			<div id="filter-menu">
				<filter-section-gender :filter-menu-open="filterMenuOpen" />
				<filter-section-sort :default-sort-indices="defaultSortIndices"/>
				<filter-section-categories
					:custom-categories="customCategories"
					:selected-custom-categories="selectedCustomCategories"
					@toggle-custom-category="toggleCustomCategory"
				/>
				<filter-section-location />
				<filter-section-range-slider :filter-menu-open="filterMenuOpen" />

				<div id="filter-section-advanced" class="filter-section" @click="showAdvancedFilters">
					Advanced Filters
				</div>
				<div id="filter-section-close" class="filter-section" @click="hideFilterMenu">
					Close
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import FilterSectionCategories from '@/pages/Lend/Filter/FilterSectionCategories';
import FilterSectionGender from '@/pages/Lend/Filter/FilterSectionGender';
import FilterSectionLocation from '@/pages/Lend/Filter/FilterSectionLocation';
import FilterSectionRangeSlider from '@/pages/Lend/Filter/FilterSectionRangeSlider';
import FilterSectionSort from '@/pages/Lend/Filter/FilterSectionSort';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		FilterSectionCategories,
		FilterSectionGender,
		FilterSectionLocation,
		FilterSectionRangeSlider,
		FilterSectionSort,
		KvIcon,
	},
	props: {
		filterMenuOpen: {
			type: Boolean,
			required: true,
		},
		customCategories: {
			type: Object,
			required: true,
		},
		defaultSortIndices: {
			type: Array,
			required: true,
		},
		selectedCustomCategories: {
			type: Object,
			required: true,
		},
	},
	methods: {
		hideFilterMenu() {
			this.$emit('hide-filter-menu');
		},
		toggleFilterMenu() {
			this.$emit('toggle-filter-menu');
		},
		showAdvancedFilters() {
			window.location.href = '/lend';
		},
		toggleCustomCategory(categoryId) {
			this.$emit('toggle-custom-category', categoryId);
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

#lend-filter-menu {
	$filter-transition: 0.25s ease-out;
	$filter-border-radius: rem-calc(3);

	#lend-filter-overlay {
		position: fixed;
		height: 100vh;
		width: 100vw;
		top: 0;
		left: 0;
		z-index: 1001;
		pointer-events: none;
		transition: background-color $filter-transition;
	}

	#lend-filter-wrapper {
		position: relative;
		height: 2rem;

		#filter-toggle {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1001;
			padding: 0.25rem 0.25rem 0.25rem 0.75rem;
			user-select: none;
			height: 2rem;
			cursor: pointer;
			display: inline-flex;
			justify-content: flex-start;
			align-items: center;
			background-color: $white;
			border-radius: $filter-border-radius;
			border: 1px solid $blue;
			color: $blue;
			transition: background-color $filter-transition;

			.filter-toggle-chevron {
				height: rem-calc(5);
				width: 2rem;
				stroke: $blue;
			}
		}

		#filter-menu {
			position: absolute;
			top: 2.5rem;
			left: 0;
			opacity: 0;
			z-index: 1001;
			overflow: hidden;
			user-select: none;
			pointer-events: none;
			min-width: rem-calc(270);
			background-color: rgba(255, 255, 255, 1);
			box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.4);
			border-radius: $filter-border-radius;
			transition: opacity $filter-transition;

			.filter-section {
				margin: 0 1rem;
				padding: 0.5rem 0;
				border-top: 1px solid #E5E5E5;

				&#filter-section-advanced {
					cursor: pointer;
					color: #B5B5B5;
				}

				&#filter-section-close {
					margin: 0;
					cursor: pointer;
					text-align: center;
					color: $blue;
				}
			}
		}
	}

	&.open {
		#lend-filter-overlay {
			pointer-events: initial;
		}

		#lend-filter-wrapper {
			#filter-menu {
				opacity: 1;
				pointer-events: initial;
			}
		}
	}
}
</style>

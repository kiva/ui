<template>
	<div id="lend-filter-menu" class="small-12 columns" :class="{open: filterMenuOpen}">
		<div id="lend-filter-overlay" @click="hideFilterMenu"></div>
		<div id="lend-filter-wrapper">
			<div id="filter-toggle" @click="toggleFilterMenu">
				<div>Filters</div>
				<kv-icon class="filter-toggle-chevron" name="large-chevron" />
			</div>
			<div id="filter-menu">
				<div id="filter-section-mobile-reset-all" class="filter-section hide-for-medium">
					<ais-clear-refinements class="clear-all-container">
						<div
							class="filter-mobile-reset-all-link"
							slot-scope="{ canRefine, refine }"
							@click="clearAllRefinementsAndClose(refine)"
						>
							Reset all
						</div>
					</ais-clear-refinements>
					<div class="filter-mobile-close-icon-wrapper" @click="hideFilterMenu">
						<kv-icon class="filter-mobile-close-icon" name="x"/>
					</div>
				</div>
				<filter-section-gender :filter-menu-open="filterMenuOpen" class="filter-section" />
				<filter-section-sort :default-sort-indices="defaultSortIndices" class="filter-section" />
				<filter-section-categories
					class="filter-section"
					:custom-categories="customCategories"
					:selected-custom-categories="selectedCustomCategories"
					@toggle-custom-category="toggleCustomCategory"
				/>
				<filter-section-location class="filter-section" />
				<filter-section-range-slider class="filter-section" :filter-menu-open="filterMenuOpen" />

				<div id="filter-section-advanced" class="filter-section" @click="showAdvancedFilters">
					Advanced Filters
				</div>
				<ais-state-results class="filter-section filter-show-loans-mobile-wrapper hide-for-medium">
					<kv-button
						class="filter-show-loans-mobile"
						slot-scope="{ nbHits }"
						@click="hideFilterMenu"
					>
						Show {{ nbHits }} loan{{ nbHits > 1 ? 's' : '' }}
					</kv-button>
				</ais-state-results>
			</div>
		</div>
	</div>
</template>

<script>
import {
	AisClearRefinements,
	AisStateResults,
} from 'vue-instantsearch';
import FilterSectionCategories from '@/pages/Lend/Filter/FilterSectionCategories';
import FilterSectionGender from '@/pages/Lend/Filter/FilterSectionGender';
import FilterSectionLocation from '@/pages/Lend/Filter/FilterSectionLocation';
import FilterSectionRangeSlider from '@/pages/Lend/Filter/FilterSectionRangeSlider';
import FilterSectionSort from '@/pages/Lend/Filter/FilterSectionSort';
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		AisClearRefinements,
		AisStateResults,
		FilterSectionCategories,
		FilterSectionGender,
		FilterSectionLocation,
		FilterSectionRangeSlider,
		FilterSectionSort,
		KvIcon,
		KvButton,
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
		clearAllRefinementsAndClose(refine) {
			this.clearAllRefinements(refine);
			this.hideFilterMenu();
		},
		clearAllRefinements(refine) {
			refine();
			this.$emit('clear-custom-categories');
		}
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
			position: fixed;
			top: 0;
			left: 0;
			opacity: 0;
			z-index: 1001;
			overflow-x: hidden;
			overflow-y: auto;
			user-select: none;
			pointer-events: none;
			width: 100vw;
			height: 100vh;
			padding-bottom: rem-calc(75);
			background-color: rgba(255, 255, 255, 1);
			transition: opacity $filter-transition;

			.filter-section {
				padding: 0.5rem 1.5rem;
				border-top: 1px solid #E5E5E5;

				&#filter-section-mobile-reset-all {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.filter-mobile-reset-all-link {
						cursor: pointer;
					}

					.filter-mobile-close-icon-wrapper {
						width: 2rem;
						height: 1.5rem;
						display: flex;
						justify-content: flex-end;
						align-items: center;
						cursor: pointer;

						.filter-mobile-close-icon {
							width: rem-calc(14);
							height: rem-calc(14);
							stroke: $subtle-gray;
						}
					}
				}

				&#filter-section-advanced {
					cursor: pointer;
					color: #B5B5B5;
				}
			}

			.filter-show-loans-mobile-wrapper {
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				background: $white;

				.filter-show-loans-mobile {
					margin: 0 0 rem-calc(2) 0;
					width: 100%;
				}
			}
		}
	}

	&.open {
		#lend-filter-overlay {
			pointer-events: initial;
		}

		#lend-filter-wrapper {
			#filter-toggle {
				z-index: 1001;
			}

			#filter-menu {
				opacity: 1;
				pointer-events: initial;
			}
		}
	}

	@include breakpoint(medium) {
		#lend-filter-wrapper {
			#filter-menu {
				position: absolute;
				top: 2.5rem;
				padding-bottom: 0;
				overflow-y: hidden;
				min-width: rem-calc(270);
				width: auto;
				height: auto;
				box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.4);
				border-radius: $filter-border-radius;

				.filter-section {
					margin: 0 1rem;
					padding: 0.5rem 0.5rem;
				}
			}
		}
	}
}
</style>

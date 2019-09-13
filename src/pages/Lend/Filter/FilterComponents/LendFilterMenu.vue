<template>
	<div id="lend-filter-menu" class="small-12 columns" :class="{open: filterMenuOpen, pinned: filterMenuPinned}">
		<div id="lend-filter-overlay" @click="hideFilterMenu"></div>
		<div id="lend-filter-wrapper">
			<div id="filter-toggle" @click="toggleFilterMenu">
				<div>Filter and sort</div>
				<kv-icon class="filter-toggle-chevron" name="large-chevron" />
			</div>
			<div id="algolia-pagination-stats">
				<algolia-pagination-stats />
			</div>
			<div id="filter-menu">
				<div id="filter-section-mobile-reset-all" class="filter-section">
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
						<kv-icon class="filter-mobile-close-icon" name="x" />
					</div>
				</div>
				<filter-section-gender :filter-menu-open="filterMenuOpen" class="filter-section" />
				<filter-section-group-individual :filter-menu-open="filterMenuOpen" class="filter-section" />
				<filter-section-sort
					:default-sort-indices="defaultSortIndices"
					class="filter-section"
					:initial-accordian-state-open="initiallyExpandedFilters"
				/>
				<!-- Custom Categories
				<filter-section-categories
					class="filter-section"
					:custom-categories="customCategories"
					:selected-custom-categories="selectedCustomCategories"
					@toggle-custom-category="toggleCustomCategory"
				/>
				-->
				<filter-section-location-multi
					class="filter-section"
					:all-locations-lvl1="allLocationsLvl1"
					:initial-accordian-state-open="initiallyExpandedFilters"
				/>
				<filter-section-sectors
					class="filter-section"
					:all-sector-names="allSectorNames"
					:initial-accordian-state-open="initiallyExpandedFilters"
				/>
				<filter-section-attributes class="filter-section" :all-loan-theme-names="allLoanThemeNames" />
				<filter-section-tags class="filter-section" :all-tag-names="allTagNames" />
				<filter-section-loan-details class="filter-section" />

				<div id="filter-section-advanced" class="filter-section" @click="showAdvancedFilters">
					Advanced filters
				</div>
			</div>
			<ais-state-results class="filter-section filter-show-loans-mobile-wrapper hide-for-medium">
				<kv-button
					class="filter-show-loans-mobile"
					slot-scope="{ nbHits }"
					@click.native="hideFilterMenu"
				>
					Show {{ nbHits }} loan{{ nbHits > 1 ? 's' : '' }}
				</kv-button>
			</ais-state-results>
		</div>
	</div>
</template>

<script>
import {
	AisClearRefinements,
	AisStateResults,
} from 'vue-instantsearch';
// Custom Categories
// import the following to access "customCategories"
// import algoliaCustomCategories from '@/plugins/algolia-custom-categories-mixin';
// import FilterSectionCategories from '@/pages/Lend/Filter/FilterSections/FilterSectionCategories';
import AlgoliaPaginationStats from '@/pages/Lend/AlgoliaPaginationStats';
import FilterSectionSectors from '@/pages/Lend/Filter/FilterSections/FilterSectionSectors';
import FilterSectionAttributes from '@/pages/Lend/Filter/FilterSections/FilterSectionAttributes';
import FilterSectionTags from '@/pages/Lend/Filter/FilterSections/FilterSectionTags';
import FilterSectionGender from '@/pages/Lend/Filter/FilterSections/Gender/FilterSectionGender';
// eslint-disable-next-line max-len
import filterSectionGroupIndividual from '@/pages/Lend/Filter/FilterSections/GroupIndividual/FilterSectionGroupIndividual';
import FilterSectionLocationMulti from '@/pages/Lend/Filter/FilterSections/LocationMulti/FilterSectionLocationMulti';
import FilterSectionLoanDetails from '@/pages/Lend/Filter/FilterSections/LoanDetails/FilterSectionLoanDetails';
import FilterSectionSort from '@/pages/Lend/Filter/FilterSections/FilterSectionSort';
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '@/components/Kv/KvButton';
import lockScrollUtils from '@/plugins/lock-scroll';

export default {
	components: {
		AisClearRefinements,
		AisStateResults,
		AlgoliaPaginationStats,
		// Custom Categories
		// FilterSectionCategories,
		FilterSectionSectors,
		FilterSectionAttributes,
		FilterSectionTags,
		FilterSectionGender,
		filterSectionGroupIndividual,
		FilterSectionLocationMulti,
		FilterSectionLoanDetails,
		FilterSectionSort,
		KvIcon,
		KvButton,
	},
	mixins: [
		lockScrollUtils,
	],
	data() {
		return {
			filterMenuOpen: false,
		};
	},
	props: {
		defaultSortIndices: {
			type: Array,
			required: true,
		},
		selectedCustomCategories: {
			type: Object,
			required: true,
		},
		allLocationsLvl1: {
			type: Array,
			default: () => []
		},
		allSectorNames: {
			type: Array,
			default: () => []
		},
		allLoanThemeNames: {
			type: Array,
			default: () => []
		},
		allTagNames: {
			type: Array,
			default: () => []
		},
		filterMenuPinned: {
			type: Boolean,
			default: false,
		},
		initiallyExpandedFilters: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		hideFilterMenu() {
			this.unlockScrollSmallOnly();
			this.filterMenuOpen = false;
			this.$emit('hide-filter-menu');
		},
		toggleFilterMenu() {
			this.lockScrollSmallOnly();
			this.filterMenuOpen = !this.filterMenuOpen;
			this.$emit(this.filterMenuOpen ? 'show-filter-menu' : 'hide-filter-menu');
		},
		showAdvancedFilters() {
			this.$emit('exit-lend-filter-exp');
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
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

#lend-filter-menu {
	$filter-transition: 0.25s ease-out;
	$filter-border-radius: rem-calc(3);

	margin-bottom: rem-calc(10);

	.basic-filter-section {
		padding: 0.5rem 1.5rem;
		border-top: 1px solid #E5E5E5;
	}

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

		#algolia-pagination-stats {
			display: block;
			padding-left: rem-calc(160);
			padding-top: rem-calc(1);

			@include breakpoint(1194px) {
				display: none;
			}
		}

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
			bottom: 0;
			left: 0;
			right: 0;
			opacity: 0;
			z-index: 1001;
			overflow-x: hidden;
			overflow-y: auto;
			user-select: none;
			pointer-events: none;
			padding-bottom: rem-calc(65);
			background-color: rgba(255, 255, 255, 1);
			transition: opacity $filter-transition;
			-webkit-overflow-scrolling: touch;

			.filter-section {
				@extend .basic-filter-section;

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

				&:first-child {
					border-top: none;
				}
			}
		}

		.filter-show-loans-mobile-wrapper {
			@extend .basic-filter-section;

			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background: $white;
			z-index: 1001;
			opacity: 0;
			pointer-events: none;

			.filter-show-loans-mobile {
				margin: 0 0 rem-calc(2) 0;
				width: 100%;
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

			.filter-show-loans-mobile-wrapper {
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
				bottom: initial;
				right: initial;
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

	&.pinned {
		@include breakpoint(1194px) {
			max-width: 21rem;

			#lend-filter-overlay {
				display: none;
			}

			#lend-filter-wrapper {
				margin-right: 2rem;

				#filter-toggle {
					display: none;
				}

				#filter-menu {
					width: rem-calc(320);
					position: initial;
					opacity: 1;
					pointer-events: initial;
					box-shadow: none;
					border: 1px solid $light-gray;

					.filter-section {
						&#filter-section-mobile-reset-all {
							.filter-mobile-close-icon-wrapper {
								display: none;
							}
						}
					}
				}
			}
		}
	}
}
</style>

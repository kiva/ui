<template>
	<div id="lend-filter-menu" class="small-12 columns" :class="{open: filterMenuOpen}">
		<div id="lend-filter-overlay" @click="hideFilterMenu"></div>
		<div id="lend-filter-wrapper">
			<div id="filter-toggle" @click="toggleFilterMenu">
				<div>Filters</div>
				<kv-icon class="filter-toggle-chevron" name="large-chevron" />
			</div>
			<div id="filter-menu">
				<ais-refinement-list :attribute="'sector.name'" />
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
// import _throttle from 'lodash/throttle';

import KvIcon from '@/components/Kv/KvIcon';

import { AisRefinementList } from 'vue-instantsearch';

export default {
	components: {
		KvIcon,
		AisRefinementList,
	},
	data() {
		return {
			filterMenuOpen: false,
		};
	},
	methods: {
		hideFilterMenu() {
			this.filterMenuOpen = false;
		},
		toggleFilterMenu() {
			this.filterMenuOpen = !this.filterMenuOpen;
		},
		showAdvancedFilters() {
			window.location.href = '/lend';
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
		z-index: 1;
		pointer-events: none;
		background-color: rgba(0, 0, 0, 0);
		transition: background-color $filter-transition;
	}

	#lend-filter-wrapper {
		position: relative;
		height: 2rem;

		#filter-toggle {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			padding: 0.25rem 0.25rem 0.25rem 0.5rem;
			user-select: none;
			height: 2rem;
			cursor: pointer;
			display: inline-flex;
			justify-content: flex-start;
			align-items: center;
			background-color: rgba(255, 255, 255, 0);
			border-radius: $filter-border-radius $filter-border-radius 0 0;
			transition: background-color $filter-transition;

			.filter-toggle-chevron {
				height: rem-calc(5);
				width: 2rem;
			}
		}

		#filter-menu {
			position: absolute;
			top: 2rem;
			left: 0;
			opacity: 0;
			z-index: 1;
			user-select: none;
			pointer-events: none;
			min-width: rem-calc(270);
			background-color: rgba(255, 255, 255, 1);
			border-radius: 0 $filter-border-radius $filter-border-radius $filter-border-radius;
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
			background-color: rgba(0, 0, 0, 0.6);
			pointer-events: initial;
		}

		#lend-filter-wrapper {
			#filter-toggle {
				background-color: rgba(255, 255, 255, 1);
			}

			#filter-menu {
				opacity: 1;
				pointer-events: initial;
			}
		}
	}
}
</style>

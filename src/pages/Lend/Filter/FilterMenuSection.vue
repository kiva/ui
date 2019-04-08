<template>
	<div class="filter-menu-section" :class="{open}">
		<div class="filter-summary" @click="toggleMenu">
			<div class="filter-summary-title" >
				{{ title }}
			</div>
			<ais-state-results>
				<div class="filter-summary-applied-filters" slot-scope="{ nbHits }">
					<span>{{ appliedFilters }}</span>
					<span v-if="!hideCount" class="filter-result-count">({{ nbHits }})</span>
				</div>
			</ais-state-results>
		</div>
		<div class="filter-items-container">
			<slot></slot>
		</div>
	</div>
</template>

<script>
import { AisStateResults } from 'vue-instantsearch';

export default {
	components: {
		AisStateResults,
	},
	props: {
		title: {
			type: String,
			required: true,
		},
		appliedFilters: {
			type: String,
			default: 'All',
		},
		hideCount: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			open: false,
		};
	},
	methods: {
		toggleMenu() {
			this.open = !this.open;
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.filter-menu-section {
	font-size: 0.875rem;
	font-weight: 300;

	.filter-summary {
		cursor: pointer;

		.filter-summary-title {
			font-size: 1rem;
			font-weight: 400;
		}

		.filter-summary-applied-filters {
			.filter-result-count {
				display: none;
			}
		}
	}

	.filter-items-container {
		display: none;

		ul {
			list-style-type: none;
			margin-bottom: 0;
		}

		.ais-HierarchicalMenu {
			a {
				color: $charcoal;
				text-decoration: none;
			}

			.ais-HierarchicalMenu-item--selected {
				> a {
					font-weight: 600;
					color: $green;
				}
			}
		}
	}

	&.open {
		background-color: rgba($green, 0.05);

		.filter-summary {
			.filter-summary-applied-filters {
				.filter-result-count {
					display: inline;
				}
			}
		}

		.filter-items-container {
			display: block;
		}
	}
}
</style>

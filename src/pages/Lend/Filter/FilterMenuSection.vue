<template>
	<div class="filter-menu-section" :class="{open}">
		<div class="filter-summary" @click="toggleMenu">
			<div class="filter-summary-title" >
				{{ title }}
			</div>
			<div class="filter-summary-applied-filters">{{ appliedFilters }}</div>
		</div>
		<div class="filter-items-container">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
		},
		appliedFilters: {
			type: String,
			default: 'All',
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
			font-weight: 500;
			margin: 0;
			transition: margin 0.15s ease-in;
		}
	}

	.filter-items-container {
		display: none;

		ul {
			list-style-type: none;
			margin: 0;
		}
	}

	&.open {
		.filter-summary {
			.filter-summary-title {
				margin: 0.25rem 0 0.75rem 0;
			}

			.filter-summary-applied-filters {
				/* Hide when menu is open as per design */
				display: none;
			}
		}

		.filter-items-container {
			display: block;
		}
	}
}
</style>

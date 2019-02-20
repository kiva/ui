<template functional>
	<div class="filter-menu-section" :class="{open: props.open}">
		<div class="filter-summary">
			<div class="filter-summary-title">
				{{ props.title }} <span class="filter-result-count">({{ props.resultCount }})</span>
			</div>
			<div class="filter-summary-applied-filters">{{ props.appliedFilters }}</div>
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
		resultCount: {
			type: Number,
			required: true,
		},
		open: {
			type: Boolean,
			default: true,
		},
	},
};
</script>

<style lang="scss">
.filter-menu-section {
	font-size: 0.875rem;
	font-weight: 300;

	.filter-summary {
		.filter-summary-title {
			font-size: 1rem;
			font-weight: 400;
		}
	}

	.filter-items-container {
		display: none;
		background-color: #F6FBF6;
	}

	&.open {
		.filter-summary {
			display: none;
		}

		.filter-items-container {
			display: block;
		}
	}
}
</style>

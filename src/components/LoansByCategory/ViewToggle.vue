<template>
	<div class="view-toggle">
		<router-link
			:to="browseUrl"
			class="browse-box"
			v-kv-track-event="['Lending', 'click-filter-toggle', 'Explore']">
			<span>
				<kv-icon
					name="browse-toggle"
					class="browse-toggle-icon"/>
				<span class="small-text show-for-xlarge view-text">Explore</span>
			</span>
		</router-link>
		<router-link
			:to="filterUrl"
			class="filter-box"
			v-kv-track-event="['Lending', 'click-filter-toggle', 'Filter']">
			<span class="divider">
				<kv-icon
					name="filters-toggle"
					class="filter-toggle-icon"/>
				<span class="small-text show-for-xlarge view-text">Filter</span>
			</span>
		</router-link>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon,
	},
	props: {
		browseUrl: {
			type: String,
			default: '/lend-by-category'
		},
		filterUrl: {
			type: String,
			default: '/lend'
		},
	}
};
</script>

<style lang='scss' scoped>
@import 'settings';

.view-toggle {
	.view-text {
		color: $kiva-text-light;
	}

	.browse-box {
		margin-right: 0.75rem;

		@include breakpoint(xlarge) {
			margin-right: 1rem;
		}

		&:hover {
			text-decoration: none;
		}
	}

	.divider {
		border-left: 1px solid $kiva-stroke-gray;
		float: left;
		height: 99%;
		padding-left: 0.75rem;

		@include breakpoint(xlarge) {
			height: 88%;
			// slightly larger to account for text
			padding-left: 1.25rem;
		}
	}

	.browse-toggle-icon,
	.filter-toggle-icon {
		display: block;
		height: rem-calc(30);
		width: rem-calc(30);
		margin: 0 auto;
		fill: $kiva-text-light;
	}

	.filter-box:hover {
		.filter-toggle-icon {
			fill: $kiva-text-medium;
		}

		.view-text {
			text-decoration: underline;
			text-decoration-color: $kiva-text-medium;
			color: $kiva-text-medium;
		}
	}

	// Changing the color of the selected toggle
	.router-link-active .browse-toggle-icon, {
		fill: $kiva-green;
		opacity: 0.85;
	}
}
</style>

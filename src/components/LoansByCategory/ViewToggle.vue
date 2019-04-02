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

@mixin toggle-hover($type) {
	cursor: default;

	:hover {
		.#{$type}-toggle-icon {
			fill: $kiva-text-medium;
		}

		.view-text {
			color: $kiva-text-medium;
			text-decoration: underline;
			text-decoration-color: $kiva-text-medium;
		}
	}
}

@mixin filter-icon-and-text($fill-color) {
	text-decoration: none;

	.browse-toggle-icon {
		fill: $fill-color;
		opacity: 0.85;
	}

	.view-text {
		color: $kiva-text-light;
		text-decoration: none;
	}
}

.view-toggle {
	.view-text {
		color: $kiva-text-light;
		cursor: default;
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
		cursor: default;
		display: block;
		height: rem-calc(30);
		width: rem-calc(30);
		margin: 0 auto;
		fill: $kiva-text-light;
	}

	.browse-box {
		margin-right: 0.75rem;

		@include breakpoint(xlarge) {
			margin-right: 1rem;
		}

		@include toggle-hover('browse');

		// lend-by-category/<CATEGORY_ID>
		&.router-link-active {
			@include filter-icon-and-text($kiva-text-light);
			@include toggle-hover('browse');
		}

		// lend-by-category
		&.router-link-exact-active {
			&.router-link-active {
				@include filter-icon-and-text($kiva-green);
			}
		}
	}

	.filter-box {
		@include toggle-hover('filter');

		// lend/filter
		&.router-link-active {
			text-decoration: none;

			.filter-toggle-icon {
				fill: $kiva-green;
				opacity: 0.85;
			}

			.view-text {
				color: $kiva-text-light;
				text-decoration: none;
			}
		}
	}
}
</style>

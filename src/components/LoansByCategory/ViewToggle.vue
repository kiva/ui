<template>
	<div class="view-toggle">
		<router-link
			to="/lend-by-category"
			class="browse-box"
			v-kv-track-event="['Lending', 'click-filter-toggle', 'Explore']">
			<span>
				<kv-icon
					name="browse-toggle"
					class="browse-toggle-icon"/>
				<span class="small-text hide-for-small-only view-text">Explore</span>
			</span>
		</router-link>
		<router-link
			to="/lend"
			class="filter-box"
			v-kv-track-event="['Lending', 'click-filter-toggle', 'Filter']">
			<span class="divider">
				<kv-icon
					name="filters-toggle"
					class="filter-toggle-icon"/>
				<span class="small-text hide-for-small-only view-text">Filter</span>
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
	data() {
		return {
			isSelected: false,
		};
	},
};
</script>

<style lang='scss' scoped>
@import 'settings';

.view-toggle {
	float: right;
	display: flex;
	margin-right: 1rem;

	@include breakpoint(medium) {
		margin-right: 2rem;
	}
}

.view-text {
	color: $kiva-text-light;
}

.browse-box {
	margin-right: 0.75rem;

	&:hover {
		text-decoration: none;
	}
}

.divider {
	border-left: 1px solid $kiva-stroke-gray;
	float: left;
	height: 90%;
	padding-left: 0.75rem;
}

.browse-toggle-icon,
.filter-toggle-icon {
	display: block;
	height: rem-calc(30);
	width: rem-calc(30);
	margin: 0 auto;
	fill: $kiva-text-light;
}

// Changing the color of the selected toggle
.router-link-active .browse-toggle-icon, {
	fill: $kiva-green;
	opacity: 0.85;
}

</style>

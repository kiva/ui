<template>
	<div class="view-toggle">
		<span class="browse-box">
			<kv-icon name="browse-toggle" class="browse-icon"/>
			<span class="small-text hide-for-small-only">Explore</span>
		</span>
		<span class="filter-box">
			<kv-icon name="filters-toggle" class="filter-toggle-icon"/>
			<span class="small-text hide-for-small-only">Filter</span>
		</span>
	</div>
</template>

<script>
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon,
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.view-toggle {
	float: right;
	display: flex;
	margin-right: 1rem;

	@include breakpoint(medium) {
		margin-right: 2rem;
	}
}

.browse-box {
	margin-right: 0.75rem;
}

.filter-box {
	border-left: 1px solid black;
	padding-left: 0.75rem;
}

.browse-icon,
.filter-toggle-icon {
	display: block;
	height: 30px;
	width: 30px;
	margin: 0 auto;
	fill: $kiva-text-light;
}

// Selected toggled color will be:
// stroke: $kiva-green;
// opacity: 0.85;

</style>

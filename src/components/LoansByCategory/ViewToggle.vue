<template>
	<div class="view-toggle">
		<span class="browse-box">
			<kv-icon name="browse-toggle" class="browse-icon"/>
			<span class="small-text hide-for-small-only">Explore</span>
		</span>
		<span class="filter-box">
			<kv-icon name="filter-toggle" class="filter-toggle-icon"/>
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
	margin-left: 1rem;
	margin-right: 1rem;
}

.filter-box {
	border-left: 1px solid black;
	margin-left: 1rem;
	padding-left: 1rem;
}

.browse-icon,
.filter-toggle-icon {
	display: block;
	height: 30px;
	width: 30px;
	margin: 0 auto;
}

</style>

<template functional>
	<ul>
		<li v-for="item in props.items" :key="item.value">
			<a
				:href="props.createURL(item.value)"
				:style="{ fontWeight: item.isRefined ? 'bold' : '' }"
				@click.prevent="props.refine(item.value)"
			>
				{{ item.label }} ({{ item.count }})
			</a>
			<!-- eslint-disable vue/attribute-hyphenation -->
			<hierarchical-menu-list
				v-if="item.data"
				:items="item.data"
				:refine="props.refine"
				:createURL="props.createURL"
			/>
			<!-- eslint-enable vue/attribute-hyphenation -->
		</li>
	</ul>
</template>

<script>
export default {
	name: 'HierarchicalMenuList',
};
</script>

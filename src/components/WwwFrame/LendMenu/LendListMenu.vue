<template>
	<ul class="lend-list-menu">
		<expandable-list-item title="Categories" name="lend-menu-category-panel">
			<ul>
				<li v-for="category in categories" :key="category.index">
					<a :href="category.url">{{ category.name }}</a>
				</li>
			</ul>
		</expandable-list-item>
		<expandable-list-item title="Regions" name="lend-menu-region-panel">
			<ul>
				<expandable-list-item
					v-for="region in regions"
					:key="region.name"
					:title="region.name"
					:name="`lend-menu-${region.name}-panel` | kebabCase"
				>
					<country-list :countries="region.countries" />
				</expandable-list-item>
			</ul>
		</expandable-list-item>
		<router-link to="/lend">All loans</router-link>
	</ul>
</template>

<script>
import CountryList from './CountryList';
import ExpandableListItem from './ExpandableListItem';

export default {
	components: {
		CountryList,
		ExpandableListItem,
	},
	props: {
		categories: {
			type: Array,
			default: () => [],
		},
		regions: {
			type: Array,
			default: () => [],
		},
	},
};
</script>

<template>
	<ul>
		<li v-for="search in searches" :key="search.id">
			<a :href="search.url">{{ search.name }}</a>
		</li>
		<li>
			<router-link to="/lend/saved-search">
				Manage saved searches
			</router-link>
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		searches: {
			type: Array,
			default: () => [],
		}
	}
};
</script>

<template>
	<ul class="tw-font-medium">
		<li v-for="search in searches" :key="search.id">
			<a
				class="search-link"
				:href="search.url"
			>{{ search.name }}</a>
		</li>
		<li>
			<router-link
				to="/lend/saved-search"
				class="search-link"
			>
				Manage saved searches
			</router-link>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'SearchList',
	props: {
		searches: {
			type: Array,
			default: () => [],
		}
	}
};
</script>

<style lang="postcss" scoped>
.search-link {
	@apply tw-text-primary tw-block tw-w-full tw-py-1;
	@apply tw-no-underline hover:tw-underline hover:tw-text-action active:tw-text-action-highlight;
}
</style>

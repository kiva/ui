<template>
	<ul class="tw-font-medium">
		<li v-for="search in searches" :key="search.id">
			<a
				class="tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1"
				:href="search.url"
			>{{ search.name }}</a>
		</li>
		<li>
			<router-link
				to="/lend/saved-search"
				class="tw-text-primary hover:tw-text-action-highlight tw-block tw-w-full tw-py-1"
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

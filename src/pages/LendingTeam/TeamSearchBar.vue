<template>
	<div class="tw-flex
	tw-gap-0.5
	tw-flex-row"
	>
		<kv-text-input id="team-search-bar"
			placeholder="Search Lending Teams..."
			v-model="queryString" class="tw-flex-1"
		/>

		<kv-button variant="secondary"
			@click="handleSearchTeams"
			class="tw-flex-none"
		>
			Search
		</kv-button>
	</div>
</template>

<script>
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

export default {
	name: 'TeamSearchBar',
	components: {
		KvButton,
		KvTextInput,
	},
	inject: ['apollo'],
	data() {
		return {
			queryString: '',
		};
	},
	methods: {
		handleSearchTeams() {
			this.$emit('search', this.queryString);
		},
		handleSearchQuery(queryString) {
			this.queryString = queryString;
		}
	}
};
</script>

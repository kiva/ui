<template>
	<div class="tw-flex tw-gap-0.5 tw-flex-row">
		<kv-text-input
			id="team-search-bar"
			placeholder="Search Lending Teams..."
			v-model="queryString" class="tw-flex-1"
		/>

		<kv-button
			variant="secondary"
			@click="handleSearchTeams"
			class="tw-flex-none"
			v-kv-track-event="[
				'teams',
				'filter',
				'teams-search',
				queryString
			]"
		>
			Search
		</kv-button>
	</div>
</template>

<script>
import { KvButton, KvTextInput } from '@kiva/kv-components';

export default {
	name: 'TeamSearchBar',
	components: {
		KvButton,
		KvTextInput,
	},
	inject: ['apollo'],
	emits: ['search'],
	props: {
		initialValue: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			queryString: this.initialValue,
		};
	},
	methods: {
		handleSearchTeams() {
			this.$emit('search', this.queryString);
		},
	}
};
</script>

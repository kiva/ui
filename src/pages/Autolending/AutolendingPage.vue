<template>
	<www-page class="autolending" :gray-background="true">
		<div class="title-area">
			<div class="row column">
				<h1>Auto-lending preferences</h1>
				<h2>Make the impact you want even if you’re away from your account for a while</h2>
			</div>
		</div>
		<!-- main toggles -->
		<div class="row column">
			<div class="setting-group">
				<main-toggle />
				<gender-radios />
			</div>
		</div>
		<!-- basic criteria (counter starts here) -->
		<!-- hr or border -->
		<!-- advanced settings -->
		<!-- save button, only visible when changes exist -->
		<div class="row column">
			<kv-button @click.native="save" v-if="isChanged">
				Save settings
			</kv-button>
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import KvButton from '@/components/Kv/KvButton';
import WwwPage from '@/components/WwwFrame/WwwPage';
import initAutolending from '@/graphql/mutation/autolending/initAutolending.graphql';
import autolendingQuery from '@/graphql/query/autolending/autolendingPage.graphql';
import saveChanges from '@/graphql/mutation/autolending/saveChanges.graphql';
import MainToggle from './MainToggle';
import GenderRadios from './GenderRadios';

export default {
	inject: ['apollo'],
	components: {
		KvButton,
		WwwPage,
		MainToggle,
		GenderRadios,
	},
	data() {
		return {
			isChanged: false,
		};
	},
	apollo: {
		query: autolendingQuery,
		preFetch(config, client) {
			return client.mutate({ mutation: initAutolending })
				.then(() => client.query({ query: autolendingQuery }));
		},
		result({ data }) {
			this.isChanged = !!_get(data, 'autolending.profileChanged');
		},
	},
	methods: {
		save() {
			// TODO move this into the save button component
			this.apollo.mutate({ mutation: saveChanges });
		}
	},
};
</script>

<style lang="scss">
@import 'settings';

.autolending {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}

	.setting-group {
		margin: 2rem 0;
		border-bottom: 1px solid $kiva-stroke-gray;
	}
}
</style>

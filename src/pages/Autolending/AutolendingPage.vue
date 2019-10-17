<template>
	<www-page class="autolending">
		<div class="title-area">
			<div class="row column">
				<h1>Auto-lending preferences</h1>
				<h2>Make the impact you want even if you’re away from your account for a while</h2>
			</div>
		</div>
		<!-- main toggles -->
		<div class="row column">

			<!-- <kv-toggle v-model="isEnabled"> -->
			<kv-toggle>
				<template v-if="isEnabled">
					Auto-lending on
				</template>
				<template v-else>
					Auto-lending off
				</template>
			</kv-toggle>
			<kv-dropdown-rounded />
		</div>
		<!-- hr or border -->
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
import KvToggle from '@/components/Kv/KvToggle';
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';
// import query from '@/graphql/query/autolending.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';
import initAutolending from '@/graphql/mutation/autolending/initAutolending.graphql';
import autolendingQuery from '@/graphql/query/autolending/autolendingPage.graphql';
import toggleEnabled from '@/graphql/mutation/autolending/toggleEnabled.graphql';
import saveChanges from '@/graphql/mutation/autolending/saveChanges.graphql';

export default {
	inject: ['apollo'],
	components: {
		KvButton,
		WwwPage,
		KvToggle,
		KvDropdownRounded
	},
	data() {
		return {
			lendMenuId: 'Testing',
		};
	},
	data() {
		return {
			isEnabled: false,
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
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			this.isChanged = !!_get(data, 'autolending.profileChanged');
		},
	},
	watch: {
		isEnabled(enabled, previouslyEnabled) {
			if (enabled !== previouslyEnabled) {
				// TODO move this into the autolend toggle component
				this.apollo.mutate({
					mutation: toggleEnabled,
					variables: {
						isEnabled: enabled
					}
				});
			}
		}
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
	background-color: $kiva-bg-lightgray;

	.title-area {
		padding: 1.625rem 0;
		background-color: $white;
	}
}
</style>

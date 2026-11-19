<template>
	<div class="autolending-settings-page">
		<div v-if="hasSavedSearch" class="row">
			<div class="column large-8">
				<kv-settings-card>
					<template #content>
						<p>
							Your auto-lending is currently managed by Kiva. To make changes, please
							<!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
							<router-link to="/help/contact-us">contact support</router-link>.
						</p>
					</template>
				</kv-settings-card>
			</div>
		</div>
		<template v-else>
			<div class="row">
				<div class="column large-8">
					<autolending-status />

					<!-- When your balance will be lent -->
					<autolending-when />

					<!-- Who you'll support-->
					<autolending-who />
				</div>
			</div>
			<div class="row column">
				<save-button v-if="isChanged" />
			</div>
		</template>
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from 'graphql-tag';
import initAutolending from '#src/graphql/mutation/autolending/initAutolending.graphql';
import logFormatter from '#src/util/logFormatter';
import KvSettingsCard from '#src/components/Kv/KvSettingsCard';
import SaveButton from './SaveButton';
import AutolendingStatus from './AutolendingStatus';
import AutolendingWhen from './AutolendingWhen';
import AutolendingWho from './AutolendingWho';

const pageQuery = gql`query autolendProfileEnabled {
	autolending @client {
		id
		profileChanged
		currentProfile {
			id
			isEnabled
		}
	}
	my {
		id
		autolendProfile {
			id
			savedSearch {
				id
			}
		}
	}
}`;

export default {
	name: 'AutolendingSettingsPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		AutolendingWho,
		AutolendingStatus,
		AutolendingWhen,
		KvSettingsCard,
		SaveButton,
	},
	data() {
		return {
			hasSavedSearch: false,
			isChanged: false,
			isEnabled: false,
			showAdvanced: false,
			kivaChooses: true,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				client.query({
					query: gql`query userIsMonthlyGoodSubscriber {
							my {
								id
								autoDeposit {
									id
									isSubscriber
								}
							}
						}`
				})
					.then(({ data }) => {
						const isSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
						if (isSubscriber) {
							throw new Error('monthlyGoodSubscriber');
						}
					})
					.then(() => client.mutate({ mutation: initAutolending }))
					.then(() => client.query({ query: pageQuery }))
					.then(resolve)
					.catch(e => {
						if (e.message.indexOf('monthlyGoodSubscriber') > -1) {
						// Redirect to legacy Monthly Good Settins page
							reject({
								path: '/settings/credit'
							});
						} else {
						// Log other errors
							logFormatter('AutoendingSettingsPage: Error during pre-fetch', 'error', { error: e });
							resolve();
						}
					});
			});
		},
		result({ data }) {
			this.hasSavedSearch = !!_get(data, 'my.autolendProfile.savedSearch.id');
			this.isChanged = !!_get(data, 'autolending.profileChanged');
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			this.kivaChooses = !!_get(data, 'autolending.currentProfile.kivaChooses');
		},
	},
	mounted() {
		window.addEventListener('beforeunload', this.onLeave);
	},
	beforeUnmount() {
		window.removeEventListener('beforeunload', this.onLeave);
	},
	methods: {
		onLeave(event) {
			if (this.isChanged) {
				// eslint-disable-next-line no-param-reassign
				event.returnValue = 'You have unsaved settings! Are you sure you want to leave?';
			}
		},
	},
};
</script>

<style lang="scss">
@use '#src/assets/scss/settings' as *;

.autolending {
	.button {
		.loading-spinner {
			vertical-align: middle;
			width: 1rem;
			height: 1rem;

			& :deep(.line) {
				background-color: $white;
			}
		}
	}
}

</style>

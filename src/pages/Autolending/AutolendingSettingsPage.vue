<template>
	<div class="autolending-settings-page">
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
	</div>
</template>

<script>
import _get from 'lodash/get';
import { gql } from '@apollo/client';
import initAutolending from '@/graphql/mutation/autolending/initAutolending.graphql';
import logFormatter from '@/util/logFormatter';
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

}`;

export default {
	name: 'AutolendingSettingsPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		AutolendingWho,
		AutolendingStatus,
		AutolendingWhen,
		SaveButton,
	},
	data() {
		return {
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
			this.isChanged = !!_get(data, 'autolending.profileChanged');
			this.isEnabled = !!_get(data, 'autolending.currentProfile.isEnabled');
			this.kivaChooses = !!_get(data, 'autolending.currentProfile.kivaChooses');
		},
	},
	mounted() {
		window.addEventListener('beforeunload', this.onLeave);
	},
	beforeDestroy() {
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
@import 'settings';

.autolending {
	.button {
		.loading-spinner {
			vertical-align: middle;
			width: 1rem;
			height: 1rem;

			& >>> .line {
				background-color: $white;
			}
		}
	}
}

</style>

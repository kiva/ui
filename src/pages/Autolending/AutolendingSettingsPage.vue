<template>
	<div>
		<autolending-status />

		<!-- When your balance will be lent -->
		<autolending-when />

		<!-- Who you'll support-->
		<autolending-who />

		<div class="row column save-button-area">
			<save-button />
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';
import initAutolending from '@/graphql/mutation/autolending/initAutolending.graphql';
import autolendingQuery from '@/graphql/query/autolending/autolendingPage.graphql';
import SaveButton from './SaveButton';
import AutolendingStatus from './AutolendingStatus';
import AutolendingWhen from './AutolendingWhen';
import AutolendingWho from './AutolendingWho';


const pageQuery = gql`{
	autolending @client {
		profileChanged
		currentProfile {
			isEnabled
		}
	}
}`;

export default {
	inject: ['apollo', 'federation'],
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
		preFetch(config, client, { route, kvAuth0 }) {
			return new Promise((resolve, reject) => {
				client.query({ query: autolendingQuery })
					.then(({ data }) => {
						const lastLogin = _get(data, 'my.lastLoginTimestamp', 0);
						const duration = 1000 * (parseInt(_get(data, 'general.activeLoginDuration.value'), 10) || 3600);
						if (kvAuth0.getKivaId() && Date.now() > lastLogin + duration) {
							throw new Error('activeLoginRequired');
						}
						const isSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
						if (isSubscriber) {
							throw new Error('monthlyGoodSubscriber');
						}
					})
					.then(() => client.mutate({ mutation: initAutolending }))
					.then(() => client.query({ query: pageQuery }))
					.then(resolve)
					.catch(e => {
						if (e.message.indexOf('activeLoginRequired') > -1) {
							// Force a login when active login is required
							reject({
								path: '/ui-login',
								query: { force: true, doneUrl: route.fullPath }
							});
						} else if (e.message.indexOf('api.authenticationRequired') > -1) {
							// Redirect to login upon authentication error
							reject({
								path: '/ui-login',
								query: { doneUrl: route.fullPath }
							});
						} else if (e.message.indexOf('monthlyGoodSubscriber') > -1) {
							// Redirect to legacy Monthly Good Settins page
							reject({
								path: '/settings/credit'
							});
						} else {
							// Log other errors
							console.error(e);
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

<style lang="scss" scoped>
@import 'settings';

$autolending-font-size: rem-calc(18.8);

::v-deep .obscure {
	opacity: 0.4;
	pointer-events: none;
}

[class*="-area"] {
	margin-bottom: 1.5rem;
}

.save-button-area {
	margin-bottom: 5rem;
}

::v-deep .settings-card {
	background: $white;
	padding: 1.95rem;
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto 1fr;
	gap: 1rem 1rem;
	grid-template-areas: "icon-wrapper title-wrapper" "icon-wrapper content-wrapper";
}

::v-deep .icon-wrapper {
	grid-area: icon-wrapper;

	.icon {
		margin-top: 1px;
		height: 1.75rem;
		width: 1.75rem;
	}
}

::v-deep .title-wrapper {
	grid-area: title-wrapper;

	h3 {
		font-weight: $global-weight-bold;
	}
}

::v-deep .content-wrapper { grid-area: content-wrapper; }
</style>

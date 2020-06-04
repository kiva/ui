<template>
	<div>
		<!-- One Time Settings -->
		<subscriptions-one-time
			v-if="isOnetime"
			@cancel-subscription="showConfirmationPrompt('Contribution')"
			@unsaved-changes="setUnsavedChanges"
			ref="subscriptionsOneTimeComponent"
		/>

		<!-- Monthly Good Settings -->
		<subscriptions-monthly-good
			v-if="!isOnetime"
			@cancel-subscription="showConfirmationPrompt('Monthly Good')"
			@unsaved-changes="setUnsavedChanges"
			ref="subscriptionsMonthlyGoodComponent"
		/>

		<!-- Auto Deposit Settings -->
		<subscriptions-auto-deposit
			v-if="!isOnetime && !isMonthlyGoodSubscriber && !isLegacySubscriber"
			@cancel-subscription="showConfirmationPrompt('Auto Deposit')"
			@unsaved-changes="setUnsavedChanges"
			ref="subscriptionsAutoDepositComponent"
		/>

		<!-- Legacy Subscriptions-->
		<subscriptions-legacy
			v-if="!isOnetime && !isMonthlyGoodSubscriber && isLegacySubscriber"
		/>

		<!-- Are you sure? -->
		<kv-lightbox
			class="cancel-confirmation-lightbox"
			:visible="showLightbox"
			title="Are you sure?"
			@lightbox-closed="showLightbox = false"
		>
			<template>
				&nbsp;
			</template>
			<template slot="controls">
				<kv-button
					value="Yes"
					id="cancel-subscription-yes"
					class="button smallest"
					@click.prevent.native="cancelSubscription"
				>
					Yes, cancel my {{ confirmationText }}
				</kv-button>
				<kv-button
					value="No"
					id="cancel-subscription-no"
					class="button smallest secondary"
					@click.prevent.native="showLightbox = false"
				>
					No, keep it
				</kv-button>
			</template>
		</kv-lightbox>

		<!-- Save button  -->
		<div class="row column save-button-area" v-if="isChanged">
			<kv-button
				data-test="subscriptions-save-button"
				class="smaller"
				v-if="!isSaving"
				@click.native="saveSubscription"
			>
				Save
			</kv-button>
			<kv-button data-test="subscriptions-save-button" class="smaller" v-else>
				Saving <kv-loading-spinner />
			</kv-button>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import SubscriptionsMonthlyGood from './SubscriptionsMonthlyGood';
import SubscriptionsOneTime from './SubscriptionsOneTime';
import SubscriptionsAutoDeposit from './SubscriptionsAutoDeposit';
import SubscriptionsLegacy from './SubscriptionsLegacy';


import KvLightbox from '@/components/Kv/KvLightbox';
import KvButton from '@/components/Kv/KvButton';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

const pageQuery = gql`{
	my {
		autoDeposit {
			isSubscriber
			isOnetime
		}
		lastLoginTimestamp @client
		subscriptions {
			values {
				id
			}
		}
	}
	general {
		activeLoginDuration: configSetting(key: "login_timeouts.www.active_login") {
			value
			key
		}
	}
}`;

export default {
	components: {
		KvButton,
		KvLightbox,
		KvLoadingSpinner,
		SubscriptionsAutoDeposit,
		SubscriptionsMonthlyGood,
		SubscriptionsOneTime,
		SubscriptionsLegacy,
	},
	inject: ['apollo'],
	data() {
		return {
			isChanged: false,
			isSaving: false,
			isOnetime: false,
			confirmationText: '',
			showLightbox: false,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch(config, client, { route, kvAuth0 }) {
			return new Promise((resolve, reject) => {
				client.query({
					query: pageQuery
				}).then(({ data }) => {
					const lastLogin = _get(data, 'my.lastLoginTimestamp', 0);
					const duration = 1000 * (parseInt(_get(data, 'general.activeLoginDuration.value'), 10) || 3600);
					if (kvAuth0.getKivaId() && Date.now() > lastLogin + duration) {
						throw new Error('activeLoginRequired');
					}
				}).then(resolve).catch(e => {
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
					} else {
						// Log other errors
						console.error(e);
						resolve();
					}
				});
			});
		},
		result({ data }) {
			this.isOnetime = _get(data, 'my.autoDeposit.isOnetime', false);
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);

			const legacySubs = _get(data, 'my.subscriptions.values', []);
			this.isLegacySubscriber = legacySubs.length > 0;
		},
	},
	mounted() {
		window.addEventListener('beforeunload', this.onLeave);
	},
	beforeDestroy() {
		window.removeEventListener('beforeunload', this.onLeave);
	},
	methods: {
		setUnsavedChanges(state) {
			this.isChanged = state;
		},
		cancelSubscription() {
			this.apollo.mutate({
				mutation: gql`mutation { my { cancelAutoDeposit } }`,
				awaitRefetchQueries: true,
				refetchQueries: [
					{ query: pageQuery }
				]
			}).then(() => {
				this.$showTipMsg('Your subscription has been cancelled');
			}).catch(e => {
				console.error(e);
				this.$showTipMsg('There was a problem cancelling your subscription', 'error');
			}).finally(() => {
				this.showLightbox = false;
			});
		},
		showConfirmationPrompt(confirmationText) {
			this.confirmationText = confirmationText;
			this.showLightbox = true;
		},
		onLeave(event) {
			if (this.isChanged) {
				// eslint-disable-next-line no-param-reassign
				event.returnValue = 'You have unsaved settings! Are you sure you want to leave?';
			}
		},
		saveSubscription() {
			this.isSaving = true;
			// Calls the save methods in the component if component is being shown.
			if (this.$refs.subscriptionsOneTimeComponent) {
				this.$refs.subscriptionsOneTimeComponent.saveOneTime().finally(() => {
					this.isSaving = false;
				});
			}
			if (this.$refs.subscriptionsMonthlyGoodComponent) {
				this.$refs.subscriptionsMonthlyGoodComponent.saveMonthlyGood().finally(() => {
					this.isSaving = false;
				});
			}
			if (this.$refs.subscriptionsAutoDepositComponent) {
				this.$refs.subscriptionsAutoDepositComponent.saveAutoDeposit().finally(() => {
					this.isSaving = false;
				});
			}
		}

	},
};
</script>

<style lang="scss">
@import 'settings';

.subscriptions {
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

#cancel-subscription-yes {
	margin-right: 2rem;
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

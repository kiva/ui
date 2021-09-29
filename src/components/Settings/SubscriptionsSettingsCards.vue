<template>
	<div class="subscriptions-settings-page">
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
			@cancel-subscription="cancelSubscription"
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
			<template #controls>
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
		<div class="row column" v-if="isChanged">
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

		<kv-loading-overlay
			v-if="showLoadingOverlay"
		/>
	</div>
</template>

<script>
import _get from 'lodash/get';
import gql from 'graphql-tag';

import KvLightbox from '@/components/Kv/KvLightbox';
import KvButton from '@/components/Kv/KvButton';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvLoadingOverlay from '@/components/Kv/KvLoadingOverlay';

import SubscriptionsMonthlyGood from '@/components/Subscriptions/SubscriptionsMonthlyGood';
import SubscriptionsOneTime from '@/components/Subscriptions/SubscriptionsOneTime';
import SubscriptionsAutoDeposit from '@/components/Subscriptions/SubscriptionsAutoDeposit';
import SubscriptionsLegacy from '@/components/Subscriptions/SubscriptionsLegacy';

const pageQuery = gql`query subscriptionSettingsPage {
	my {
		autoDeposit {
			id
			isSubscriber
			isOnetime
		}
		subscriptions {
			values {
				id
			}
		}
	}
}`;

export default {
	components: {
		KvButton,
		KvLightbox,
		KvLoadingSpinner,
		KvLoadingOverlay,
		SubscriptionsAutoDeposit,
		SubscriptionsLegacy,
		SubscriptionsMonthlyGood,
		SubscriptionsOneTime,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			isChanged: false,
			isSaving: false,
			isOnetime: false,
			confirmationText: '',
			showLightbox: false,
			showLoadingOverlay: false,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
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
			this.showLoadingOverlay = true;
			this.apollo.mutate({
				mutation: gql`mutation cancelAutoDeposit { my { cancelAutoDeposit } }`,
				awaitRefetchQueries: true,
				refetchQueries: [
					{ query: pageQuery }
				]
			}).then(() => {
				this.$showTipMsg('Your subscription has been cancelled');
				this.isChanged = false;
			}).catch(e => {
				console.error(e);
				this.$showTipMsg('There was a problem cancelling your subscription', 'error');
			}).finally(() => {
				this.showLightbox = false;
				this.showLoadingOverlay = false;
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
			// Calls the save method in the component if component isChanged is true.
			if (_get(this.$refs, 'subscriptionsOneTimeComponent.isChanged', false)) {
				this.$refs.subscriptionsOneTimeComponent.saveOneTime().finally(() => {
					this.isSaving = false;
				});
			}
			if (_get(this.$refs, 'subscriptionsMonthlyGoodComponent.isChanged', false)) {
				this.$refs.subscriptionsMonthlyGoodComponent.saveMonthlyGood().finally(() => {
					this.isSaving = false;
				});
			}
			if (_get(this.$refs, 'subscriptionsAutoDepositComponent.isChanged', false)) {
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

.subscriptions-settings-page {
	position: relative;
	padding-bottom: 5rem;
}
</style>

<template>
	<div class="subscriptions-settings-page">
		<!-- Monthly Good Settings -->
		<subscriptions-monthly-good
			@cancel-subscription="cancelSubscription"
			@unsaved-changes="setUnsavedChanges"
			ref="subscriptionsMonthlyGoodComponent"
		/>

		<!-- Auto Deposit Settings -->
		<subscriptions-auto-deposit
			v-if="!isMonthlyGoodSubscriber && !isLegacySubscriber && !hasModernSub"
			@cancel-subscription="showConfirmationPrompt('Auto Deposit')"
			@unsaved-changes="setUnsavedChanges"
			ref="subscriptionsAutoDepositComponent"
		/>

		<!-- Legacy Subscriptions-->
		<subscriptions-legacy
			v-if="!isMonthlyGoodSubscriber && isLegacySubscriber"
		/>

		<!-- Are you sure? -->
		<kv-lightbox
			class="cancel-confirmation-lightbox"
			:visible="showLightbox"
			title="Are you sure?"
			variant="alert"
			@lightbox-closed="showLightbox = false"
		>
			<template #controls>
				<kv-button
					value="No"
					id="cancel-subscription-no"
					variant="secondary"
					@click="showLightbox = false"
				>
					No, keep it
				</kv-button>
				<kv-button
					value="Yes"
					id="cancel-subscription-yes"
					@click="cancelSubscription"
				>
					Yes, cancel my {{ confirmationText }}
				</kv-button>
			</template>
		</kv-lightbox>

		<!-- Save button  -->
		<div class="row column" v-if="isChanged">
			<kv-button
				data-test="subscriptions-save-button"
				:state="isSaving ? 'loading' : ''"
				@click="saveSubscription"
			>
				Save
			</kv-button>
		</div>

		<kv-loading-overlay
			v-if="showLoadingOverlay"
		/>
	</div>
</template>

<script>
import { gql } from 'graphql-tag';

import KvLoadingOverlay from '#src/components/Kv/KvLoadingOverlay';

import SubscriptionsMonthlyGood from '#src/components/Subscriptions/SubscriptionsMonthlyGood';
import SubscriptionsAutoDeposit from '#src/components/Subscriptions/SubscriptionsAutoDeposit';
import SubscriptionsLegacy from '#src/components/Subscriptions/SubscriptionsLegacy';
import { KvButton, KvLightbox } from '@kiva/kv-components';

const pageQuery = gql`query subscriptionSettingsPage {
	my {
		id
		autoDeposit {
			id
			isSubscriber
		}
		subscriptions {
			values {
				id
			}
		}
	}
	mySubscriptions(includeDisabled: false) {
		values {
			id
			enabled
			category {
				id
				subscriptionType
			}
		}
	}
}`;

export default {
	name: 'SubscriptionsSettingsCards',
	components: {
		KvButton,
		KvLightbox,
		KvLoadingOverlay,
		SubscriptionsAutoDeposit,
		SubscriptionsLegacy,
		SubscriptionsMonthlyGood,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			confirmationText: '',
			isChanged: false,
			isLegacySubscriber: false,
			isMonthlyGoodSubscriber: false,
			isSaving: false,
			showLightbox: false,
			showLoadingOverlay: false,
			hasModernSub: false,

		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.isMonthlyGoodSubscriber = data?.my?.autoDeposit?.isSubscriber ?? false;

			const legacySubs = data?.my?.subscriptions?.values ?? [];
			this.isLegacySubscriber = legacySubs.length > 0;

			const modernSubscriptions = data?.mySubscriptions?.values ?? [];
			this.hasModernSub = modernSubscriptions.length !== 0;
		},
	},
	mounted() {
		window.addEventListener('beforeunload', this.onLeave);
	},
	beforeUnmount() {
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
			if (this.$refs?.subscriptionsMonthlyGoodComponent?.isChanged) {
				this.$refs.subscriptionsMonthlyGoodComponent.saveMonthlyGood().finally(() => {
					this.isSaving = false;
				});
			}
			if (this.$refs?.subscriptionsAutoDepositComponent?.isChanged) {
				this.$refs.subscriptionsAutoDepositComponent.saveAutoDeposit().finally(() => {
					this.isSaving = false;
				});
			}
		}
	},
};
</script>

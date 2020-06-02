<template>
	<div>
		<!-- One Time Settings -->
		<subscriptions-one-time
			v-if="isMonthlyGoodSubscriber && isOnetime"
			@cancel-subscription="showConfirmationPrompt('Contribution')"
		/>

		<!-- Monthly Good Settings -->
		<subscriptions-monthly-good v-if="!isOnetime" @cancel-subscription="showConfirmationPrompt('Monthly Good')" />

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
		<!-- Auto Deposit Settings -->
		<!-- TODO -->
		<!-- <subscriptions-autodeposit /> -->

		<!-- <div class="row column save-button-area">
			<save-button v-if="isChanged" />
		</div> -->
	</div>
</template>

<script>
// ! TODO
// * Implement behavior when edit modals are opened, values changed, then modal closed without saving
// * Implement possible 'are you sure you want to leave' warnings
import _get from 'lodash/get';
import gql from 'graphql-tag';

import SubscriptionsMonthlyGood from './SubscriptionsMonthlyGood';
import SubscriptionsOneTime from './SubscriptionsOneTime';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvButton from '@/components/Kv/KvButton';

const pageQuery = gql`{
	my {
		autoDeposit {
			isSubscriber
			isOnetime
		}
	}
}`;

export default {
	components: {
		KvButton,
		KvLightbox,
		SubscriptionsMonthlyGood,
		SubscriptionsOneTime,
	},
	inject: ['apollo'],
	data() {
		return {
			isChanged: false,
			isMonthlyGoodSubscriber: false,
			isOnetime: false,
			confirmationText: '',
			showLightbox: false,
		};
	},
	apollo: {
		query: pageQuery,
		preFetch(config, client) {
			return client.query({
				query: pageQuery
			});
		},
		result({ data }) {
			console.log(data, 'data');
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			if (this.isMonthlyGoodSubscriber) {
				this.isOnetime = _get(data, 'my.autoDeposit.isOnetime', false);
			}
			console.log(this.apollo);
		},
	},
	// mounted() {
	// 	window.addEventListener('beforeunload', this.onLeave);
	// },
	// beforeDestroy() {
	// 	window.removeEventListener('beforeunload', this.onLeave);
	// },
	methods: {
		cancelSubscription() {
			this.apollo.mutate({
				mutation: gql`mutation { my { cancelAutoDeposit } }`,
				awaitRefetchQueries: true,
				refetchQueries: [
					{ query: pageQuery }
				]
			}).then(() => {
				this.$showTipMsg('Subscription Cancelled');
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
		// onLeave(event) {
		// 	if (this.isChanged) {
		// 		// eslint-disable-next-line no-param-reassign
		// 		event.returnValue = 'You have unsaved settings! Are you sure you want to leave?';
		// 	}
		// },
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

// ! TODO clean up CSS below this line
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

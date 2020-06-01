<template>
	<div>
		<!-- One Time Settings -->
		<subscriptions-one-time v-if="isMonthlyGoodSubscriber && isOnetime" @cancel-subscription="cancelSubscription" />

		<!-- Monthly Good Settings -->
		<subscriptions-monthly-good v-if="!isOnetime" @cancel-subscription="cancelSubscription" />


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
		SubscriptionsMonthlyGood,
		SubscriptionsOneTime
	},
	inject: ['apollo'],
	data() {
		return {
			isChanged: false,
			isMonthlyGoodSubscriber: false,
			isOnetime: false,
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
			this.isMonthlyGoodSubscriber = _get(data, 'my.autoDeposit.isSubscriber', false);
			if (this.isMonthlyGoodSubscriber) {
				this.isOnetime = _get(data, 'my.autoDeposit.isOnetime', false);
			}
		},
	},
	mounted() {
		window.addEventListener('beforeunload', this.onLeave);
	},
	beforeDestroy() {
		window.removeEventListener('beforeunload', this.onLeave);
	},
	methods: {
		cancelSubscription() {
			// ! TODO cancel subscription here
			console.log('subscription cancelled');
		},
		onLeave(event) {
			if (this.isChanged) {
				// eslint-disable-next-line no-param-reassign
				event.returnValue = 'You have unsaved settings! Are you sure you want to leave?';
			}
		},
	},
};
</script>

// ! TODO clean up CSS
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

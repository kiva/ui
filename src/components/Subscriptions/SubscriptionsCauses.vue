<template>
	<div class="row">
		<kv-settings-card class="column large-8" :title="causeName + ' Subscription'">
			<template #content>
				<div>
					<p>
						<kv-button class="text-link"
							@click.native.prevent="showCancelLightbox = true"
							v-kv-track-event="[
								'Causes',
								'click-cancel-cause-subscription',
								`Cancel ${causeName} Subscription`
							]"
						>
							Cancel Subscription
						</kv-button>
					</p>

					<!-- Cause Cancellation Flow -->
					<subscriptions-causes-cancellation-flow
						:show-cancel-lightbox="showCancelLightbox"
						:subscription-id="subscriptionId"
						@confirm-cancel="$emit('cancel-subscription', subscriptionId); showCancelLightbox = false;"
						@abort-cancel="showCancelLightbox = false"
					/>
				</div>
			</template>
		</kv-settings-card>
	</div>
</template>

<script>
/**  TODO - Future enhancement to this component would be
* to possibly handle the case of multiple enabled subscriptions */
import gql from 'graphql-tag';

import KvButton from '@/components/Kv/KvButton';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import SubscriptionsCausesCancellationFlow from
	'@/components/Subscriptions/SubscriptionsCausesCancellationFlow';

const pageQuery = gql`query causeSubscription {
	mySubscriptions(includeDisabled: false) {
		values {
			id
			enabled
			category {
				id
				subscriptionType
				name
			}
		}
	}
}`;

export default {
	inject: ['apollo', 'cookieStore'],
	components: {
		KvButton,
		KvSettingsCard,
		SubscriptionsCausesCancellationFlow,
	},
	data() {
		return {
			causeName: '',
			showCancelLightbox: false,
			subscriptionId: ''
		};
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.causeName = data?.mySubscriptions?.values?.[0]?.category?.name ?? '';
			this.subscriptionId = data?.mySubscriptions?.values?.[0]?.id ?? '';
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.mg-update-lightbox {
	&__content {
		overflow: hidden;
		max-width: 100%;
		margin: 1.5rem 0 0;

		@include breakpoint('large') {
			width: rem-calc(530);
		}

		@include breakpoint('xxlarge') {
			width: rem-calc(620);
		}
	}

	&__form,
	&__payment-method {
		padding-left: 0.5rem;
	}

	&__payment-method {
		padding-right: 2rem;
		margin-bottom: 2rem;
	}

	&__dropin-payment-wrapper {
		margin: 1rem 0 0;
		padding-left: 0.5rem;
	}

	&__current-payment-method {
		margin: 1rem 0;
	}

	&__cc-icon {
		height: 1.5rem;
		margin-top: -0.33rem;
	}

	.arrow {
		stroke: $blue;
		width: rem-calc(13);
		height: rem-calc(9);

		&.back-arrow {
			transform: rotate(90deg);
		}
	}

	.button--link {
		color: $kiva-accent-blue;
		fill: $kiva-accent-blue;
		cursor: pointer;
		padding: 0.5rem;
	}

	.icon-pencil {
		height: 1rem;
		width: 1rem;
	}
}
</style>

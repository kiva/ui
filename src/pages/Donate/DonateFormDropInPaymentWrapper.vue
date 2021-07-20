<template>
	<div class="donate-form-dropin-payment-wrapper row">
		<div v-if="!completed" class="small-12 columns">
			<kv-button
				v-if="!isLoggedIn"
				class="smaller submit-btn"
				:href="loginHref"
				v-kv-track-event="['Donate form', 'click-login', 'Sign in to set up']"
			>
				Sign in to set up
			</kv-button>
			<kv-alert
				v-if="isLoggedIn && hasExistingAutoDeposit"
				variant="caution"
			>
				{{ existingAutoDepositAlertCopy }}
				<router-link to="/settings/subscriptions">
					subscription settings
				</router-link>.
			</kv-alert>
			<braintree-drop-in-interface
				v-if="isClientReady && isLoggedIn && !hasExistingAutoDeposit"
				ref="braintreeDropInInterface"
				:amount="donateAmountAsString"
				flow="vault"
				:payment-types="['paypal', 'card']"
				:preselect-vaulted-payment-method="true"
				@transactions-enabled="enableConfirmButton = $event"
			/>
			<kv-button
				v-if="isLoggedIn && !hasExistingAutoDeposit"
				class="dropin-submit"
				:id="`${id}-dropin-submit`"
				:disabled="!enableConfirmButton || submitting"
				@click.native="submitDropInAutoDeposit"
				v-kv-track-event="['Donate form', 'click-save-monthly-donation', 'Save Monthly Donation']"
			>
				<kv-icon name="lock" />
				Save Monthly Donation
				<kv-loading-spinner v-if="submitting" />
			</kv-button>
			<div
				class="attribution-text text-center"
				v-if="isLoggedIn && !hasExistingAutoDeposit"
				v-html="disclaimer"
			></div>
		</div>
		<div v-else class="dropin-payment-thanks small-12 columns">
			<hr>
			<br>
			<h3>
				Thanks! Every month you'll get an email confirming your ${{ donateAmountAsString }} donation!
			</h3>
			<p>
				Visit your
				<router-link to="/settings/subscriptions">
					subscription settings
				</router-link>
				page to review and or make adjustments.
			</p>
		</div>
	</div>
</template>

<script>
import gql from 'graphql-tag';
import numeral from 'numeral';
import * as Sentry from '@sentry/browser';

import braintreeDropInError from '@/plugins/braintree-dropin-error-mixin';

import braintreeCreateAutoDepositSubscription from '@/graphql/mutation/braintreeCreateAutoDepositSubscription.graphql';

import KvAlert from '@/components/Kv/KvAlert';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		BraintreeDropInInterface: () => import('@/components/Payment/BraintreeDropInInterface'),
		KvAlert,
		KvButton,
		KvIcon,
		KvLoadingSpinner
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [braintreeDropInError],
	props: {
		disclaimer: {
			type: String,
			required: true,
		},
		donateAmount: {
			type: Number,
			default: 0
		},
		id: { // used when you have multiple instances of this form on one page.
			type: String,
			default: 'instance1',
		},
	},
	data() {
		return {
			dayOfMonth: new Date().getDate(),
			enableConfirmButton: false,
			submitting: false,
			isLoggedIn: false,
			isInMonthlyGood: false,
			hasExistingAutoDeposit: false,
			completed: false,
			isClientReady: false,
		};
	},
	apollo: {
		preFetch: true,
		query: gql`query donateForm {
			my {
				userAccount {
					id
				}
				subscriptions {
					totalCount
				}
				autoDeposit {
					id
					isSubscriber
				}
			}
		}`,
		result({ data }) {
			this.isLoggedIn = !!data?.my?.userAccount?.id;
			this.isInMonthlyGood = !!data?.my?.autoDeposit?.isSubscriber;
			this.hasExistingAutoDeposit = this.isInMonthlyGood
				|| data?.my?.subscriptions?.totalCount > 0
				|| !!data?.my?.autoDeposit?.id;
		},
	},
	computed: {
		donateAmountAsString() {
			return numeral(this.donateAmount).format('0.00');
		},
		existingAutoDepositAlertCopy() {
			if (this.isInMonthlyGood) {
				return 'Auto Deposit is not available to Monthly Good subscribers. Changes can be made in your ';
			}
			return 'You already have an existing auto deposit. Changes can be made in your ';
		},
		loginHref() {
			const doneUrl = `${this.$route.fullPath}?setMonthly=true`;
			return `/ui-login?force=true&doneUrl=${encodeURIComponent(doneUrl)}`;
		},
	},
	mounted() {
		this.isClientReady = !this.$isServer;
	},
	methods: {
		submitDropInAutoDeposit() {
			this.submitting = true;

			// request payment method
			this.$refs.braintreeDropInInterface.btDropinInstance.requestPaymentMethod()
				.then(btSubmitResponse => {
					const transactionNonce = btSubmitResponse?.nonce;
					const deviceData = btSubmitResponse?.deviceData;
					const paymentType = btSubmitResponse?.type;
					if (transactionNonce) {
						this.doBraintreeAutoDeposit(transactionNonce, deviceData, paymentType);
					}
				}).catch(btSubmitError => {
					console.error(btSubmitError);
					// TODO: alert user about error?
					// Fire specific exception to Sentry/Raven
					Sentry.withScope(scope => {
						scope.setTag('bt_stage_dropin', 'btRequestPaymentMethodCatch');
						scope.setTag('bt_basket_validation_error', btSubmitError);
						Sentry.captureException(btSubmitError);
					});
				});
		},
		doBraintreeAutoDeposit(nonce, deviceData, paymentType) {
			// Apollo call to the query mutation
			this.apollo.mutate({
				mutation: braintreeCreateAutoDepositSubscription,
				variables: {
					paymentMethodNonce: nonce,
					amount: this.donateAmountAsString,
					donateAmount: this.donateAmountAsString,
					dayOfMonth: numeral(this.dayOfMonth).value(),
					deviceData,
				}
			}).then(kivaBraintreeResponse => {
				// Check for errors in transaction
				if (kivaBraintreeResponse.errors) {
					this.processBraintreeDropInError('Donate form', kivaBraintreeResponse);
					// Payment method failed, unselect attempted payment method
					this.$refs.braintreeDropInInterface.btDropinInstance.clearSelectedPaymentMethod();
					// exit
					return kivaBraintreeResponse;
				}

				// Transaction is complete
				const subscriptionCreatedSuccessfully = kivaBraintreeResponse.data?.my?.createAutoDeposit?.status;

				if (subscriptionCreatedSuccessfully === 'active') {
					// fire BT Success event
					this.$kvTrackEvent(
						'Donate form',
						`${paymentType} Braintree DropIn Subscription Payment`,
						'Save Monthly Donation'
					);
					this.completed = true;
					this.$emit('completed');
				}
				return kivaBraintreeResponse;
			}).finally(() => {
				this.submitting = false;
			});
		},
	}
};
</script>

<style lang="scss">
@import "settings";

.donate-form-dropin-payment-wrapper {
	.dropin-submit {
		width: 100%;
		font-size: 1.25rem;
		margin-top: 1rem;

		.icon-lock {
			height: rem-calc(20);
			width: rem-calc(20);
			fill: white;
			top: rem-calc(3);
			position: relative;
			margin-right: rem-calc(8);
		}

		.loading-spinner {
			vertical-align: middle;
			width: 1rem;
			height: 1rem;
		}

		.loading-spinner .line {
			background-color: $white;
		}
	}

	.dropin-payment-thanks {
		h3 {
			font-weight: 500;
		}
	}
}
</style>

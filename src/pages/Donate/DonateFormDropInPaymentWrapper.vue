<template>
	<div class="dropin-payment-holder">
		<div v-if="!completed">
			<kv-button
				v-if="!isLoggedIn"
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
			<div id="dropin-submit" class="tw-w-full">
				<kv-button
					v-if="isLoggedIn && !hasExistingAutoDeposit"
					class="tw-w-full tw-mb-2"
					:state="submitButtonState"
					@click="submitDropInAutoDeposit"
					v-kv-track-event="['Donate form', 'click-save-monthly-donation', 'Save Monthly Donation']"
				>
					<kv-icon name="lock" />
					Save Monthly Donation
				</kv-button>
			</div>
			<div
				class="tw-text-small tw-text-secondary tw-text-center tw-px-2"
				v-if="isLoggedIn && !hasExistingAutoDeposit"
				v-html="disclaimer"
			></div>
		</div>
		<div v-else>
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
import { gql } from '@apollo/client';
import numeral from 'numeral';
import * as Sentry from '@sentry/vue';

import braintreeDropInError from '@/plugins/braintree-dropin-error-mixin';

import braintreeCreateAutoDepositSubscription from '@/graphql/mutation/braintreeCreateAutoDepositSubscription.graphql';

import KvAlert from '@/components/Kv/KvAlert';
import KvIcon from '@/components/Kv/KvIcon';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'DonateFormDropInPaymentWrapper',
	components: {
		BraintreeDropInInterface: () => import('@/components/Payment/BraintreeDropInInterface'),
		KvAlert,
		KvButton,
		KvIcon,
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
		submitButtonState() {
			if (!this.enableConfirmButton) {
				return 'disabled';
			}
			if (this.submitting) {
				return 'loading';
			}
			return '';
		}
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
					this.submitting = false;
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

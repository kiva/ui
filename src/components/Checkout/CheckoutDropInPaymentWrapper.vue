<template>
	<div class="tw-flex tw-justify-center md:tw-justify-end">
		<div class="dropin-payment-holder" style="padding: 0; max-width: 20rem;">
			<braintree-drop-in-interface
				v-if="isClientReady"
				ref="braintreeDropInInterface"
				:amount="amount"
				flow="checkout"
				:payment-types="paymentTypes"
				:preselect-vaulted-payment-method="!isGuestCheckout"
				:auth="isGuestCheckout ? 'token-key' : 'client-token'"
				@transactions-enabled="enableCheckoutButton = $event"
			/>
			<div v-if="isGuestCheckout" id="guest-checkout">
				<label
					class="input-label tw-font-medium tw-block tw-my-2"
					for="email"
					v-if="!promoGuestCheckoutEnabled"
				>
					Where should we email your receipt?
				</label>
				<label
					class="input-label tw-font-medium tw-block tw-my-2"
					for="email"
					v-else
				>
					What is your email?
				</label>
				<div
					class="input-label tw-text-small tw-text-secondary tw-block tw-my-2"
					for="email"
					v-if="promoGuestCheckoutEnabled"
				>
					Kiva will share your information with {{ promoName ? promoName : 'your company' }}
					to let them know you’ve redeemed your credits
				</div>
				<kv-text-input
					type="email"
					name="email"
					v-model="email"
					ref="email"
					data-testid="basket-guest-email-input"
					id="email"
					class="data-hj-suppress tw-mb-2 tw-w-full"
					@focus="$kvTrackEvent(
						'basket',
						'click-email-receipt-field',
						'Where should we email your receipt?'
					)"
				/>
				<p v-if="promoGuestCheckoutEnabled && v$.email?.$error">
					Valid campaign email required
				</p>
				<p v-else-if="v$.email?.$error" class="input-error tw-text-danger tw-text-base tw-mb-2">
					Valid email required.
				</p>
				<user-updates-preference
					v-if="enableRadioBtnExperiment"
					tracking-category="basket"
					@update:model-value="selectedComms = $event"
					is-checkout
				/>
				<template v-else>
					<kv-checkbox
						data-testid="basket-guest-terms-agreement"
						id="termsAgreement"
						name="termsAgreement"
						class="checkbox tw-text-small tw-mb-2"
						v-model="termsAgreement"
						@update:model-value="$kvTrackEvent(
							'basket',
							'click',
							'terms-of-use',
							'I have read and agree to the Terms of Use and Privacy Policy',
							$event ? 1 : 0
						)"
					>
						I have read and agree to the
						<a
							:href="`https://${$appConfig.host}/legal/terms`"
							target="_blank"
							title="Open Terms of Use in a new window"
						>Terms of Use</a>
						and
						<a
							:href="`https://${$appConfig.host}/legal/privacy`"
							target="_blank"
							:title="`Open Privacy ${enableCommsExperiment ? 'Notice' : 'Policy' } in a new window`"
						>Privacy {{ enableCommsExperiment ? 'Notice' : 'Policy' }}</a>.
						Preferences can be managed in settings.
						<p v-if="v$.termsAgreement?.$error" class="input-error tw-text-danger tw-text-base">
							You must agree to the Kiva Terms of service & Privacy
							{{ enableCommsExperiment ? 'Notice' : 'Policy' }}.
						</p>
					</kv-checkbox>
					<kv-checkbox
						data-testid="basket-guest-email-updates"
						id="emailUpdates"
						class="checkbox tw-text-small tw-mb-2"
						name="emailUpdates"
						v-model="emailUpdates"
						@update:model-value="$kvTrackEvent(
							'basket',
							'click',
							'marketing-updates',
							emailUpdatesCopy,
							$event ? 1 : 0
						)"
					>
						{{ emailUpdatesCopy }}
					</kv-checkbox>
				</template>
			</div>
			<div id="dropin-button">
				<kv-button
					value="submit"
					id="dropin-submit"
					data-testid="basket-dropin-submit"
					class="tw-mb-2"
					:state="`${!enableCheckoutButton ? 'disabled' : ''}`"
					@click="submit"
				>
					Complete order
				</kv-button>
			</div>
			<p class="dropin-wrapper-attribution-text">
				Thanks to PayPal, Kiva receives free payment processing for all
				loans.
			</p>
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import { useVuelidate } from '@vuelidate/core';
import { required, email, requiredIf } from '@vuelidate/validators';
import * as Sentry from '@sentry/vue';
import { defineAsyncComponent } from 'vue';

import checkoutUtils from '#src/plugins/checkout-utils-mixin';
import braintreeDropInError from '#src/plugins/braintree-dropin-error-mixin';

import braintreeDepositAndCheckout from '#src/graphql/mutation/braintreeDepositAndCheckout.graphql';
import braintreeDepositAndCheckoutAsync from '#src/graphql/mutation/braintreeDepositAndCheckoutAsync.graphql';

import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import UserUpdatesPreference from '#src/components/Checkout/UserUpdatesPreference';
import { pollForFinishedCheckout } from '@kiva/kv-shop';
import { KvButton, KvCheckbox, KvTextInput } from '@kiva/kv-components';

const COMMS_OPT_IN_EXP_KEY = 'opt_in_comms';

export default {
	name: 'CheckoutDropInPaymentWrapper',
	components: {
		KvButton,
		BraintreeDropInInterface: defineAsyncComponent(() => import(
			'#src/components/Payment/BraintreeDropInInterface'
		)),
		KvCheckbox,
		KvTextInput,
		UserUpdatesPreference,
	},
	provide() {
		return {
			v$: this.v$
		};
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [checkoutUtils, braintreeDropInError],
	emits: ['complete-transaction', 'updating-totals', 'refreshtotals', 'opt-in'],
	props: {
		amount: {
			type: String,
			default: '',
		},
		isGuestCheckout: {
			type: Boolean,
			default: false,
		},
		promoGuestCheckoutEnabled: {
			type: Boolean,
			default: false,
		},
		useAsyncCheckout: {
			type: Boolean,
			default: false
		},
		loansInBasket: {
			type: Number,
			default: 0,
		}
	},
	data() {
		return {
			email: null,
			termsAgreement: false,
			emailUpdates: false,
			enableCheckoutButton: false,
			isClientReady: false,
			paymentTypes: ['paypal', 'card', 'applePay', 'googlePay'],
			enableCommsExperiment: false,
			selectedComms: false,
			enableRadioBtnExperiment: false,
		};
	},
	setup() { return { v$: useVuelidate() }; },
	validations() {
		return {
			email: {
				required,
				email,
			},
			termsAgreement: {
				required: value => value === true,
			},
			selectedComms: {
				required: requiredIf(enableRadioBtnExperiment => enableRadioBtnExperiment),
			},
		};
	},
	mounted() {
		this.isClientReady = typeof window !== 'undefined';
	},
	methods: {
		submit() {
			this.$kvTrackEvent('basket', 'click', 'braintree-checkout-button');
			if (this.isGuestCheckout) {
				this.v$.$touch();
				if (!this.v$.$invalid) {
					this.validateGuestBasketAndCheckout();
				}
			} else {
				this.validateBasketAndCheckout();
			}
		},
		validateGuestBasketAndCheckout() {
			this.$emit('updating-totals', true);
			// Set the default checkout validation method
			let validationMethod = this.validateGuestBasket;

			// Set email updates based on comms preference MP-271
			let { emailUpdates } = this;
			if (this.enableRadioBtnExperiment) {
				emailUpdates = this.selectedComms === 'on';
			}
			this.$emit('opt-in', emailUpdates);

			const validationPayload = {
				email: this.email,
				emailUpdates,
			};
			// If promo guest checkout is enabled, use the promo guest checkout validation method.
			// This method validates the lender email for promo first before running the guest checkout method
			// in checkout utils.
			if (this.promoGuestCheckoutEnabled) {
				validationMethod = this.validateGuestPromoBasket;
				validationPayload.promoFundId = this.promoFundId;
				validationPayload.managedAccountId = this.managedAccountId;
			}

			validationMethod(this.email, emailUpdates)
				.then(validationStatus => {
					if (validationStatus === true) {
						this.submitDropInPayment();
					} else {
						const errorMessage = _get(
							validationStatus,
							'[0].error'
						);
						if (errorMessage === 'api.authenticationRequired') {
							const loginHint = encodeURIComponent(
								`login|${JSON.stringify({
									msg: 're-auth-acc-exists',
								})}`
							);
							window.location = `/ui-login?force=true&doneUrl=/checkout&loginHint=${loginHint}`;
						} else {
							this.$emit('updating-totals', false);
							this.showCheckoutError(validationStatus);
							this.$emit('refreshtotals');
						}
					}
					return validationStatus;
				})
				.catch(error => {
					this.$emit('updating-totals', false);
					const errorCode = _get(error, 'errors[0].code');
					const errorMessage = _get(error, 'errors[0].message');

					Sentry.withScope(scope => {
						scope.setTag(
							'bt_stage_dropin',
							'btSubmitValidationCatch'
						);
						scope.setTag(
							'bt_basket_validation_error',
							errorMessage
						);
						Sentry.captureException(errorCode);
					});
				});
		},
		validateBasketAndCheckout() {
			this.$emit('updating-totals', true);
			// Validate Basket prior to starting
			this.validateBasket()
				.then(validationStatus => {
					if (validationStatus === true) {
						// request payment method
						this.submitDropInPayment();
					} else {
						// validation failed
						this.$emit('updating-totals', false);
						this.showCheckoutError(validationStatus);
						this.$emit('refreshtotals');
					}
					return validationStatus;
				})
				.catch(error => {
					this.$emit('updating-totals', false);
					const errorCode = _get(error, 'errors[0].code');
					const errorMessage = _get(error, 'errors[0].message');

					// Fire specific exception to Sentry/Raven
					Sentry.withScope(scope => {
						scope.setTag(
							'bt_stage_dropin',
							'btSubmitValidationCatch'
						);
						scope.setTag(
							'bt_basket_validation_error',
							errorMessage
						);
						Sentry.captureException(errorCode);
					});
				});
		},
		submitDropInPayment() {
			// request payment method
			this.$refs.braintreeDropInInterface.btDropinInstance
				.requestPaymentMethod()
				.then(btSubmitResponse => {
					const transactionNonce = btSubmitResponse?.nonce;
					const deviceData = btSubmitResponse?.deviceData;
					const paymentType = btSubmitResponse?.type;
					if (transactionNonce) {
						this.doBraintreeCheckout(
							transactionNonce,
							deviceData,
							paymentType
						);
					}
				})
				.catch(btSubmitError => {
					this.$emit('updating-totals', false);
					console.error(btSubmitError);
					// Fire specific exception to Sentry/Raven
					Sentry.withScope(scope => {
						scope.setTag(
							'bt_stage_dropin',
							'btRequestPaymentMethodCatch'
						);
						scope.setTag(
							'bt_basket_validation_error',
							btSubmitError
						);
						Sentry.captureException(btSubmitError);
					});
				});
		},
		doBraintreeCheckout(nonce, deviceData, paymentType) {
			// Apollo call to the query mutation
			this.apollo
				.mutate({
					mutation: this.useAsyncCheckout ? braintreeDepositAndCheckoutAsync : braintreeDepositAndCheckout,
					variables: {
						amount: numeral(this.amount).format('0.00'),
						nonce,
						deviceData,
						savePaymentMethod: false, // save payment methods handled by braintree drop in UI
						visitorId: this.cookieStore.get('uiv') || null
					},
				})
				.then(async kivaBraintreeResponse => {
					// extract transaction saga id or transaction id from response
					const transactionResponse = this.useAsyncCheckout
						? kivaBraintreeResponse?.data?.shop?.doNoncePaymentDepositAndCheckoutAsync
						: kivaBraintreeResponse?.data?.shop?.doNoncePaymentDepositAndCheckout;

					// Handle async checkout polling process + response
					if (this.useAsyncCheckout && typeof transactionResponse !== 'object') {
						await pollForFinishedCheckout({
							apollo: this.apollo,
							transactionSagaId: transactionResponse,
						})
							.then(checkoutStatusResponse => {
								// eslint-disable-next-line max-len
								const checkoutId = checkoutStatusResponse?.data?.checkoutStatus?.receipt?.checkoutId ?? null;
								if (!checkoutId) {
									// setup default graphql error response
									let errors = checkoutStatusResponse?.errors ?? null;
									// check for checkoutStatus specific errors
									if (
										checkoutStatusResponse?.data?.checkoutStatus?.errorCode
										|| checkoutStatusResponse?.data?.checkoutStatus?.errorMessage
									) {
										// eslint-disable-next-line max-len
										errors = this.formatCheckoutStatusError(checkoutStatusResponse?.data?.checkoutStatus);
									}
									this.handleFailedCheckout(errors);
								} else {
									this.handleSuccessfulCheckout(checkoutId);
								}
							}).catch(errorResponse => {
								// setup default graphql error response
								let errors = errorResponse?.errors ?? null;
								// check for checkoutStatus specific errors
								if (
									errorResponse?.data?.checkoutStatus?.errorCode
									|| errorResponse?.data?.checkoutStatus?.errorMessage
								) {
									errors = this.formatCheckoutStatusError(errorResponse?.data?.checkoutStatus);
								}
								this.handleFailedCheckout(errors);
							});

						return kivaBraintreeResponse;
					}

					// Handle transaction errors for either checkout path
					if (kivaBraintreeResponse.errors) {
						this.handleFailedCheckout(kivaBraintreeResponse);
						return kivaBraintreeResponse;
					}

					// Handle success for sync checkout
					if (!this.useAsyncCheckout) {
						this.handleSuccessfulCheckout(transactionResponse, paymentType);
						return kivaBraintreeResponse;
					}
				});
		},
		handleSuccessfulCheckout(transactionId, paymentType) {
			// redirect to thanks with KIVA transaction id
			if (transactionId) {
				// fire BT Success event
				this.$kvTrackEvent(
					'basket',
					`${paymentType} Braintree DropIn Payment`,
					'Success',
					transactionId,
					transactionId
				);
				// Complete transaction handles additional analytics + redirect
				this.$emit('complete-transaction', { transactionId, username: this.email });
			}
		},
		handleFailedCheckout(kivaBraintreeResponse) {
			this.$emit('updating-totals', false);
			this.processBraintreeDropInError('basket', kivaBraintreeResponse);
			// Payment method failed, unselect attempted payment method
			this.$refs.braintreeDropInInterface.btDropinInstance.clearSelectedPaymentMethod();
			// Initialize a refresh of basket state
			this.$emit('refreshtotals');
		},
	},
	computed: {
		emailUpdatesCopy() {
			return this.enableCommsExperiment
				? 'Send me updates from people I\'ve funded, my impact, and other ways I can help.'
				// eslint-disable-next-line max-len
				: 'Receive email updates from Kiva (including borrower updates and promos). You can unsubscribe anytime.';
		}
	},
	created() {
		if (this.isGuestCheckout && this.loansInBasket) {
			const { version } = this.apollo.readFragment({
				id: `Experiment:${COMMS_OPT_IN_EXP_KEY}`,
				fragment: experimentVersionFragment,
			}) ?? {};

			trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'basket',
				COMMS_OPT_IN_EXP_KEY,
				'EXP-MP-271-May2024'
			);

			if (version === 'b') {
				this.enableCommsExperiment = true;
			}
			if (version === 'c') {
				this.enableRadioBtnExperiment = true;

				// Workaround to validate input within this experiment
				this.selectedComms = '';
				this.termsAgreement = true;
			}
		}
	}
};
</script>

<style lang="postcss" scoped>

.radio-error :deep(label > div) {
	@apply tw-border-danger-highlight;
}

</style>

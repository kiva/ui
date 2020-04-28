<template>
	<div>
		<div class="payment-holder small-12 medium-7 large-6">
			<div id="dropin-container"></div>
			<div id="dropin-button" v-if="showCheckoutButton">
				<kv-button
					value="submit"
					id="dropin-submit"
					class="button"
					@click.native="validateBasketAndCheckout"
				>
					<kv-icon name="lock" />
					Checkout
				</kv-button>
			</div>

			<loading-overlay
				v-show="updatingPaymentWrapper"
				id="payment-updating-overlay"
				class="updating-totals-overlay"
			/>
		</div>
		<div class="attribution-text small-12 medium-7 large-6">
			Thanks to PayPal powered by Braintree,
			Kiva receives free payment processing for all loans.
		</div>
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import * as Sentry from '@sentry/browser';
import Dropin from 'braintree-web-drop-in';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import getClientToken from '@/graphql/query/checkout/getClientToken.graphql';
import braintreeDepositAndCheckout from '@/graphql/mutation/braintreeDepositAndCheckout.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import LoadingOverlay from '@/pages/Lend/LoadingOverlay';

// TODO: Wire up deviceData
// TODO: Verify proper error handling and user feedback
// TODO: Audit and implement useful Sentry Error collection
// TODO: Add analytics for all actions within DropIn Ui
// TODO: Continue interface refinements + style cleanup

export default {
	components: {
		KvButton,
		KvIcon,
		LoadingOverlay,
	},
	inject: ['apollo'],
	mixins: [
		checkoutUtils
	],
	props: {
		amount: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			showCheckoutButton: false,
			btDropinInstance: () => {},
			clientToken: null,
			options: [
				{
					title: 'Pay with card',
					key: 'bt'
				},
				{
					title: 'Pay with PayPal',
					key: 'pp',
				},
			],
			selectedOption: 'bt',
			updatingPaymentWrapper: false,
		};
	},
	methods: {
		setUpdatingPaymentWrapper(state) {
			this.updatingPaymentWrapper = state;
		},
		initializePaymentOptions() {
			this.setUpdatingPaymentWrapper(true);
			this.apollo.query({
				query: getClientToken,
				variables: {
					amount: numeral(this.amount).format('0.00'),
					useCustomerId: true
				}
			}).then(response => {
				if (response.errors) {
					this.setUpdatingPaymentWrapper(false);
					console.error(response.errors);
					const errorCode = _get(response, 'errors[0].code');
					const errorMessage = _get(response, 'errors[0].message');

					Sentry.withScope(scope => {
						scope.setTag('bt_stage', 'btGetClientTokenError');
						scope.setTag('bt_get_client_token_error', errorMessage);
						Sentry.captureException(errorCode);
					});
				} else {
					this.clientToken = _get(response, 'data.shop.getClientToken');
					this.initializeDropIn();
				}
			});
		},
		initializeDropIn() {
			Dropin.create({
				authorization: this.clientToken,
				selector: '#dropin-container',
				card: {
					vault: {
						allowVaultCardOverride: true,
					},
				},
				paypal: {
					flow: 'checkout',
					amount: numeral(this.amount).format('0.00'),
					currency: 'USD',
					buttonStyle: {
						color: 'blue',
						shape: 'rect',
						size: (typeof window === 'object' && window.innerWidth > 480) ? 'medium' : 'responsive',
					}
				},
			}).then(btCreateInstance => {
				this.btDropinInstance = btCreateInstance;
				this.initializeDropInActions();
				this.setUpdatingPaymentWrapper(false);
				console.log(btCreateInstance);
			}).catch(btCreateError => {
				console.error(btCreateError);
			});
		},
		validateBasketAndCheckout() {
			console.log('clicked button');
			this.$emit('updating-totals', true);
			// Validate Basket prior to starting
			this.validateBasket()
				.then(validationStatus => {
					if (validationStatus === true) {
						// request payment method
						this.submitDropInPayment();
					} else {
						// validation failed
						this.setUpdating(false);
						this.showCheckoutError(validationStatus);
						this.$emit('refreshtotals');
					}
					return validationStatus;
				})
				.catch(error => {
					this.$emit('updating-totals', false);
					// const errorCode = _get(error, 'errors[0].code');
					// const errorMessage = _get(error, 'errors[0].message');
					console.error(error);

					// Fire specific exception to Sentry/Raven
					// Sentry.withScope(scope => {
					// 	scope.setTag('bt_stage', 'btSubmitValidationCatch');
					// 	scope.setTag('bt_basket_validation_error', errorMessage);
					// 	Sentry.captureException(errorCode);
					// });
				});
		},
		submitDropInPayment() {
			// request payment method
			console.log('attempting bt payment');
			this.btDropinInstance.requestPaymentMethod()
				.then(btSubmitResponse => {
					console.log(btSubmitResponse);
					const transactionNonce = _get(btSubmitResponse, 'nonce');
					if (typeof transactionNonce !== 'undefined') {
						this.doBraintreeCheckout(transactionNonce);
					}
				}).catch(btSubmitError => {
					console.error(btSubmitError);
				});
		},
		doBraintreeCheckout(nonce) {
			// Apollo call to the query mutation
			this.apollo.mutate({
				mutation: braintreeDepositAndCheckout,
				variables: {
					amount: numeral(this.amount).format('0.00'),
					nonce,
					// savePaymentMethod: this.storePaymentMethod,
					// deviceData: this.dataCollectorDeviceData,
				}
			}).then(kivaBraintreeResponse => {
				// Check for errors in transaction
				if (kivaBraintreeResponse.errors) {
					this.$emit('updating-totals', false);
					const errorCode = _get(kivaBraintreeResponse, 'errors[0].code');
					const errorMessage = _get(kivaBraintreeResponse, 'errors[0].message');
					const standardErrorCode = `(Braintree error: ${errorCode})`;
					const standardError = `There was an error processing your payment.
						Please try again. ${standardErrorCode}`;

					// Payment method failed, unselect attempted payment method
					this.btDropinInstance.clearSelectedPaymentMethod();
					// Potential error message: 'Transaction failed. Please select a different payment method.';

					this.$showTipMsg(standardError, 'error');

					// Fire specific exception to Sentry/Raven
					Sentry.withScope(scope => {
						scope.setTag('bt_stage', 'btDepositAndCheckout');
						scope.setTag('bt_kv_transaction_error', errorMessage);
						Sentry.captureException(errorCode);
					});

					// exit
					return kivaBraintreeResponse;
				}

				// Transaction is complete
				const transactionId = _get(
					kivaBraintreeResponse,
					'data.shop.doNoncePaymentDepositAndCheckout'
				);
				// redirect to thanks with KIVA transaction id
				if (transactionId) {
					// fire BT Success event
					this.$kvTrackEvent(
						'basket',
						'Braintree Payment',
						'Success',
						transactionId
					);
					// Complete transaction handles additional analytics + redirect
					this.$emit('complete-transaction', transactionId);
				}
				return kivaBraintreeResponse;
			});
		},
		initializeDropInActions() {
			// more info: https://developers.braintreepayments.com/guides/drop-in/customization/javascript/v3#events
			// https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#on

			// initial check for a "requestable" vaulted payment method
			if (this.btDropinInstance.isPaymentMethodRequestable()) {
				this.showCheckoutButton = true;
			}

			// listen for "requestable" payment method (ex. completing PayPal signin)
			// From the Docs:
			// - If your Drop-in integration has the postal code field, it will be considered valid after 3 characters
			// - (some international postal codes are 3 characters in length).
			this.btDropinInstance.on('paymentMethodRequestable', event => {
				console.log('payment method requestable - returns event');
				console.log(event);
				// TODO: add additional check for Postal Code validation during during new card input
				this.showCheckoutButton = true;
			});

			// listen for "non-requestable" payment method (ex. PayPal sign in flow)
			this.btDropinInstance.on('noPaymentMethodRequestable', () => {
				console.log('NO payment method requestable - returns nothing');
				this.showCheckoutButton = false;
			});

			// listen for "selected" payment option (ex. completion of PayPal sign in)
			this.btDropinInstance.on('paymentOptionSelected', event => {
				console.log('payment option selected - returns option');
				console.log(event);
			});
		}
	},
	mounted() {
		console.log(Dropin);
		this.initializePaymentOptions();
	}
};
</script>

<style lang="scss">
@import "settings";

// $form-border-radius: rem-calc(3);
$form-border-radius: 0.125rem;
$active-border-color: $input-checked-color;
$active-background-color: $white;
$inactive-border-color: rem-calc(1) solid $input-border-color;
$inactive-background-color: $platinum;
$icon-background-color: $input-checked-color;
$border-width: 1px;

.payment-holder {
	position: relative;
	display: inline-block;
	white-space: nowrap;
	text-align: center;
	border: none;
	// border: 1px solid $subtle-gray; //#c3c3c3
	padding: 0 0.6rem 1.25rem;
	// border-radius: $form-border-radius;
	margin: 3rem auto 0 auto;
	min-width: rem-calc(300);
	width: 100%;

	@include breakpoint(medium) {
		float: right;
		display: block;
	}

	@include breakpoint(large) {
		padding: 0 2rem 1.5rem;
	}

	.braintree-dropin {
		font-family: inherit;
	}

	.braintree-heading {
		color: $charcoal;
	}

	[data-braintree-id="methods-label"] {
		display: none;
	}

	[data-braintree-id="methods-container"] {
		.braintree-method {
			border-radius: $form-border-radius;
			border-color: $inactive-border-color;
			border-width: $border-width;
			// color: $tab-pill-color;
			// background: $tab-pill-background;
			// border: $tab-pill-border;
		}

		.braintree-method--active {
			border-color: $active-border-color;

			.braintree-method__check {
				background-color: $icon-background-color;
			}
		}

		.braintree-method__label {
			color: $charcoal;
		}
	}

	[data-braintree-id="lower-container"] {
		// [data-braintree-id="other-ways-to-pay"] {}
		[data-braintree-id="payment-options-container"] {
			.braintree-option {
				border-radius: $form-border-radius;
				border-color: $inactive-border-color;
				background: $inactive-background-color;

				.braintree-option__label {
					color: $charcoal;
					text-align: left;
				}

				&:hover {
					background: $active-background-color;
				}
			}
		}
	}

	[data-braintree-id="sheet-container"] {
		[data-braintree-id="paypal"],
		[data-braintree-id="card"] {
			border-radius: $form-border-radius;
			border-color: $inactive-border-color;
			background: $active-background-color;
		}
	}

	#dropin-submit {
		width: 100%;
		font-size: 1.25rem;

		.icon-lock {
			height: rem-calc(20);
			width: rem-calc(20);
			fill: white;
			top: rem-calc(3);
			position: relative;
			margin-right: rem-calc(8);
		}
	}

	.card-header {
		position: relative;
		top: -1.2rem;
		background: $ghost;
		display: inline-block;
		border-radius: $form-border-radius;
	}

	.card-title {
		padding: rem-calc(5) rem-calc(10);
	}

	.paypal-button {
		text-align: center;
		margin-top: rem-calc(25);
	}

	#payment-updating-overlay {
		margin-top: 1rem;
		z-index: 1000;
		width: auto;
		height: auto;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		background-color: rgba($white, 0.7);

		.spinner-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			position: initial;
			height: 100%;
			top: auto;
			left: auto;
			transform: none;
		}
	}
}

.attribution-text {
	color: $gray;
	float: right;
	clear: both;
	text-align: center;
	margin-top: rem-calc(25);
}
</style>

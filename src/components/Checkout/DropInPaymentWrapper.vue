<template>
	<div class="row align-right">
		<div class="payment-holder small-12 medium-10 medium-offset-1 large-offset-5 large-7 columns">
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
				v-if="updatingPaymentWrapper"
				id="payment-updating-overlay"
			/>
			<p class="attribution-text">
				Thanks to PayPal powered by Braintree,
				Kiva receives free payment processing for all loans.
			</p>
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

// TODO: Add analytics for all actions within DropIn Ui

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
						scope.setTag('bt_stage_dropin', 'btGetClientTokenError');
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
				container: '#dropin-container',
				dataCollector: {
					kount: true // Required if Kount fraud data collection is enabled
				},
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
						color: 'gold',
						shape: 'pill',
						size: (typeof window === 'object' && window.innerWidth > 480) ? 'medium' : 'responsive',
					}
				},
			}).then(btCreateInstance => {
				this.btDropinInstance = btCreateInstance;
				this.initializeDropInActions();
				this.setUpdatingPaymentWrapper(false);
			}).catch(btCreateError => {
				console.error(btCreateError);
				Sentry.withScope(scope => {
					scope.setTag('bt_stage_dropin', 'btCreateError');
					scope.setTag('bt_client_create_error', btCreateError.message);
					Sentry.captureException(btCreateError.code);
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
						this.setUpdating(false);
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
						scope.setTag('bt_stage_dropin', 'btSubmitValidationCatch');
						scope.setTag('bt_basket_validation_error', errorMessage);
						Sentry.captureException(errorCode);
					});
				});
		},
		submitDropInPayment() {
			// request payment method
			this.btDropinInstance.requestPaymentMethod()
				.then(btSubmitResponse => {
					const transactionNonce = _get(btSubmitResponse, 'nonce');
					const deviceData = _get(btSubmitResponse, 'deviceData');
					if (typeof transactionNonce !== 'undefined') {
						this.doBraintreeCheckout(transactionNonce, deviceData);
					}
				}).catch(btSubmitError => {
					console.error(btSubmitError);
					// Fire specific exception to Sentry/Raven
					Sentry.withScope(scope => {
						scope.setTag('bt_stage_dropin', 'btRequestPaymentMethodCatch');
						scope.setTag('bt_basket_validation_error', btSubmitError);
						Sentry.captureException(btSubmitError);
					});
				});
		},
		doBraintreeCheckout(nonce, deviceData) {
			// Apollo call to the query mutation
			this.apollo.mutate({
				mutation: braintreeDepositAndCheckout,
				variables: {
					amount: numeral(this.amount).format('0.00'),
					nonce,
					deviceData,
					savePaymentMethod: false, // save payment methods handled by braintree drop in UI
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
						scope.setTag('bt_stage_dropin', 'btDepositAndCheckout');
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
			// eslint-disable-next-line no-unused-vars
			this.btDropinInstance.on('paymentMethodRequestable', event => {
				// Returns event object { paymentMethodIsSelected, type}
				// TODO: add additional check for Postal Code validation during during new card input
				// From the Docs:
				// - If your Drop-in integration has the postal code field,
				// - it will be considered valid after 3 characters
				// - (some international postal codes are 3 characters in length).
				this.showCheckoutButton = true;
			});

			// listen for "non-requestable" payment method (ex. PayPal sign in flow)
			this.btDropinInstance.on('noPaymentMethodRequestable', () => {
				// Returns nothing
				this.showCheckoutButton = false;
			});

			// listen for "selected" payment option (ex. completion of PayPal sign in)
			// could be useful later
			// this.btDropinInstance.on('paymentOptionSelected', event => {
			// 	console.log('payment option selected - returns option');
			// 	console.log(event);
			// });
		}
	},
	mounted() {
		this.initializePaymentOptions();
	}
};
</script>

<style lang="scss" scoped>
@import "settings";

$form-border-radius: rem-calc(2);
$active-border-color: $input-checked-color;
$icon-background-color: $input-checked-color;
$border-width: 1px;

.payment-holder {
	text-align: left;
	padding: 0 0.6rem 1.25rem;
	margin-top: 3rem;

	@include breakpoint(large) {
		padding: 0 2rem 1.5rem;
	}

	.attribution-text {
		color: $kiva-text-light;
		text-align: center;
		margin-top: rem-calc(24);
		padding: 0 0.75rem;
	}

	::v-deep [data-braintree-id="choose-a-way-to-pay"],
	.attribution-text {
		font-size: $small-text-font-size;
	}

	::v-deep {
		.braintree-dropin {
			font-family: inherit;
		}

		[data-braintree-id="choose-a-way-to-pay"],
		[data-braintree-id="methods-label"],
		[data-braintree-id="other-ways-to-pay"] {
			color: $kiva-text-light;
			width: 100%;
			text-align: center;
		}

		.braintree-option,
		.braintree-sheet__header,
		.braintree-method.braintree-method--active {
			background-color: $kiva-bg-lightgray;
			border-color: $subtle-gray;
			color: $kiva-text-dark;
		}

		.braintree-option {
			padding: 12px 16px;

			&:first-child {
				border-radius: $form-border-radius $form-border-radius 0 0;
			}

			&:last-child {
				border-radius: 0 0 $form-border-radius $form-border-radius;
			}
		}

		.braintree-sheet__text,
		.braintree-method__label,
		.braintree-option__label,
		.braintree-form__label,
		.braintree-methods--active .braintree-method__label,
		.braintree-method .braintree-method__label .braintree-method__label--small {
			color: $kiva-text-dark;
			font-weight: $global-weight-normal;
		}

		.braintree-sheet {
			border-radius: $form-border-radius;
			border-color: $subtle-gray;

			.braintree-sheet__header {
				padding: 12px 16px 0  12px;

				.braintree-sheet__text {
					margin-left: 12px;
				}
			}
		}

		[data-braintree-id="card-view-icons"] {
			padding-left: 1rem;

			& > div {
				padding-left: 0;
			}
		}

		[data-braintree-id="toggle"] {
			color: $kiva-accent-blue;
			background: none;
			padding-bottom: rem-calc(2);

			&:hover {
				background: none;
				font-weight: $global-weight-normal;
			}

			& span {
				border: none;

				&:focus,
				&:hover {
					text-decoration: underline;
					color: $highlight-blue;
				}
			}
		}

		// Hides credit card icon in number field until credit card type is known
		[data-braintree-id="number-field-group"]:not(.braintree-form__field-group--card-type-known) svg {
			display: none;
		}

		// Braintree Iframe is type number and inheriting some styles from kiva number input.
		iframe[type=number] {
			box-shadow: none;
			padding: 0;
			background-color: transparent;
		}

		.braintree-sheet__content--form .braintree-form__field-group {
			.braintree-form__field {
				color: $kiva-text-light;
				background-color: $kiva-bg-lightgray;
			}
		}

		[data-braintree-id="methods-container"] {
			.braintree-method {
				border-radius: $form-border-radius;
				width: 100%;
			}

			.braintree-method--active {
				border-color: $active-border-color;
				border-width: $border-width;
			}

			.braintree-method__check {
				background-color: $icon-background-color;
				padding: rem-calc(5);
				height: 1.95rem;
				width: 1.95rem;
				margin-right: rem-calc(4);
			}
		}
	}

	#dropin-submit {
		width: 100%;
		font-size: 1.25rem;
		margin-top: 1.25rem;

		.icon-lock {
			height: rem-calc(20);
			width: rem-calc(20);
			fill: white;
			top: rem-calc(3);
			position: relative;
			margin-right: rem-calc(8);
		}
	}

	#payment-updating-overlay {
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

</style>

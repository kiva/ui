<template>
	<div class="drop-in-wrapper">
		<div id="dropin-container" class="fs-exclude"></div>
		<kv-loading-spinner v-if="updatingPaymentWrapper" />
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import * as Sentry from '@sentry/browser';
import Dropin from 'braintree-web-drop-in';
import getClientToken from '@/graphql/query/checkout/getClientToken.graphql';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

/**
* Displays the Braintree Drop In Interface
* For reference see:
* https://braintree.github.io/braintree-web-drop-in/docs/current/module-braintree-web-drop-in.html
* */
export default {
	components: {
		KvLoadingSpinner,
	},
	inject: ['apollo'],
	props: {
		amount: {
			type: String,
			default: ''
		},
		/**
		 * Paypal flow options.
		 * Must be 'checkout' or 'vault'
		* */
		flow: {
			type: String,
			default: 'checkout',
			validator(value) {
				// The value must match one of these strings
				return ['checkout', 'vault'].indexOf(value) !== -1;
			}
		},
		/**
		 * Preselect Vaulted Payment Method
		 * Braintree option to preselect payment method
		* */
		preselectVaultedPaymentMethod: {
			type: Boolean,
			default: true
		},
		/**
		 * Payment type options to be displayed.
		 * Also controls the order to display them in.
		 * All options in default order:
		 * ['card', 'paypal', 'paypalCredit', 'venmo', 'applePay', 'googlePay']
		* */
		paymentTypes: {
			type: Array,
			default: () => ['paypal', 'card'],
			validator(value) {
				const possiblePaymentTypes = ['card', 'paypal', 'paypalCredit', 'venmo', 'applePay', 'googlePay'];
				return value.every(elem => possiblePaymentTypes.includes(elem));
			}
		},
		/**
		 * Drop-In auth options
		 * Must be 'token-key' or 'client-token'
		* */
		auth: {
			type: String,
			default: 'client-token',
			validator(value) {
				// The value must match one of these strings
				return ['token-key', 'client-token'].indexOf(value) !== -1;
			}
		},
	},
	data() {
		return {
			btDropinInstance: () => {},
			clientToken: null,
			updatingPaymentWrapper: false,
		};
	},
	methods: {
		setUpdatingPaymentWrapper(state) {
			this.updatingPaymentWrapper = state;
		},
		getDropInAuthToken() {
			if (this.auth === 'client-token') {
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
						this.initializeDropIn(this.clientToken);
						// Replace our loader with the dropIn loader after a small delay
						setTimeout(() => this.setUpdatingPaymentWrapper(false), 500);
					}
				}).catch(error => {
					console.error(error);
					this.$showTipMsg('An Error has occured. Please refresh the page and try again.', 'error');
				});
			}
			if (this.auth === 'token-key') {
				this.initializeDropIn(this.$appConfig.btTokenKey);
			}
		},
		initializeDropIn(authToken) {
			Dropin.create({
				authorization: authToken,
				container: '#dropin-container',
				dataCollector: {
					kount: true // Required if Kount fraud data collection is enabled
				},
				paymentOptionPriority: this.paymentTypes,
				preselectVaultedPaymentMethod: this.preselectVaultedPaymentMethod,
				card: {
					vault: {
						allowVaultCardOverride: true,
					},
				},
				paypal: {
					flow: this.flow,
					amount: numeral(this.amount).format('0.00'),
					currency: 'USD',
					buttonStyle: {
						color: 'gold',
						shape: 'rect',
						size: 'responsive',
					}
				},
				googlePay: {
					googlePayVersion: 2,
					merchantId: this.$appConfig.googlePay.merchantId,
					transactionInfo: {
						totalPriceStatus: 'FINAL',
						totalPrice: numeral(this.amount).format('0.00'),
						currencyCode: 'USD'
					},
					allowedPaymentMethods: [{
						type: 'CARD',
						parameters: {
							billingAddressRequired: true,
							billingAddressParameters: {
								format: 'FULL'
							}
						}
					}]
				},
				applePay: {
					displayName: 'Kiva',
					paymentRequest: {
						total: {
							label: 'Kiva',
							amount: numeral(this.amount).format('0.00'),
						},
						requiredBillingContactFields: ['postalAddress']
					}
				}
			}).then(btCreateInstance => {
				this.btDropinInstance = btCreateInstance;
				this.initializeDropInActions();
			}).catch(btCreateError => {
				console.error(btCreateError);
				Sentry.withScope(scope => {
					scope.setTag('bt_stage_dropin', 'btCreateError');
					scope.setTag('bt_client_create_error', btCreateError.message);
					Sentry.captureException(btCreateError.code);
				});
				this.$showTipMsg('An Error has occured. Please refresh the page and try again.', 'error');
			});
		},
		initializeDropInActions() {
			// more info: https://developers.braintreepayments.com/guides/drop-in/customization/javascript/v3#events
			// https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#on

			// initial check for a "requestable" vaulted payment method
			if (this.btDropinInstance.isPaymentMethodRequestable()) {
				this.$emit('transactions-enabled', true);
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
				this.$emit('transactions-enabled', true);
			});

			// listen for "non-requestable" payment method (ex. PayPal sign in flow)
			this.btDropinInstance.on('noPaymentMethodRequestable', () => {
				// Returns nothing
				this.$emit('transactions-enabled', false);
			});

			// listen for "selected" payment option (ex. completion of PayPal sign in)
			// could be useful later
			// this.btDropinInstance.on('paymentOptionSelected', event => {
			// 	console.log('payment option selected - returns option');
			// 	console.log(event);
			// });
		},
	},
	mounted() {
		this.getDropInAuthToken();
	}
};
</script>

<style lang="scss" scoped>
@import "settings";

$form-border-radius: rem-calc(4);
$active-border-color: $input-checked-color;
$icon-background-color: $input-checked-color;
$border-width: 1px;

// These style over write the default Braintree Drop In styles.
// Use [data-braintree-id=""] selectors whenever possible as
// Braintree guarantees that these will not be easily changed.
#dropin-container {
	::v-deep {
		// Main DropIn
		.braintree-dropin {
			font-family: inherit;
		}

		// General Braintree errors, failed to process, etc
		[data-braintree-id="sheet-error"] {
			background-color: $white;
		}

		// Initial Payment Selection labels
		[data-braintree-id="choose-a-way-to-pay"],
		[data-braintree-id="methods-label"],
		[data-braintree-id="other-ways-to-pay"] {
			color: $kiva-text-light;
			width: 100%;
			text-align: center;
		}

		// Various text styles
		.braintree-method__label,
		.braintree-option__label,
		.braintree-methods--active .braintree-method__label,
		.braintree-method .braintree-method__label .braintree-method__label--small {
			color: $kiva-glyph-primary-black;
			font-weight: $global-weight-normal;
			text-align: left;
		}

		// Payment Option buttons on initial UI
		[data-braintree-id="payment-options-container"] {
			.braintree-option {
				padding: 12px 16px;

				&:first-child {
					border-radius: $form-border-radius $form-border-radius 0 0;
				}

				&:last-child {
					border-radius: 0 0 $form-border-radius $form-border-radius;
				}
			}
		}

		// Saved payment methods container
		// List of vaulted cards
		[data-braintree-id="methods-container"] {
			.braintree-method {
				width: 100%;

				&:first-child {
					border-radius: $form-border-radius $form-border-radius 0 0;
				}

				&:last-child {
					border-radius: 0 0 $form-border-radius $form-border-radius;
				}
			}

			.braintree-method--active {
				border-color: $active-border-color;
				border-width: $border-width;
				background-color: $kiva-bg-lightgray;
			}

			.braintree-method__check {
				background-color: $icon-background-color;
				padding: rem-calc(5);
				height: 1.95rem;
				width: 1.95rem;
				margin-right: rem-calc(4);
			}
		}

		// 'Choose another way to pay' text
		[data-braintree-id="toggle"] {
			font-weight: $global-weight-highlight;
			color: $kiva-accent-blue;
			background: none;
			font-size: 1rem;
			padding: 0 rem-calc(18) rem-calc(2) rem-calc(18);

			&:hover {
				background: none;
				font-weight: $global-weight-highlight;
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

		// Braintree section headings
		// 'Choose a way to pay'
		// 'Paying with Card'
		// 'Other ways to pay'
		.braintree-heading {
			font-size: $small-text-font-size;
		}

		// Payment method form headers
		[data-braintree-id="paypal-sheet-header"],
		[data-braintree-id="apple-pay-sheet-header"],
		[data-braintree-id="google-pay-sheet-header"],
		[data-braintree-id="card-sheet-header"] {
			padding: 0 0 1rem 0;
			border: 0;
			background-color: transparent;

			// Payment Method logo in header
			.braintree-sheet__logo--header {
				display: none;
				visibility: hidden;
			}

			// Form header text
			.braintree-sheet__text,
			.braintree-sheet__label {
				margin-left: 0;
				font-weight: $global-weight-highlight;
				color: $kiva-glyph-primary-black;
				font-size: $medium-text-font-size;
			}

			// Moves credit card icons to new line.
			.braintree-sheet__header-label {
				width: 100%;
			}
		}

		// Payment method 'sheet' or main content area
		[data-braintree-id="paypal"],
		[data-braintree-id="applePay"],
		[data-braintree-id="googlePay"],
		[data-braintree-id="card"] {
			border: 0;
		}

		// Credit Card payment content
		[data-braintree-id="card"] {
			// Main payment method content - either button or form
			.braintree-sheet__content {
				// Classes for input fields. - Credit Card Only
				// Payment Method Form wrapper
				&.braintree-sheet__content--form {
					padding: 0;
				}

				// Form error colors
				.braintree-form__field-error {
					color: $kiva-accent-red;
					text-align: left;
					font-weight: $global-weight-highlight;
				}

				// Remove extra left padding from form field/label wrapper
				.braintree-form__field-group {
					padding-left: 0;
					margin-bottom: 1.25rem;

					// Invalid form field
					&.braintree-form__field-group--has-error {
						.braintree-form__hosted-field {
							background-color: rgba($kiva-accent-red, 0.15);
							border-color: $kiva-accent-red;
							border-radius: $form-border-radius;
						}
					}

					// Form fields
					&:not(.braintree-form__field-group--has-error) {
						.braintree-form__field:not(.braintree-form__checkbox) {
							.braintree-form__hosted-field {
								color: $kiva-text-light;
								background-color: $kiva-bg-lightgray;
								border-radius: $form-border-radius;
								border-color: $kiva-glyph-grey-primary;
							}
						}
					}
				}

				// Form field labels
				.braintree-form__label {
					color: $kiva-glyph-primary-black;
					font-weight: $global-weight-highlight;
					font-size: $normal-text-font-size;
				}

				// Help text next to form label.
				span.braintree-form__descriptor {
					display: none;
				}

				// Exp, CVV, and Postal Code groups
				[data-braintree-id="expiration-date-field-group"],
				[data-braintree-id="cvv-field-group"],
				[data-braintree-id="postal-code-field-group"] {
					width: 49%;
					flex-basis: auto;
					flex-grow: unset;
				}
			}
		}

		// Credit Card icons in form header
		[data-braintree-id="card-view-icons"] {
			padding-bottom: 0;

			& > div {
				padding: 0;
				border: $border-width solid #f3f3f3;
				border-radius: $form-border-radius;
				line-height: rem-calc(11);
			}
		}

		// responsive paypal button
		// prevents bug causing button to get slightly cut off in mobile
		[data-braintree-id="paypal-button"] {
			width: 99%;
			@include breakpoint(medium) {
				width: 250px;
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
	}
}

#payment-updating-overlay {
	background-color: rgba(255, 255, 255, 0.7);
	z-index: 500;
}

.drop-in-wrapper {
	text-align: center;
}
</style>

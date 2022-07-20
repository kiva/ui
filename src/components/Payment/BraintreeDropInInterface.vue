<template>
	<div class="drop-in-wrapper">
		<div id="dropin-container" class="fs-exclude"></div>
		<kv-loading-spinner v-if="updatingPaymentWrapper" />
	</div>
</template>

<script>
import _get from 'lodash/get';
import numeral from 'numeral';
import * as Sentry from '@sentry/vue';
import Dropin from 'braintree-web-drop-in';
import getClientToken from '@/graphql/query/checkout/getClientToken.graphql';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

/**
* Displays the Braintree Drop In Interface
* For reference see:
* https://braintree.github.io/braintree-web-drop-in/docs/current/module-braintree-web-drop-in.html
* */
export default {
	name: 'BraintreeDropInInterface',
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
	computed: {
		formattedAmount() {
			return numeral(this.amount).format('0.00');
		},
		applePaymentRequest() {
			return {
				total: {
					label: 'Kiva',
					amount: this.formattedAmount,
				},
				requiredBillingContactFields: ['postalAddress']
			};
		},
		googleTransactionInfo() {
			return {
				totalPriceStatus: 'FINAL',
				totalPrice: this.formattedAmount,
				currencyCode: 'USD',
			};
		}
	},
	watch: {
		amount(next, prev) {
			if (next !== prev) {
				this.btDropinInstance?.updateConfiguration?.('paypal', 'amount', this.formattedAmount);
				this.btDropinInstance?.updateConfiguration?.(
					'googlePay',
					'transactionInfo',
					this.googleTransactionInfo
				);
				this.btDropinInstance?.updateConfiguration?.('applePay', 'paymentRequest', this.applePaymentRequest);
			}
		}
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
						amount: this.formattedAmount,
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
						this.$showTipMsg('An Error has occured. Please refresh the page and try again.', 'error');
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
				// vaultManager: true, - Useful for testing and removing payment methods easily.
				paymentOptionPriority: this.paymentTypes,
				preselectVaultedPaymentMethod: this.preselectVaultedPaymentMethod,
				card: {
					vault: {
						allowVaultCardOverride: true,
					},
				},
				paypal: {
					flow: this.flow,
					amount: this.formattedAmount,
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
					transactionInfo: this.googleTransactionInfo,
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
					paymentRequest: this.applePaymentRequest
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
		// Prevents BT error in the case this component gets initialized multiple times
		const isElementEmpty = document?.getElementById('dropin-container')?.innerHTML === '';
		if (isElementEmpty) {
			this.getDropInAuthToken();
		}
	},
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

		// Various text styles
		.braintree-method__label,
		.braintree-option__label,
		.braintree-methods--active .braintree-method__label,
		.braintree-method .braintree-method__label .braintree-method__label--small {
			color: $kiva-glyph-primary-black;
			font-weight: $global-weight-normal;
			text-align: left;
		}

		// Saved payment methods container
		// List of vaulted cards
		[data-braintree-id="methods-container"] {
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
<style lang="postcss">
	/* New Tailwind Styles */

	/* Small margin for loader */
	.loading-spinner {
		@apply tw-mb-2;
	}

	/* Braintree section headings
	'Choose a way to pay'
	'Paying with Card'
	'Other ways to pay' */
	#dropin-container [data-braintree-id="choose-a-way-to-pay"],
	#dropin-container [data-braintree-id="methods-label"],
	#dropin-container [data-braintree-id="other-ways-to-pay"] {
		@apply tw-text-small tw-text-primary tw-text-tertiary tw-w-full;
	}

	/* Payment method container */
	#dropin-container [data-braintree-id="sheet-container"] {
		@apply tw-bg-white;
	}

	/* Payment method form headers */
	#dropin-container [data-braintree-id="paypal-sheet-header"],
	#dropin-container [data-braintree-id="apple-pay-sheet-header"],
	#dropin-container [data-braintree-id="google-pay-sheet-header"],
	#dropin-container [data-braintree-id="card-sheet-header"] {
		/* bottom padding and bottom margin creates spacing around the BT loading indicator */
		@apply tw-bg-transparent tw-border-0 tw-p-0 tw-pb-1 tw-mb-1;
	}

	/* Payment Method logo in header */
	#dropin-container [data-braintree-id="paypal-sheet-header"] .braintree-sheet__logo--header,
	#dropin-container [data-braintree-id="apple-pay-sheet-header"] .braintree-sheet__logo--header,
	#dropin-container [data-braintree-id="google-pay-sheet-header"] .braintree-sheet__logo--header,
	#dropin-container [data-braintree-id="card-sheet-header"] .braintree-sheet__logo--header {
		@apply tw-hidden;
	}

	/* Moves credit card icons to new line. */
	#dropin-container [data-braintree-id="paypal-sheet-header"] .braintree-sheet__header-label,
	#dropin-container [data-braintree-id="apple-pay-sheet-header"] .braintree-sheet__header-label,
	#dropin-container [data-braintree-id="google-pay-sheet-header"] .braintree-sheet__header-label,
	#dropin-container [data-braintree-id="card-sheet-header"] .braintree-sheet__header-label {
		@apply tw-w-full;
	}

	/* Payment method form headers text
	'Pay with card'
	'Paypal'
	'GooglePay'
	'ApplePay' */
	#dropin-container [data-braintree-id="paypal-sheet-header"] .braintree-sheet__text,
	#dropin-container [data-braintree-id="apple-pay-sheet-header"] .braintree-sheet__text,
	#dropin-container [data-braintree-id="google-pay-sheet-header"] .braintree-sheet__text,
	#dropin-container [data-braintree-id="card-sheet-header"] .braintree-sheet__text,
	#dropin-container [data-braintree-id="paypal-sheet-header"] .braintree-sheet__label,
	#dropin-container [data-braintree-id="apple-pay-sheet-header"] .braintree-sheet__label,
	#dropin-container [data-braintree-id="google-pay-sheet-header"] .braintree-sheet__label,
	#dropin-container [data-braintree-id="card-sheet-header"] .braintree-sheet__label {
		@apply tw-ml-0 tw-text-h4 tw-text-primary tw-text-left;
	}

	/* Saved payment methods container
	List of vaulted cards */
	#dropin-container [data-braintree-id="upper-container"]::before {
		background-color: transparent;
	}

	#dropin-container [data-braintree-id="methods-container"] .braintree-method {
		@apply tw-border-solid tw-border-tertiary tw-w-full tw-border tw-p-2;
	}

	#dropin-container [data-braintree-id="methods-container"] .braintree-method:first-child {
		@apply tw-rounded-tr tw-rounded-tl tw-rounded-bl-none tw-rounded-br-none;
	}

	#dropin-container [data-braintree-id="methods-container"] .braintree-method:last-child {
		@apply tw-rounded-br tw-rounded-bl;
	}

	/* Payment Option buttons on initial UI */
	#dropin-container [data-braintree-id="payment-options-container"] .braintree-option {
		@apply tw-border-solid tw-border-tertiary tw-w-full tw-border tw-border-b-0 tw-p-2;
	}

	#dropin-container [data-braintree-id="payment-options-container"] .braintree-option:first-child {
		@apply tw-rounded-tr tw-rounded-tl tw-rounded-bl-none tw-rounded-br-none;
	}

	#dropin-container [data-braintree-id="payment-options-container"] .braintree-option:last-child {
		@apply tw-rounded-br tw-rounded-bl tw-border-b;
	}

	/* 'Choose another way to pay' text */
	#dropin-container [data-braintree-id="toggle"],
	#dropin-container [data-braintree-id="toggle"]:hover {
		@apply tw-bg-transparent tw-text-h4 tw-text-link;
	}

	#dropin-container [data-braintree-id="toggle"] span,
	#dropin-container [data-braintree-id="toggle"] span:focus,
	#dropin-container [data-braintree-id="toggle"] span:hover {
		@apply tw-text-base tw-no-underline tw-border-0;
		@apply tw-font-medium;
	}

	/* Credit Card Payment Content
	Form field labels */
	#dropin-container [data-braintree-id="card"] .braintree-sheet__content .braintree-form__label {
		@apply tw-text-base;
		@apply tw-font-medium;
	}
</style>

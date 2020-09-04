<template>
	<div class="drop-in-wrapper">
		<div id="dropin-container"></div>
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
			default: 'checkout'
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
		},
	},
	data() {
		return {
			btDropinInstance: () => {},
			clientToken: null,
			updatingPaymentWrapper: true,
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
				paymentOptionPriority: this.paymentTypes,
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

#dropin-container {
	::v-deep [data-braintree-id="choose-a-way-to-pay"] {
		font-size: $small-text-font-size;
	}

	::v-deep {
		.braintree-dropin {
			font-family: inherit;
		}

		[data-braintree-id="sheet-error"] {
			background-color: $white;
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

				.braintree-sheet__header-label {
					padding-right: 2px;
				}
			}
		}

		[data-braintree-id="card-view-icons"] {
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
			.braintree-form__field:not(.braintree-form__checkbox) {
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

		// responsive paypal button
		// prevents bug causing button to get slightly cut off in mobile
		[data-braintree-id="paypal-button"] {
			width: 99%;
			@include breakpoint(medium) {
				width: 250px;
			}
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

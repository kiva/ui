<template>
	<div class="braintree-holder">
		<!-- Saved credit card data -->
		<!-- v-if user has stored payment methods show the following div -->
		<!-- v-for loop going through the user's saved credit cards and displaying them -->
		<div id="braintree-stored-payment-form"
			v-show="storedPaymentMethods && btVaultActive"
		>
			<div class="row small-collapse braintree-form-row">
				<div
					v-for="(paymentMethod, index) in storedPaymentMethods" :key="index"
					class="small-12 columns braintree-form-row-inner"
				>
					<label
						class="saved-payment-radio-label"
						:for="`saved-payment-radio-${index}`"
					>
						<input
							:id="`saved-payment-radio-${index}`"
							type="radio"
							class="saved-payment-radio"
							:value="index"
							v-model="selectedCard"
						>
						<!-- Checking credit card type to display correct credit card icon. -->
						<kv-icon
							:name="setCardType(paymentMethod.details.cardType)"
							class="credit-card-icon"
						/>
						<!-- Passing in the last 4 digits of the stored card -->
						<span class="card-last-four-digits">...{{ paymentMethod.details.lastFour }}</span>
					</label>
					<span class="delete-card-item">
						<button
							:id="`delete-card-${index}`"
							class="delete-card-button"
							@click="showDeleteCardPopup(paymentMethod)"
						>
							<kv-icon name="small-x" />
						</button>
					</span>
				</div>
				<!-- Only show this div if the user has savedPaymentMethods, otherwise it has not context -->
				<div
					v-show="storedPaymentMethods.length > 0"
					class="small-12 columns"
				>
					<label
						class="new-payment-radio-label"
						for="new-payment-radio"
					>
						<input
							id="new-payment-radio"
							class="new-payment-radio"
							type="radio"
							value="newCard"
							v-model="selectedCard"
						>
						<span class="use-new-card-text">Use a new card</span>
					</label>
				</div>
			</div>
			<!-- Submit saved card payment button -->
			<div
				v-show="selectedCard !== 'newCard'"
				class="row small-collapse additional-side-padding"
			>
				<div class="small-12 columns">
					<kv-button
						id="stored-card-submit"
						class="button smallest"
						@click.native="checkoutWithStoredCard"
					>
						<kv-icon name="lock" />
						Pay with <span id="card-type">card</span>
					</kv-button>
				</div>
			</div>
		</div>

		<!-- If the user has no savedPaymentMethods or the useNewCard radio is
		selected show braintree hosted fields form -->
		<form id="braintree-payment-form"
			v-show="!storedPaymentMethods || selectedCard === 'newCard' "
		>
			<!-- Card number input -->
			<div class="row small-collapse braintree-form-row">
				<div class="small-12 columns">
					<label for="kv-card-number">Card number</label>
					<div id="kv-card-number" class="kv-braintree-wrapper"></div>
					<p v-if="kvCardNumberError"
						class="kv-card-number-error kv-bt-field-error"
						ref="kv-card-number-error"
					>
						{{ kvCardNumberError }}
					</p>
				</div>
			</div>

			<!-- Inline Inputs -->
			<div class="row small-collapse braintree-form-row">
				<div class="small-4 columns">
					<label for="kv-expiration-date">Expiration</label>
					<div id="kv-expiration-date" class="kv-braintree-wrapper"></div>
				</div>
				<div class="small-4 columns">
					<label for="kv-cvv" class="cvv-label">CVV</label>
					<div id="kv-cvv" class="kv-braintree-wrapper"></div>
				</div>
				<div class="small-4 columns">
					<label for="kv-postal-code">Postal code</label>
					<div id="kv-postal-code" class="kv-braintree-wrapper"></div>
				</div>
				<ul class="kv-multi-field-error-list"
					ref="kv-multi-field-error-list"
				>
					<li v-if="kvExpirationError" class="kv-bt-field-error">
						{{ kvExpirationError }}
					</li>
					<li v-if="kvCVVError" class="kv-bt-field-error">
						{{ kvCVVError }}
					</li>
					<li v-if="kvPostalCodeError" class="kv-bt-field-error">
						{{ kvPostalCodeError }}
					</li>
				</ul>
			</div>

			<!-- Inline Inputs -->
			<div
				v-show="btVaultActive"
				class="row small-collapse"
			>
				<div class="small-12 columns vault-checkbox-wrapper">
					<label for="vault-checkbox">
						<input
							v-model="storePaymentMethod"
							type="checkbox"
							id="vault-checkbox"
						> Save payment method
					</label>
				</div>
			</div>

			<!-- Submit payment button -->
			<div class="row small-collapse additional-side-padding">
				<div class="small-12 columns">
					<kv-button value="submit" id="braintree-submit" class="button smallest">
						<kv-icon name="lock" />
						Pay with <span id="card-type">card</span>
					</kv-button>
				</div>
			</div>
		</form>

		<kv-lightbox
			class="delete-card-lightbox"
			:no-padding-bottom="true"
			:visible="deleteLbVisible"
			@lightbox-closed="hideDeleteCardPopup"
		>
			<div class="delete-popup-icon-holder">
				<kv-icon name="notice" />
			</div>
			<div class="delete-popup-content">
				<h3>
					Are you sure you want to<br>remove this saved card?
				</h3>
				<slot name="controls">
					<kv-button
						value="Delete card"
						id="braintree-delete-card"
						class="button smallest"
						@click.prevent.native="matchCardForDeletion"
					>
						Delete card
						<span v-if="targetedCardForDeletion !== null">
							...{{ targetedCardForDeletion.details.lastFour }}
						</span>
					</kv-button>
					<br>
					<a href="#" title="Cancel" @click.prevent="hideDeleteCardPopup">
						Cancel
					</a>
				</slot>
			</div>
		</kv-lightbox>
	</div>
</template>

<script>
/* global braintree */
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import numeral from 'numeral';
import Raven from 'raven-js';
import checkoutUtils from '@/plugins/checkout-utils-mixin';
import getClientToken from '@/graphql/query/checkout/getClientToken.graphql';
import myStoredCards from '@/graphql/query/myStoredCards.graphql';
import deleteBraintreeCard from '@/graphql/mutation/deleteBraintreeCard.graphql';
import braintreeDepositAndCheckout from '@/graphql/mutation/braintreeDepositAndCheckout.graphql';
import braintreeConfig from '@/graphql/query/checkout/braintreeConfig.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';

export default {
	components: {
		KvButton,
		KvIcon,
		KvLightbox,
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
			ensureBraintreeScript: null,
			braintreeRendered: false,
			clientToken: null,
			storePaymentMethod: false,
			btVaultActive: false,
			btVaultInstance: () => {},
			btDataCollectorActive: false,
			dataCollectorDeviceData: '',
			kvCardNumberError: '',
			kvMultiFieldError: '',
			kvExpirationError: '',
			kvCVVError: '',
			kvPostalCodeError: '',
			storedPaymentMethods: [],
			kivaStoredPaymentMethods: [],
			selectedCard: 'newCard',
			selectedCardType: null,
			targetedCardForDeletion: null,
			deleteLbVisible: false,
		};
	},
	apollo: {
		query: braintreeConfig,
		preFetch: true,
		result({ data }) {
			this.btVaultActive = _get(data, 'general.btVaultActive.value') === 'true' || false;
			this.btDataCollectorActive = _get(data, 'general.btDataCollectorActive.value') === 'true' || false;
		},
	},
	metaInfo() {
		// ensure Braintree script is loaded
		const braintreeScript = {};
		const braintreeHostedFieldsScript = {};
		const braintreeDataCollectorScript = {};
		const braintreeVaultManagerScript = {};

		// check for braintree incase script is already loaded
		if (typeof braintree === 'undefined') {
			braintreeScript.type = 'text/javascript';
			// Loading in the Braintree SDK by hitting this URL
			braintreeScript.src = 'https://js.braintreegateway.com/web/3.50.1/js/client.min.js';
			// load in the hosted fields script
			braintreeHostedFieldsScript.type = 'text/javascript';
			braintreeHostedFieldsScript.src = 'https://js.braintreegateway.com/web/3.50.1/js/hosted-fields.min.js';
			// load data collector
			braintreeDataCollectorScript.type = 'text/javascript';
			braintreeDataCollectorScript.src = 'https://js.braintreegateway.com/web/3.50.1/js/data-collector.min.js';
			// load in the hosted fields vault manager
			braintreeVaultManagerScript.type = 'text/javascript';
			braintreeVaultManagerScript.src = 'https://js.braintreegateway.com/web/3.50.1/js/vault-manager.min.js';
		}

		return {
			script: [
				braintreeScript,
				braintreeHostedFieldsScript,
				braintreeVaultManagerScript,
				braintreeDataCollectorScript,
			]
		};
	},
	mounted() {
		this.setUpdatingPaymentWrapper(true);
		this.getClientToken();
	},
	watch: {
		amount() {
			this.initializeBraintree();
		},
		clientToken() {
			this.initializeBraintree();
		}
	},
	methods: {
		getClientToken() {
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

					Raven.captureException(errorCode, {
						tags: {
							bt_stage: 'btGetClientTokenError',
							bt_get_client_token_error: errorMessage
						}
					});
				} else {
					this.clientToken = _get(response, 'data.shop.getClientToken');
				}
			});
		},
		initializeBraintree() {
			// ensure Braintree is loaded before calling
			this.ensureBraintreeScript = window.setInterval(() => {
				if (typeof braintree !== 'undefined' && !this.braintreeRendered) {
					this.renderBraintreeForm();
				}
			}, 100);
		},
		renderBraintreeForm() {
			// clear ensureBraintree interval
			window.clearInterval(this.ensureBraintreeScript);
			// signify we've already rendered
			this.braintreeRendered = true;

			const form = document.querySelector('#braintree-payment-form');

			// render braintree form
			braintree.client.create({
				authorization: this.clientToken
			}, (btCreateError, clientInstance) => {
				if (btCreateError) {
					console.error(btCreateError);

					Raven.captureException(btCreateError.code, {
						tags: {
							bt_stage: 'btCreateError',
							bt_client_create_error: btCreateError.message
						}
					});

					return;
				}

				// If btVaultActive flag is true, initialize the BT Vault
				if (this.btVaultActive) {
					this.initializeBTVault();
				} else {
					this.setUpdatingPaymentWrapper(false);
				}

				// If btDataCollectorActive flag is true, initialize DataCollector
				if (this.btDataCollectorActive) {
					this.initializeDataCollector(clientInstance);
				}

				braintree.hostedFields.create({
					client: clientInstance,
					styles: {
						'#expiration::placeholder': {
							'font-style': 'italic',
							color: '#c3c3c3'
						},
						// Import class for inputs which apply directly to the input elements
						// > Our divs become wrappers which can be styled by our css
						input: 'braintree-form-inputs'
					},
					fields: {
						number: {
							selector: '#kv-card-number',
						},
						cvv: {
							selector: '#kv-cvv',
						},
						expirationDate: {
							selector: '#kv-expiration-date',
							placeholder: 'MM/YY'
						},
						postalCode: {
							selector: '#kv-postal-code',
						}
					}
				}, (hostedFieldsErr, hostedFieldsInstance) => {
					if (hostedFieldsErr) {
						console.error(hostedFieldsErr);

						Raven.captureException(hostedFieldsErr.code, {
							tags: {
								bt_stage: 'btHostedFieldsCreateError',
								bt_hosted_fields_error: hostedFieldsErr.message
							}
						});

						return;
					}

					form.addEventListener('submit', event => {
						event.preventDefault();
						this.$kvTrackEvent('basket', 'Braintree Payment', 'Button Click');
						this.setUpdating(true);

						// Validate Basket prior to starting
						this.validateBasket()
							.then(validationStatus => {
								if (validationStatus === true) {
									// Call tokenize
									this.tokenizeFormFields(hostedFieldsInstance);
								} else {
									// validation failed
									this.setUpdating(false);
									this.showCheckoutError(validationStatus);
									this.$emit('refreshtotals');
								}
								return validationStatus;
							})
							.catch(error => {
								this.setUpdating(false);
								const errorCode = _get(error, 'errors[0].code');
								const errorMessage = _get(error, 'errors[0].message');
								console.error(error);

								// Fire specific exception to Sentry/Raven
								Raven.captureException(errorCode, {
									tags: {
										bt_stage: 'btSubmitValidationCatch',
										bt_basket_validation_error: errorMessage
									}
								});
							});
					});
				});
			});
		},
		tokenizeFormFields(hostedFieldsInstance) {
			hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
				if (tokenizeErr) {
					this.setUpdating(false);
					this.handleTokenizeErrors(tokenizeErr);
					return;
				}
				// reset all errors
				this.clearBtFieldErrors();
				// call transaction method if no errors
				this.doBraintreeCheckout(payload.nonce);
			});
		},
		initializeBTVault() {
			braintree.vaultManager.create({
				authorization: this.clientToken
			}, (vaultError, btVaultInstance) => {
				this.btVaultInstance = btVaultInstance;
				if (vaultError) {
					console.error(vaultError);
					Raven.captureException(vaultError.code, {
						tags: {
							bt_stage: 'btVaultCreateError',
							bt_client_create_error: vaultError.message
						}
					});
					return false;
				}
				this.fetchStoredCards();
				this.fetchKivaStoredCards();
			});
		},
		fetchStoredCards() {
			this.setUpdatingPaymentWrapper(true);
			this.btVaultInstance.fetchPaymentMethods(
				{ defaultFirst: true },
				(fetchPaymentMethodError, paymentMethods) => {
					if (fetchPaymentMethodError) {
						console.error(fetchPaymentMethodError);
					}
					this.storedPaymentMethods = paymentMethods || [];
					// if the user has storedPayment methods then set the selectedCard
					// to the first one in the list of storedCards
					this.selectedCard = this.storedPaymentMethods.length > 0 ? 0 : 'newCard';
					this.setUpdatingPaymentWrapper(false);
				}
			);
		},
		// TODO: Look into enabling this feature at the account level
		// deleteStoredCard(paymentMethod) {
		// 	// The function exists but currently returns an error when attempting to use
		// 	// console.log(this.btVaultInstance.deletePaymentMethod);
		// 	const paymentMethodNonce = _get(paymentMethod, 'nonce');
		// 	if (paymentMethodNonce) {
		// 		this.btVaultInstance.deletePaymentMethod(paymentMethodNonce, data => {
		// 			console.log(data);
		// 			this.fetchStoredCards();
		//			// clean up target data
		//			this.targetedCardForDeletion = null;
		// 		});
		// 	}
		// },
		// TODO: Deprecate once we have direct access through VaultManager
		matchCardForDeletion() {
			// exit if not kiva stored payment methods to match
			if (!this.kivaStoredPaymentMethods.length || !this.targetedCardForDeletion) {
				return false;
			}
			// get bt payment method details
			const paymentMethodDetails = _get(this.targetedCardForDeletion, 'details');
			const { cardType, expirationYear, lastFour } = paymentMethodDetails;
			// match selected card for deletion against kiva payment method call
			const targetCard = _filter(this.kivaStoredPaymentMethods, kpm => {
				return kpm.cardType === cardType
				&& kpm.expirationDate.indexOf(expirationYear) !== -1
				&& kpm.last4 === lastFour;
			});
			// execute deletion
			if (this.kivaStoredPaymentMethods.length) {
				this.deleteBraintreeCard(targetCard[0]);
			} else {
				return false;
			}
		},
		deleteBraintreeCard(targetCard) {
			if (targetCard.token) {
				this.apollo.mutate({
					mutation: deleteBraintreeCard,
					variables: {
						token: targetCard.token
					}
				}).then(({ data }) => {
					if (data.errors) {
						console.error(data.errors);
						const errorCode = _get(data, 'errors[0].code');
						const errorMessage = _get(data, 'errors[0].message');
						Raven.captureException(errorCode, {
							tags: {
								bt_stage: 'btDeleteMyCreditCardError',
								bt_delete_card_error: errorMessage
							}
						});
					}
					// refetch stored cards from BT Vault
					this.fetchStoredCards();
					// close pop up
					this.hideDeleteCardPopup();
					// clean up target data
					this.targetedCardForDeletion = null;
				});
			}
		},
		fetchKivaStoredCards() {
			this.apollo.query({ query: myStoredCards }).then(({ data }) => {
				this.kivaStoredPaymentMethods = _get(data, 'my.creditCardVault.creditCards');
			});
		},
		showDeleteCardPopup(paymentMethod) {
			this.targetedCardForDeletion = paymentMethod;
			this.deleteLbVisible = true;
		},
		hideDeleteCardPopup() {
			this.targetedCardForDeletion = null;
			this.deleteLbVisible = false;
		},
		initializeDataCollector(clientInstance) {
			braintree.dataCollector.create({
				client: clientInstance,
				kount: true
			}, (dataCollectorError, dataCollectorInstance) => {
				if (dataCollectorError) {
					console.error(dataCollectorError);
					Raven.captureException(dataCollectorError.code, {
						tags: {
							bt_stage: 'btDataCollectorCreateError',
							bt_client_create_error: dataCollectorError.message
						}
					});
					return;
				}

				this.dataCollectorDeviceData = dataCollectorInstance.deviceData;
			});
		},
		checkoutWithStoredCard() {
			this.setUpdating(true);
			this.storePaymentMethod = false;
			this.doBraintreeCheckout(this.storedPaymentMethods[this.selectedCard].nonce);
			this.$kvTrackEvent('basket', 'Braintree Stored Payment', 'Button Click');
		},
		setCardType(cardType) {
			if (cardType === 'American Express') {
				return 'amex';
			}
			if (cardType === 'Visa') {
				return 'visa';
			}
			if (cardType === 'MasterCard') {
				return 'mastercard';
			}
			return 'unknown_card';
		},
		doBraintreeCheckout(nonce) {
			// Apollo call to the query mutation
			this.apollo.mutate({
				mutation: braintreeDepositAndCheckout,
				variables: {
					amount: numeral(this.amount).format('0.00'),
					nonce,
					savePaymentMethod: this.storePaymentMethod,
					deviceData: this.dataCollectorDeviceData,
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

					this.$showTipMsg(standardError, 'error');

					// Fire specific exception to Sentry/Raven
					Raven.captureException(errorCode, {
						tags: {
							bt_stage: 'btDepositAndCheckout',
							bt_kv_transaction_error: errorMessage
						}
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
					this.$kvTrackEvent(
						'basket',
						'Braintree Payment',
						'Success',
						transactionId
					);
					this.redirectToThanks(transactionId);
				}
				return kivaBraintreeResponse;
			});
		},
		handleTokenizeErrors(tokenizeErr) {
			console.error(tokenizeErr);

			if (tokenizeErr.code === 'HOSTED_FIELDS_FIELDS_EMPTY') {
				this.setBtErrors([]);
			}

			if (tokenizeErr.code === 'HOSTED_FIELDS_FIELDS_INVALID') {
				this.setBtErrors(tokenizeErr.details.invalidFieldKeys);
			}

			// Only show tip message + send to Raven for system failures
			if (tokenizeErr.code !== 'HOSTED_FIELDS_FIELDS_INVALID'
				&& tokenizeErr.code !== 'HOSTED_FIELDS_FIELDS_EMPTY') {
				this.$showTipMsg(tokenizeErr.message, 'error');

				Raven.captureException(tokenizeErr.code, {
					tags: {
						bt_stage: 'btTokenizeHostedFieldsError',
						bt_tokenize_card_error: tokenizeErr.message
					}
				});
			}
		},
		clearBtFieldErrors() {
			// clear errors
			this.kvCardNumberError = '';
			this.kvExpirationError = '';
			this.kvCVVError = '';
			this.kvPostalCodeError = '';
		},
		setBtErrors(errorTypes) {
			// All fields are empty. Cannot tokenize empty card fields.
			if (errorTypes.length === 0) {
				this.kvCardNumberError = 'Please enter card number';
				this.kvExpirationError = 'Please enter an expiration date';
				this.kvCVVError = 'Please enter cvv';
				this.kvPostalCodeError = 'Please enter a postal code';
				return false;
			}
			// Some payment input fields are invalid. Cannot tokenize invalid card fields.
			if (errorTypes.indexOf('number') !== -1) {
				this.kvCardNumberError = 'Invalid card number';
			} else {
				this.kvCardNumberError = '';
			}
			// extract expiration error
			if (errorTypes.indexOf('expirationDate') !== -1) {
				this.kvExpirationError = 'Invalid expiration date';
			} else {
				this.kvExpirationError = '';
			}
			// extract cvv error
			if (errorTypes.indexOf('cvv') !== -1) {
				this.kvCVVError = 'Invalid cvv';
			} else {
				this.kvCVVError = '';
			}
			// extract postal code error
			if (errorTypes.indexOf('postalCode') !== -1) {
				this.kvPostalCodeError = 'Invalid postal code';
			} else {
				this.kvPostalCodeError = '';
			}
		},
		setUpdating(state) {
			this.$emit('updating-totals', state);
		},
		setUpdatingPaymentWrapper(state) {
			this.$emit('updating-payment-wrapper', state);
		}
	}
};
</script>

<style lang="scss">
@import "settings";

$form-border-radius: rem-calc(3);
$error-red: #fdeceb;

// Utility class passed to Braintree Config
// > These styles are applied directly to the inputs
.braintree-form-inputs {
	margin: 0;
	padding: 0;
	line-height: rem-calc(40);
	font-size: 1rem;
}

.braintree-holder {
	// We control wrapping form and input container styles
	#braintree-payment-form,
	#braintree-stored-payment-form {
		padding: 0 1rem;

		.braintree-form-row {
			margin: 0 0 1.5rem;

			.braintree-form-row-inner {
				display: flex;
				justify-content: space-between;
			}
		}

		label {
			font-size: 1rem;
			color: $charcoal;
			text-align: left;
		}

		// could not get this style to apply on focused state without the !important
		.braintree-hosted-fields-focused {
			border: 1px solid $charcoal !important;
		}

		.braintree-hosted-fields-invalid {
			background-color: $error-red !important;
		}

		// Hosted Field input wrappers + input customization declarations
		// > Our divs become wrappers around injected iframes containing input fields
		.kv-braintree-wrapper {
			height: rem-calc(40);
			background: $ghost; //#fafafa
			border: 1px solid $subtle-gray;
			color: $kiva-text-dark;
			margin: 0 0 0.25rem;
			padding: 0 rem-calc(8);
			border-radius: $form-border-radius;

			[type=number],
			[type=text] {
				background: transparent;
				box-shadow: none;
				padding: 0;
				margin: 0;
			}
		}

		.cvv-label {
			margin: 0 0.9375rem;
		}

		// specific field wrapper overrides
		// #kv-card-number,
		// #kv-expiration-date,
		// #kv-cvv,
		// #kv-postal-code
		#kv-cvv {
			margin: 0 rem-calc(15);
		}

		.kv-multi-field-error-list {
			margin: 0;
			padding: 0;
			list-style: none;
		}

		.kv-bt-field-error {
			text-align: left;
			font-weight: 300;
			color: $kiva-accent-red;
			margin: 0;
			padding: 0;
			line-height: 1.25rem;
			font-size: 0.875rem;
		}
		// .kv-card-number-error {}

		.use-new-card-text {
			margin-left: 1rem;
		}

		.card-last-four-digits,
		.use-new-card-text {
			color: $tab-pill-color;
		}

		.new-payment-radio-label,
		.saved-payment-radio-label {
			display: flex;
			align-items: center;
			line-height: 2.25;
		}

		.new-payment-radio,
		.saved-payment-radio {
			margin-bottom: 0.125rem;

			@include breakpoint(medium) {
				margin-bottom: rem-calc(5);
			}
		}

		// eslint-disable-next-line
		.saved-payment-radio[type="radio"]:checked ~ .card-last-four-digits,
		#new-payment-radio[type="radio"]:checked + .use-new-card-text {
			font-weight: 500;
			color: $charcoal;
		}

		.vault-checkbox-wrapper {
			margin-bottom: 1.25rem;
			padding: 0 1rem;
		}

		.credit-card-icon {
			width: rem-calc(32);
			height: rem-calc(20);
			top: rem-calc(3);
			margin: 0 1rem;
		}

		.delete-card-button {
			padding-top: 0.7rem;

			.icon {
				width: 1.25rem;
				height: 1.25rem;
				fill: $kiva-stroke-gray;
			}
		}

		.additional-side-padding {
			padding: 0 1rem;
		}

		#braintree-submit,
		#stored-card-submit {
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
	}

	.delete-card-lightbox {
		display: flex;
		align-items: center;

		.delete-popup-content {
			padding-bottom: 2rem;

			h3 {
				line-height: 1.5rem;
				padding-bottom: 1rem;
			}
		}

		.delete-popup-icon-holder {
			// eslint-disable-next-line
			.icon-notice {
				width: 2.125rem;
				height: 2.125rem;
			}
		}

		a {
			font-size: 1.2rem;
			text-decoration: underline;
			font-weight: 400;
		}
	}
}
</style>

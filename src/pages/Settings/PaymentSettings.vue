<template>
	<www-page
		class="payments"
		:gray-background="true"
	>
		<template #secondary>
			<the-my-kiva-secondary-menu />
		</template>
		<kv-default-wrapper>
			<div class="row column">
				<h1 class="tw-mb-4">
					Payment Methods
				</h1>
			</div>
			<div class="row">
				<kv-settings-card class="columns small-12 large-8" title="Credit Card Settings">
					<template #content>
						<form class="payment-settings-default-form" @submit.prevent>
							<fieldset>
								<legend v-if="hasSavedPaymentMethods" class="tw-block tw-mb-2">
									Select your default card
								</legend>
								<legend v-else class="tw-block tw-mb-2">
									There are no cards saved to this account
								</legend>
								<div
									v-for="(paymentMethod, index) in savedPaymentMethods"
									:key="index"
									class="payment-settings-default-form__cc-wrapper"
								>
									<kv-radio
										class="payment-settings-default-form__radio"
										:id="`creditCard-${index}`"
										:radio-value="paymentMethod.nonce"
										v-model="selectedDefaultCardNonce"
									>
										<img
											class="payment-settings-default-form__cc-icon tw-inline-block"
											:src="paymentMethod.imageUrl"
											alt="credit card"
										>
										<span class="data-hj-suppress">{{ paymentMethod.description }}</span>
									</kv-radio>
									<button
										@click="showLightbox(paymentMethod)"
										class="payment-settings-default-form__remove-btn
									tw-font-medium tw-text-danger hover:tw-text-danger-highlight hover:tw-underline"
									>
										Remove
									</button>
								</div>
							</fieldset>
							<fieldset>
								<button
									class="tw-text-link tw-font-medium payment-settings-default-form__expand-button"
									@click="showAddACard = !showAddACard"
								>
									Add a new card
									<kv-icon
										class="arrow more-options-arrow tw-stroke-current tw-text-action"
										:class="{'down': !showAddACard, 'up': showAddACard}"
										name="small-chevron"
										:from-sprite="true"
									/>
								</button>
								<transition name="kvfade">
									<div v-show="showAddACard">
										<braintree-drop-in-interface
											v-if="isClientReady"
											ref="braintreeDropInInterface"
											:payment-types="['card']"
											auth="token-key"
											:key="dropInComponentKey"
											@transactions-enabled="enableAddCardButton = $event"
										/>
									</div>
								</transition>
							</fieldset>
							<fieldset>
								<div v-if="!showAddACard">
									<kv-button
										class="smaller payment-settings-default-form__save-button"
										v-if="!isProcessing"
										@click.native="savePaymentSettings"
										:disabled="!isChanged || $v.$invalid"
									>
										Save Settings
									</kv-button>
									<kv-button class="smaller" v-else>
										Saving <kv-loading-spinner />
									</kv-button>
								</div>
								<div v-if="showAddACard">
									<kv-button
										value="submit"
										id="dropin-submit"
										class="smaller payment-settings-default-form__add-button"
										:disabled="!enableAddCardButton || isProcessing"
										@click.native="submitDropInAddACard"
									>
										<kv-icon name="lock" />
										Add card <kv-loading-spinner v-if="isProcessing" />
									</kv-button>
								</div>
							</fieldset>
						</form>
					</template>
				</kv-settings-card>
			</div>
		</kv-default-wrapper>

		<!-- Are you sure? -->
		<kv-lightbox
			class="remove-card-lightbox"
			:visible="showRemoveLightbox"
			@lightbox-closed="showRemoveLightbox = false"
		>
			<h2 class="data-hj-suppress tw-mb-4">
				Are you sure you want to remove the card {{ lowerCaseDescription }}?
			</h2>
			<p class="tw-mb-4">
				This will remove this card from your payment settings forever.
			</p>
			<template #controls>
				<kv-button
					class="smallest secondary"
					@click.prevent.native="showRemoveLightbox = false"
				>
					Cancel
				</kv-button>
				<kv-button
					class="smallest alert"
					v-if="!isProcessing"
					@click.prevent.native="removeCard(selectedPaymentMethod.nonce)"
				>
					Remove card
				</kv-button>
				<kv-button class="smallest alert" v-else>
					Removing <kv-loading-spinner />
				</kv-button>
			</template>
		</kv-lightbox>

		<!-- Unable to Remove Active Card -->
		<kv-lightbox
			class="active-card-lightbox"
			:visible="showActiveLightbox"
			@lightbox-closed="showActiveLightbox = false"
		>
			<h2 class="data-hj-suppress tw-mb-4">
				Unable to remove card {{ lowerCaseDescription }}
			</h2>
			<p class="tw-mb-4">
				This card is used in your Monthly Good or Auto Deposit, and can be edited
				<router-link to="/settings/subscriptions">
					here
				</router-link>
			</p>
			<template #controls>
				<kv-button
					id="active-card-no"
					class="smallest secondary"
					@click.prevent.native="showActiveLightbox = false"
				>
					Close
				</kv-button>
			</template>
		</kv-lightbox>
	</www-page>
</template>

<script>
import * as Sentry from '@sentry/vue';
import gql from 'graphql-tag';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import KvButton from '@/components/Kv/KvButton';
import KvDefaultWrapper from '@/components/Kv/KvDefaultWrapper';
import KvIcon from '@/components/Kv/KvIcon';
import KvLightbox from '@/components/Kv/KvLightbox';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';
import KvRadio from '@/components/Kv/KvRadio';
import KvSettingsCard from '@/components/Kv/KvSettingsCard';
import TheMyKivaSecondaryMenu from '@/components/WwwFrame/Menus/TheMyKivaSecondaryMenu';
import WwwPage from '@/components/WwwFrame/WwwPage';

const pageQuery = gql`query paymentMethodVault {
  my {
    paymentMethodVault: paymentMethodVault {
        paymentMethods {
          description
          default
          expired
          imageUrl
          hasActiveSubscription
          methodType
          nonce
        }
    }
  }
}`;

export default {
	name: 'PaymentSettings',
	inject: ['apollo', 'cookieStore'],
	components: {
		BraintreeDropInInterface: () => import('@/components/Payment/BraintreeDropInInterface'),
		KvButton,
		KvDefaultWrapper,
		KvIcon,
		KvLightbox,
		KvLoadingSpinner,
		KvRadio,
		KvSettingsCard,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	metaInfo: {
		title: 'Payment settings',
	},
	data() {
		return {
			isClientReady: false,
			isProcessing: false,
			savedPaymentMethods: [],
			selectedDefaultCardNonce: '',
			selectedPaymentMethod: {},
			showActiveLightbox: false,
			showAddACard: false,
			showRemoveLightbox: false,
			enableAddCardButton: false,
			dropInComponentKey: new Date().getTime(),
		};
	},
	mixins: [
		validationMixin,
	],
	validations: {
		selectedDefaultCardNonce: {
			required,
		},
	},
	apollo: {
		query: pageQuery,
		preFetch: true,
		result({ data }) {
			this.savedPaymentMethods = data?.my?.paymentMethodVault?.paymentMethods ?? [];
			// set initial selected default card nonce
			this.selectedDefaultCardNonce =	this.defaultCardNonce;
		},
	},
	mounted() {
		this.isClientReady = !this.$isServer;
		// After initial value is loaded, setup watch to make form dirty on value changes
		this.$watch('selectedDefaultCardNonce', () => {
			this.$v.$touch();
		});
	},
	computed: {
		// the saved default card nonce on the server
		defaultCardNonce() {
			return this.savedPaymentMethods
				.filter(paymentMethod => paymentMethod.default)?.[0]?.nonce ?? '';
		},
		isChanged() {
			return this.$v.$dirty && this.selectedDefaultCardNonce !== this.defaultCardNonce;
		},
		hasSavedPaymentMethods() {
			return this.savedPaymentMethods.length > 0;
		},
		lowerCaseDescription() {
			return this.selectedPaymentMethod?.description?.toLowerCase?.();
		}
	},
	methods: {
		async savePaymentSettings() {
			this.isProcessing = true;
			const updateDefaultPaymentMethod = this.apollo.mutate({
				mutation: gql`mutation updateDefaultPaymentMethod($nonce: String!) {
					my {
						paymentMethodVault {
							updateDefaultPaymentMethod(nonce: $nonce)
						}
					}
				}`,
				variables: {
					nonce: this.selectedDefaultCardNonce,
				},
				awaitRefetchQueries: true,
				refetchQueries: [
					{ query: pageQuery }
				]
			});

			try {
				const updateResponse = await updateDefaultPaymentMethod;
				if (updateResponse.errors) {
					throw new Error(updateResponse.errors[0].extensions.code || updateResponse.errors[0].message);
				}
				this.$showTipMsg('You have successfully changed your default card');
			} catch (err) {
				this.$showTipMsg('There was a problem saving your settings', 'error');
			} finally {
				this.isProcessing = false;
			}
		},
		showLightbox(selectedPaymentMethod) {
			this.selectedPaymentMethod = selectedPaymentMethod;
			if (this.selectedPaymentMethod.hasActiveSubscription) {
				this.showActiveLightbox = true;
			} else {
				this.showRemoveLightbox = true;
			}
		},
		async removeCard(nonce) {
			this.isProcessing = true;
			const deletePaymentMethod = this.apollo.mutate({
				mutation: gql`mutation deletePaymentMethod($nonce: String!) {
					my {
						paymentMethodVault {
							deletePaymentMethod(nonce: $nonce)
						}
					}
				}`,
				awaitRefetchQueries: true,
				refetchQueries: [
					{ query: pageQuery }
				],
				variables: {
					nonce,
				}
			});

			try {
				const deleteResponse = await deletePaymentMethod;
				if (deleteResponse.errors) {
					throw new Error(deleteResponse.errors[0].extensions.code || deleteResponse.errors[0].message);
				}
				this.$showTipMsg('You have successfully deleted a card');
			} catch (err) {
				this.$showTipMsg('There was a problem removing the saved card', 'error');
			} finally {
				this.isProcessing = false;
				this.showRemoveLightbox = false;
			}
		},
		resetAddACardForm() {
			// Reset Add A New Card form
			this.showAddACard = false;
			// Change drop in UI key to destroy and reinitialize component
			this.dropInComponentKey = new Date().getTime();
		},
		submitDropInAddACard() {
			this.isProcessing = true;

			// request payment method
			this.$refs.braintreeDropInInterface.btDropinInstance.requestPaymentMethod()
				.then(btSubmitResponse => {
					const transactionNonce = btSubmitResponse?.nonce;
					const deviceData = btSubmitResponse?.deviceData;
					const paymentType = btSubmitResponse?.type;
					if (transactionNonce) {
						this.doBraintreeAddACard(transactionNonce, deviceData, paymentType);
					}
				}).catch(btSubmitError => {
					this.isProcessing = false;
					console.error(btSubmitError);
					// Fire specific exception to Sentry/Raven
					Sentry.withScope(scope => {
						scope.setTag('bt_stage_dropin', 'btRequestPaymentMethodCatch');
						scope.setTag('bt_basket_validation_error', btSubmitError);
						Sentry.captureException(btSubmitError);
					});
				});
		},
		async doBraintreeAddACard(nonce, deviceData, methodType) {
			this.isProcessing = true;
			const savePaymentMethod = this.apollo.mutate({
				mutation: gql`mutation savePaymentMethod(
					$methodType: PaymentMethodTypeEnum!,
					$nonce: String!,
					$deviceData: String,
					$makeDefault: Boolean
					) {
					my {
						paymentMethodVault {
							savePaymentMethod(
								nonce: $nonce,
								deviceData: $deviceData,
								methodType: $methodType,
								makeDefault: $makeDefault
								) {
								nonce
								description
								methodType
							}
						}
					}
				}`,
				variables: {
					nonce,
					methodType,
					deviceData,
					makeDefault: true,
				},
				awaitRefetchQueries: true,
				refetchQueries: [
					{ query: pageQuery }
				]
			});

			try {
				const saveResponse = await savePaymentMethod;
				if (saveResponse.errors) {
					throw new Error(saveResponse.errors[0].extensions.code || saveResponse.errors[0].message);
				}
				this.resetAddACardForm();
				this.$showTipMsg('You have successfully added a payment method');
			} catch (err) {
				this.resetAddACardForm();
				this.$showTipMsg('There was a problem adding payment method', 'error');
			} finally {
				this.isProcessing = false;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.payments {
	.payment-settings-default-form {
		&__save-button {
			margin-top: 1.75rem;
		}

		&__add-button {
			margin-top: 0;

			.wrapper {
				width: 1rem;
				height: 1rem;

				::v-deep .icon {
					fill: white;
				}
			}
		}

		&__cc-wrapper {
			display: flex;
			margin-bottom: 0.75rem;
		}

		&__remove-btn {
			text-align: right;
		}

		&__radio {
			width: 75%;
		}

		&__cc-icon {
			height: 1.5rem;
			margin: -0.33rem 0.5rem 0 1.5rem;
		}

		&__expand-button {
			padding: 0.35rem 0.5rem;
			margin-left: 2.65rem;
		}
	}

	// style in button loading spinner
	::v-deep .loading-spinner {
		vertical-align: middle;
		width: 1rem;
		height: 1rem;
	}

	::v-deep .loading-spinner .line {
		background-color: $white;
	}

	::v-deep .kv-lightbox__title {
		max-width: rem-calc(495);
	}

	.arrow {
		width: rem-calc(13);
		height: rem-calc(9);

		&.more-options-arrow {
			margin-left: 0.75rem;

			&.up {
				transform: rotate(180deg);
			}
		}
	}

	// specific styles to this braintree dropin UI
	::v-deep .drop-in-wrapper {
		max-width: rem-calc(375);
		margin-top: 1rem;

		.braintree-placeholder {
			display: none;
		}

		// remove 'pay with card' header
		.braintree-sheet__header {
			display: none;
		}

		// remove payment toggle
		[data-braintree-id="toggle"] {
			display: none;
		}
	}
}

</style>

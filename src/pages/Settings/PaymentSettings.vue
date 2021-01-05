<template>
	<www-page class="payments" :gray-background="true">
		<the-my-kiva-secondary-menu slot="secondary" />
		<div class="title-area">
			<div class="row column">
				<h1>
					Payment Methods
				</h1>
			</div>
		</div>
		<div class="row">
			<kv-settings-card class="columns small-12 large-8" title="Credit Card Settings">
				<template v-slot:icon>
					<kv-icon
						class="icon"
						title="Payment"
						name="unknown-card"
					/>
				</template>
				<template v-slot:content>
					<form class="payment-settings-default-form" @submit.prevent>
						<fieldset>
							<legend v-if="hasSavedPaymentMethods">
								Select your default card
							</legend>
							<legend v-else>
								There are no cards saved to this account
							</legend>
							<div v-for="(paymentMethod, index) in savedPaymentMethods"
								:key="index"
								class="payment-settings-default-form__cc-wrapper"
							>
								<kv-radio
									class="payment-settings-default-form__radio"
									:id="`creditCard-${index}`"
									:radio-value="paymentMethod.nonce"
									v-model="selectedDefaultCardNonce"
								>
									<img class="payment-settings-default-form__cc-icon"
										:src="paymentMethod.imageUrl"
										alt="credit card"
									> {{ paymentMethod.description }}
								</kv-radio>
								<kv-button
									@click.native.prevent="showLightbox(paymentMethod)"
									class="payment-settings-default-form__remove-btn text-link text-link--alert"
								>
									Remove
								</kv-button>
							</div>
						</fieldset>
						<fieldset class="payment-settings-default-form__save-button-wrapper">
							<kv-button
								class="smaller"
								v-if="!isProcessing"
								@click.native="savePaymentSettings"
								:disabled="!isChanged || $v.$invalid"
							>
								Save Settings
							</kv-button>
							<kv-button class="smaller" v-else>
								Saving <kv-loading-spinner />
							</kv-button>
						</fieldset>
					</form>
				</template>
			</kv-settings-card>
		</div>

		<!-- Are you sure? -->
		<kv-lightbox
			class="remove-card-lightbox"
			:visible="showRemoveLightbox"
			:title="`Are you sure you want to remove the card ${lowerCaseDescription}?`"
			@lightbox-closed="showRemoveLightbox = false"
		>
			<p>
				This will remove this card from your payment settings forever.
			</p>
			<template slot="controls">
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
			:title="`Unable to remove card ${lowerCaseDescription}`"
			@lightbox-closed="showActiveLightbox = false"
		>
			<p>
				This card is used in your Monthly Good or Auto Deposit, and can be edited
				<router-link to="/settings/subscriptions">
					here
				</router-link>
			</p>
			<template slot="controls">
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
import gql from 'graphql-tag';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import KvButton from '@/components/Kv/KvButton';
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
	inject: ['apollo'],
	components: {
		KvButton,
		KvIcon,
		KvLightbox,
		KvLoadingSpinner,
		KvRadio,
		KvSettingsCard,
		TheMyKivaSecondaryMenu,
		WwwPage,
	},
	data() {
		return {
			selectedDefaultCardNonce: '',
			savedPaymentMethods: [],
			isProcessing: false,
			showRemoveLightbox: false,
			showActiveLightbox: false,
			selectedPaymentMethod: {},
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
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.payments {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}

	.payment-settings-default-form {
		&__save-button-wrapper {
			margin-top: 1.75rem;
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
}

</style>

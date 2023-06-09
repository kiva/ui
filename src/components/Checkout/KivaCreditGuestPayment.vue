<template>
	<div>
		<div v-if="isGuestCheckout" id="guest-checkout">
			<label class="input-label tw-font-medium tw-block tw-my-2" for="email">
				What is your email?
			</label>
			<div class="input-label tw-text-small tw-text-secondary tw-block tw-my-2" for="email">
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
			<p v-if="$v.email.$error" class="input-error tw-text-danger tw-text-base tw-mb-2">
				Valid email required.
			</p>
			<p v-else-if="$v.email.error">
				Valid campaign email required
			</p>
			<kv-checkbox
				data-testid="basket-guest-terms-agreement"
				id="termsAgreement"
				name="termsAgreement"
				class="checkbox tw-text-small tw-mb-2"
				v-model="termsAgreement"
				@update:modelValue="$kvTrackEvent(
					'basket',
					'click-terms-of-use',
					'I have read and agree to the Terms of Use and Privacy Policy.',
					$event ? 1 : 0
				)"
			>
				I have read and agree to the
				<a
					:href="`https://${this.$appConfig.host}/legal/terms`"
					target="_blank"
					title="Open Terms of Use in a new window"
				>Terms of Use</a>
				and
				<a
					:href="`https://${this.$appConfig.host}/legal/privacy`"
					target="_blank"
					title="Open Privacy Policy in a new window"
				>Privacy Policy</a>.
				<p v-if="$v.termsAgreement.$error" class="input-error tw-text-danger tw-text-base">
					You must agree to the Kiva Terms of service & Privacy
					policy.
				</p>
			</kv-checkbox>
			<kv-checkbox
				data-testid="basket-guest-email-updates"
				id="emailUpdates"
				class="checkbox tw-text-small tw-mb-2"
				name="emailUpdates"
				v-model="emailUpdates"
				@update:modelValue="$kvTrackEvent(
					'basket',
					'click-marketing-updates',
					'Receive email updates from Kiva (including borrower updates and promos). You can unsubscribe anytime.', // eslint-disable-line
					$event ? 1 : 0
				)"
			>
				Receive email updates from Kiva (including borrower updates
				and promos). You can unsubscribe anytime.
			</kv-checkbox>
		</div>
		<kv-button
			type="submit"
			id="kiva-credit-submit"
			class="tw-mb-2"
			v-kv-track-event="['payment.continueBtn']"
			title="Checkout using your Kiva credit"
			@click.native.prevent="validateCreditBasket"
		>
			<slot>Complete order</slot>
		</kv-button>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';

import checkoutUtils from '@/plugins/checkout-utils-mixin';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvCheckbox from '~/@kiva/kv-components/vue/KvCheckbox';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

export default {
	name: 'KivaCreditGuestPayment',
	components: {
		KvButton,
		KvCheckbox,
		KvTextInput
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [
		checkoutUtils,
		validationMixin
	],
	props: {
		managedAccountId: {
			type: String,
			default: '',
		},
		promoFundId: {
			type: String,
			default: ''
		},
		isGuestCheckout: {
			type: Boolean,
			default: false,
		},
		promoGuestCheckoutEnabled: {
			type: Boolean,
			default: false
		},
		promoName: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			email: null,
			termsAgreement: false,
			emailUpdates: false,
		};
	},
	validations: {
		email: {
			required,
			email,
		},
		termsAgreement: { required: value => value === true },
	},
	methods: {
		validateCreditBasket() {
			this.$kvTrackEvent('basket', 'Kiva Checkout', 'Button Click');
			this.$emit('updating-totals', true);
			this.validateGuestPromoBasket(this.email, this.emailUpdates, this.promoFundId, this.managedAccountId)
				.then(validationStatus => {
					if (validationStatus === true) {
						// succesful validation
						this.checkoutCreditBasket();
					} else {
						// validation failed
						this.$emit('updating-totals', false);
						this.showCheckoutError(validationStatus);
						this.$emit('refreshtotals');
					}
				}).catch(errorResponse => {
					this.$emit('updating-totals', false);
					console.error(errorResponse);
				});
		},
		checkoutCreditBasket() {
			this.checkoutBasket(this.promoGuestCheckoutEnabled)
				.then(transactionResult => {
					if (typeof transactionResult !== 'object') {
						// succesful validation
						this.$kvTrackEvent('basket', 'Kiva Checkout', 'Success', transactionResult);
						// Complete transaction handles additional analytics + redirect
						this.$emit('complete-transaction', transactionResult);
					} else {
						// checkout failed
						this.$emit('updating-totals', false);
						const errorResult = transactionResult?.errors ?? [];
						this.showCheckoutError(errorResult);
						this.$emit('checkout-failure', errorResult);
					}
				}).catch(errorResponse => {
					this.$emit('updating-totals', false);
					console.error(errorResponse);
				});
		}
	}
};
</script>

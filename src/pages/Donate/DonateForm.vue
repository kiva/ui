<template>
	<form @submit.prevent.stop="submit" novalidate>
		<div class="row">
			<div class="small-12 columns input-wrapper recurring-amounts">
				<fieldset v-if="!subscriptionApplied">
					<multi-amount-selector
						:id="`${id}-donation-amount-selector`"
						class="donation-amount-selector"
						ref="donationAmountSelectorRef"
						:options="donationAmountOptions"
						:selected="donationAmountSelection"
						:custom-amount="donationCustomAmount"
						:min-custom-amount="minDonationAmount"
						@custom-amount-updated="donationCustomAmountUpdated"
						:split-pills="true"
						@pill-toggled="pillToggled"
					/>
				</fieldset>
				<!-- Monthly donation option -->
				<kv-base-input
					class="recurring-amounts__monthly-toggle"
					:name="`${id}-donate-monthly-toggle`"
					type="checkbox"
					v-if="activateMonthlyOption && !subscriptionApplied"
					v-model="isMonthly"
					v-kv-track-event="['Donate form', 'toggle-monthly-donation', 'Make a monthly donation.']"
				>
					Make a monthly donation.
				</kv-base-input>
				<donate-form-drop-in-payment-wrapper
					v-if="isMonthly"
					:disclaimer="formDisclaimerCopy"
					:donate-amount="selectedAmount"
					@completed="subscriptionApplied = true"
				/>
				<kv-button
					v-if="!isMonthly"
					class="smaller submit-btn"
					type="submit"
					:state="$v.$invalid ? 'disabled' : ''"
				>
					{{ buttonText }}
				</kv-button>
				<!-- Donation Disclaimer should always be present if we have a payment option active -->
				<div
					class="tw-text-base tw-mt-3 tw-text-action tw-text-center"
					v-if="showDisclaimer && !isMonthly && !subscriptionApplied"
					v-html="formDisclaimerCopy"
				></div>
			</div>
		</div>
	</form>
</template>

<script>
import { handleInvalidBasketForDonation, hasBasketExpired } from '@/util/basketUtils';
import numeral from 'numeral';
import { validationMixin } from 'vuelidate';
import { minValue, maxValue } from 'vuelidate/lib/validators';
import retryAfterExpiredBasket from '@/plugins/retry-after-expired-basket-mixin';
import DonateFormDropInPaymentWrapper from '@/pages/Donate/DonateFormDropInPaymentWrapper';
import MultiAmountSelector from '@/components/Forms/MultiAmountSelector';
import KvBaseInput from '@/components/Kv/KvBaseInput';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'DonateForm',
	components: {
		DonateFormDropInPaymentWrapper,
		KvBaseInput,
		KvButton,
		MultiAmountSelector,
	},
	inject: ['apollo', 'cookieStore'],
	mixins: [
		retryAfterExpiredBasket,
		validationMixin
	],
	validations() {
		return {
			selectedAmount: {
				minValue: minValue(this.minDonationAmount),
				maxValue: maxValue(this.maxDonationAmount)
			}
		};
	},
	props: {
		activateMonthlyOption: {
			type: Boolean,
			default: false
		},
		buttonText: {
			type: String,
			default: 'Donate'
		},
		data: {
			type: Array,
			default: () => [],
		},
		formDisclaimer: {
			type: String,
			default: '',
		},
		id: { // used when you have multiple instances of this form on one page.
			type: String,
			default: 'instance1',
		},
		showDisclaimer: {
			type: Boolean,
			default: false
		},
		selectedAmountSetting: {
			type: Number,
			default: null
		},
	},
	data() {
		return {
			defaultDisclaimer: '<p>Thanks to PayPal, Kiva receives free payment processing.</p>',
			donationAmountSelection: '500',
			donationCustomAmount: 500,
			donationAmount: 500,
			formSubmitted: false,
			minDonationAmount: 1,
			maxDonationAmount: 10000,
			isMonthly: false,
			subscriptionApplied: false,
		};
	},
	computed: {
		selectedAmount() {
			return this.donationAmount;
		},
		donationAmountOptions() {
			const values = this.data.map(option => {
				return {
					title: `$${option}`,
					key: option,
				};
			});
			values.push({ title: 'Other', key: 'custom' });
			return values;
		},
		formDisclaimerCopy() {
			return this.formDisclaimer || this.defaultDisclaimer;
		}
	},
	methods: {
		donationAmountSelected(value) {
			if (value === 'custom') {
				this.updateAmount(numeral(this.donationCustomAmount).value(), 'donation');
				this.donationAmountSelection = 'custom';
			} else {
				this.updateAmount(numeral(value).value(), 'donation');
				this.donationAmountSelection = String(value);
			}
		},
		donationCustomAmountUpdated(value) {
			this.donationCustomAmount = numeral(value).value();
			this.updateAmount(value, 'donation');
		},

		updateAmount(value) {
			this.donationAmount = numeral(value).value();
		},
		pillToggled(value) {
			if (value === 'custom') {
				this.updateAmount(numeral(this.donationCustomAmount).value());
				this.donationAmountSelection = 'custom';
			} else {
				this.updateAmount(numeral(value).value());
				this.donationAmountSelection = String(value);
			}
		},
		submit() {
			// exit form submit if a monthly donation was processed
			if (this.isMonthly || this.formSubmitted) {
				return false;
			}
			// allow form submission only once
			this.formSubmitted = true;

			const donationAmount = numeral(this.selectedAmount).value();

			this.apollo.mutate({
				mutation: updateDonation,
				variables: {
					price: donationAmount,
					isTip: true
				}
			}).then(data => {
				if (data?.errors) {
					let hasFailedAddToBasket = false;

					data?.errors.forEach(error => {
						this.$showTipMsg(error?.message, 'error');
						if (hasBasketExpired(error?.extensions?.code)) {
							hasFailedAddToBasket = true;
						}
					});

					if (hasFailedAddToBasket) {
						handleInvalidBasketForDonation({
							cookieStore: this.cookieStore,
							donationAmount,
							navigateToCheckout: true
						});
					}
				} else {
					this.$kvTrackEvent(
						'donation',
						'add-to-basket',
						'donation-one-time',
						null,
						// pass donation amount as whole number
						numeral(this.selectedAmount).value() * 100
					);
					this.$router.push({
						path: '/checkout',
					});
				}
			});
		}
	},
	mounted() {
		this.$nextTick(() => {
			// set a default selection
			let initialSelection;
			// if a selectedAmountSetting prop is passed in, and selected amount is in the list of options use that
			if (this.selectedAmountSetting && this.data.includes(this.selectedAmountSetting)) {
				initialSelection = this.selectedAmountSetting;
			} else {
				// otherwise use the middle option in the list
				initialSelection = this.donationAmountOptions[2]?.key;
			}
			this.donationAmountSelected(initialSelection);
			this.updateAmount(initialSelection);
			this.donationCustomAmount = numeral(initialSelection).value();

			// check route for setMonthly initializer
			if (this.$route?.query?.setMonthly === 'true' && this.activateMonthlyOption) {
				this.isMonthly = true;
			}
		});
	}
};

</script>
<style lang="scss" scoped>
@import 'settings';

.recurring-amounts {
	fieldset {
		margin-bottom: 1.25rem;
	}

	&__monthly-toggle {
		margin-bottom: 1rem;
	}
}

.donation-amount-selector {
	position: relative;
}

.submit-btn {
	width: 100%;
	margin: 0.5rem 0;
}

::v-deep .validation-errors {
	position: absolute;
	bottom: -1rem;
	right: 0;
	margin-bottom: 0;
}
</style>

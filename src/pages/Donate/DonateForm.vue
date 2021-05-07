<template>
	<form @submit.prevent.stop="submit" novalidate>
		<div class="row">
			<div class="small-12 columns input-wrapper recurring-amounts">
				<fieldset>
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
					:name="`${id}-donate-monthly-toggle`"
					type="checkbox"
					v-if="activateMonthlyOption"
					v-model="isMonthly"
					v-kv-track-event="['Donate form', 'toggle-monthly-donation', 'Make a monthly donation.']"
				>
					<template #after>
						Make a monthly donation.
					</template>
				</kv-base-input>
				<donate-form-drop-in-payment-wrapper
					v-if="isMonthly"
					:disclaimer="formDisclaimerCopy"
					:donate-amount="selectedAmount"
					:id="id"
				/>
				<kv-button v-if="!isMonthly" class="smaller submit-btn" type="submit" :disabled="$v.$invalid">
					{{ buttonText }}
				</kv-button>
				<!-- Donation Disclaimer should always be present if we have a payment option active -->
				<div
					class="attribution-text text-center"
					v-if="showDisclaimer && !isMonthly"
					v-html="formDisclaimerCopy"
				></div>
			</div>
		</div>
	</form>
</template>

<script>
import numeral from 'numeral';
import _forEach from 'lodash/forEach';
import { validationMixin } from 'vuelidate';
import { minValue, maxValue } from 'vuelidate/lib/validators';
import DonateFormDropInPaymentWrapper from '@/pages/Donate/DonateFormDropInPaymentWrapper';
import MultiAmountSelector from '@/components/Forms/MultiAmountSelector';
import KvBaseInput from '@/components/Kv/KvBaseInput';
import KvButton from '@/components/Kv/KvButton';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';

export default {
	components: {
		DonateFormDropInPaymentWrapper,
		KvBaseInput,
		KvButton,
		MultiAmountSelector,
	},
	mixins: [
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
		formSubmitAnalytics: {
			type: Object,
			default: () => {
				return {
					category: 'Donate Form',
					action: 'click-donate-support-us-form',
				};
			},
		},
		id: { // used when you have multiple instances of this form on one page.
			type: String,
			default: 'instance1',
		},
		showDisclaimer: {
			type: Boolean,
			default: false
		},
	},
	inject: ['apollo'],
	data() {
		return {
			defaultDisclaimer: '<p>Thanks to PayPal, Kiva receives free payment processing.</p>',
			donationAmountSelection: '500',
			donationCustomAmount: 500,
			donationAmount: 500,
			minDonationAmount: 25,
			maxDonationAmount: 10000,
			isMonthly: false,
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
			this.apollo.mutate({
				mutation: updateDonation,
				variables: {
					price: numeral(this.selectedAmount).format('0.00'),
					isTip: true
				}
			}).then(data => {
				if (data.errors) {
					_forEach(data.errors, ({ message }) => {
						this.$showTipMsg(message, 'error');
					});
				} else {
					this.$kvTrackEvent(
						this.formSubmitAnalytics.category,
						this.formSubmitAnalytics.action,
						this.buttonText,
						// pass donation amount as whole number
						numeral(this.selectedAmount).value() * 100,
						numeral(this.selectedAmount).value() * 100
					);
					this.$router.push({
						path: '/checkout',
					});
				}
			}).catch(error => {
				console.error(error);
			});
		}
	},
};

</script>
<style lang="scss" scoped>
@import 'settings';

.donation-amount-selector {
	margin-bottom: 1rem;
	position: relative;
}

.attribution-text {
	color: $kiva-text-light;
	margin-top: 1.5625rem;
	font-size: 1rem;
}

.submit-btn {
	width: 100%;
	margin: 0.5rem 0;
}

::v-deep label,
::v-deep input {
	font-weight: 700;
}

::v-deep .validation-errors {
	position: absolute;
	bottom: -1rem;
	right: 0;
	margin-bottom: 0;
}
</style>

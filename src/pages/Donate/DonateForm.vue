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
					/>
				</fieldset>
				<kv-button class="smaller submit-btn" type="submit" :disabled="$v.$invalid">
					{{ buttonText }}
				</kv-button>
				<div class="attribution-text text-center">
					Thanks to PayPal, Kiva receives free payment processing
				</div>
			</div>
		</div>
	</form>
</template>


<script>
import numeral from 'numeral';
import { validationMixin } from 'vuelidate';
import { minValue, maxValue } from 'vuelidate/lib/validators';
import MultiAmountSelector from '@/components/Forms/MultiAmountSelector';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
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
		buttonText: {
			type: String,
			default: 'Contribute monthly'
		},
		id: { // used when you have multiple instances of this form on one page.
			type: String,
			default: 'instance1',
		}
	},
	data() {
		return {
			donationAmountOptions: [
				{
					title: '$25',
					key: '25',
				},
				{
					title: '$50',
					key: '50',
				},
				{
					title: '$100',
					key: '100',
				},
				{
					title: '$250',
					key: '250',
				},
				{
					title: 'Other',
					key: 'custom'
				}
			],
			donationAmountSelection: '50',
			donationCustomAmount: 50,
			donationAmount: 50,
			minDonationAmount: 25,
			maxDonationAmount: 10000
		};
	},
	computed: {
		selectedAmount() {
			return this.donationAmount;
		}
	},
	methods: {
		// depositTypeChanged(value) {
		// 	this.depositSelected = value;
		// 	this.isRecurring = value === 'recurring';
		// },
		donationAmountSelected(value) {
			if (value === 'custom') {
				this.updateAmount(numeral(this.donationCustomAmount).value(), 'donation');
				this.donationAmountSelection = 'custom';
			} else {
				this.updateAmount(numeral(value).value(), 'donation');
				this.donationAmountSelection = value;
			}
		},
		donationCustomAmountUpdated(value) {
			this.donationCustomAmount = numeral(value).value();
			this.updateAmount(value, 'donation');
		},

		updateAmount(value) {
			// updates local var from various changes in the form
			// update donation
			this.donationAmount = numeral(value).value();
		},
		submit() {
			this.$router.push({
				path: '/checkout',
				query: {
					amount: this.selectedAmount,
					onetime: !this.isRecurring,
					source: 'donateMacroForm'
				}
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

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
				<kv-button class="smaller submit-btn" type="submit" :disabled="$v.$invalid">
					{{ buttonText }}
				</kv-button>
				<div class="attribution-text text-center" v-html="formDisclaimer"></div>
			</div>
		</div>
	</form>
</template>


<script>
import numeral from 'numeral';
import _forEach from 'lodash/forEach';
import { validationMixin } from 'vuelidate';
import { minValue, maxValue } from 'vuelidate/lib/validators';
import MultiAmountSelector from '@/components/Forms/MultiAmountSelector';
import KvButton from '@/components/Kv/KvButton';
import updateDonation from '@/graphql/mutation/updateDonation.graphql';

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
		},
		data: {
			type: Array,
			default: () => [],
		},
		formDisclaimer: {
			type: String,
			default: '',
		}
	},
	inject: ['apollo'],
	data() {
		return {
			donationAmountSelection: '500',
			donationCustomAmount: 500,
			donationAmount: 500,
			minDonationAmount: 25,
			maxDonationAmount: 10000
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
	},
	methods: {
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
			this.donationAmount = numeral(value).value();
		},
		pillToggled(value) {
			if (value === 'custom') {
				this.updateAmount(numeral(this.donationCustomAmount).value());
				this.donationAmountSelection = 'custom';
			} else {
				this.updateAmount(numeral(value).value());
				this.donationAmountSelection = value;
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
						'/support-kiva',
						'Donate from Macro',
						'Donation from Macro',
						// pass donation amount as whole number
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

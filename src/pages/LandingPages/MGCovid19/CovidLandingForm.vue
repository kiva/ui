<template>
	<form @submit.prevent.stop="submit" novalidate>
		<div class="row">
			<fieldset class="small-12 columns input-wrapper recurring-amounts">
				<label class="deposit-options-label" for="deposit-type">Choose how often to contribute</label>
				<kv-pill-toggle
					id="deposit-type"
					class="deposit-options-toggle"
					:options="depositOptions"
					:selected="depositSelected"
					@pill-toggled="depositTypeChanged"
				/>

				<label class="amount-options-label">Choose an amount to contribute</label>
				<multi-amount-selector
					v-show="isRecurring"
					id="amount-selector"
					class="recurring-amount-selector"
					:options="recurringAmountOptions"
					:selected="recurringAmountSelection"
					:custom-amount="recurringCustomAmount"
					:min-custom-amount="minRecurringAmount"
					@pill-toggled="recurringAmountSelected"
					@custom-amount-updated="recurringCustomAmountUpdated"
					:split-pills="true"
				/>

				<multi-amount-selector
					v-show="!isRecurring"
					id="onetime-amount-selector"
					class="onetime-amount-selector"
					:options="onetimeAmountOptions"
					:selected="onetimeAmountSelection"
					:custom-amount="onetimeCustomAmount"
					:min-custom-amount="minOnetimeAmount"
					@pill-toggled="onetimeAmountSelected"
					@custom-amount-updated="onetimeCustomAmountUpdated"
					:split-pills="true"
				/>
			</fieldset>
		</div>

		<kv-button class="smaller" type="submit" :disabled="$v.$invalid">
			{{ buttonText }}
		</kv-button>
	</form>
</template>


<script>
import numeral from 'numeral';
import { validationMixin } from 'vuelidate';
import { minValue, maxValue } from 'vuelidate/lib/validators';

import KvPillToggle from '@/components/Kv/KvPillToggle';
import MultiAmountSelector from '@/components/Forms/MultiAmountSelector';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
		KvPillToggle,
		MultiAmountSelector,
	},
	mixins: [
		validationMixin
	],
	validations() {
		if (this.isRecurring) {
			return {
				selectedAmount: {
					minValue: minValue(this.minRecurringAmount),
					maxValue: maxValue(this.maxDepositAmount)
				}
			};
		}
		return {
			selectedAmount: {
				minValue: minValue(this.minOnetimeAmount),
				maxValue: maxValue(this.maxDepositAmount)
			}
		};
	},
	props: {
		buttonText: {
			type: String,
			default: 'Contribute monthly'
		},
	},
	data() {
		return {
			isRecurring: true,
			depositOptions: [
				{
					title: 'Contribute monthly',
					key: 'recurring',
				},
				{
					title: 'One-time contribution',
					key: 'onetime',
				},
			],
			depositSelected: 'recurring',
			// Recurring Deposit Config
			recurringAmountOptions: [
				{
					title: '$5',
					key: '5',
				},
				{
					title: '$10',
					key: '10',
				},
				{
					title: '$25',
					key: '25',
				},
				{
					title: '$50',
					key: '50',
				},
				{
					title: 'Other',
					key: 'custom'
				}
			],
			recurringAmountSelection: '25',
			recurringCustomAmount: 5,
			recurringAmount: 25,
			minRecurringAmount: 5,
			// Onetime Deposit Config
			onetimeAmountOptions: [
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
					title: '$200',
					key: '200',
				},
				{
					title: 'Other',
					key: 'custom'
				}
			],
			onetimeAmountSelection: '25',
			onetimeCustomAmount: 25,
			onetimeAmount: 25,
			minOnetimeAmount: 25,
			maxDepositAmount: 10000,
		};
	},
	computed: {
		selectedAmount() {
			if (this.isRecurring) {
				return this.recurringAmount;
			}
			return this.onetimeAmount;
		}
	},
	methods: {
		depositTypeChanged(value) {
			this.depositSelected = value;
			this.isRecurring = value === 'recurring';
		},
		recurringAmountSelected(value) {
			if (value === 'custom') {
				this.updateAmount(numeral(this.recurringCustomAmount).value());
				this.recurringAmountSelection = 'custom';
			} else {
				this.updateAmount(numeral(value).value());
				this.recurringAmountSelection = value;
			}
		},
		recurringCustomAmountUpdated(value) {
			this.recurringCustomAmount = numeral(value).value();
			this.updateAmount(Number(value));
		},

		onetimeAmountSelected(value) {
			if (value === 'custom') {
				this.updateAmount(numeral(this.onetimeCustomAmount).value(), 'onetime');
				this.onetimeAmountSelection = 'custom';
			} else {
				this.updateAmount(numeral(value).value(), 'onetime');
				this.onetimeAmountSelection = value;
			}
		},
		onetimeCustomAmountUpdated(value) {
			this.onetimeCustomAmount = numeral(value).value();
			this.updateAmount(value, 'onetime');
		},

		updateAmount(value, type) {
			// updates local var from various changes in the form
			// update for onetime
			if (type === 'onetime') {
				this.onetimeAmount = numeral(value).value();
			} else {
				// else it's recurring
				this.recurringAmount = numeral(value).value();
			}
		},
		submit() {
			this.$router.push({
				path: '/monthlygood/setup',
				query: {
					amount: this.selectedAmount,
					category: 'disaster_relief_covid',
					onetime: !this.isRecurring,
					source: 'covid19response'
				}
			});
		}
	},
};

</script>
<style lang="scss" scoped>
@import 'settings';

// Monthly or Onetime Toggle
::v-deep .deposit-options-toggle {
	margin: 0.5rem 0 1rem;

	.pill {
		flex-grow: 1;
	}
}
// Split Pill Amount Selector Overrides
::v-deep .recurring-amount-selector,
::v-deep .onetime-amount-selector {
	margin: 0.5rem -0.5rem 0.5rem;
}

::v-deep .validation-errors {
	margin-bottom: 0;
}

.input-wrapper {
	.deposit-options-label,
	.amount-options-label {
		font-weight: 400;
		margin: 0;
		line-height: 1;
	}
}
</style>

<template>
	<form @submit.prevent.stop="submit" novalidate>
		<div class="row">
			<fieldset class="small-12 columns input-wrapper recurring-amounts">
				<legend>Choose an amount to contribute</legend>
				<!-- TODO: Create full width toggle to replace this -->
				<kv-toggle
					id="kv-toggle-deposit"
					v-model="isRecurring"
				>
					<label v-if="isRecurring" for="kv-toggle-deposit">Contribute monthly</label>
					<label v-if="!isRecurring" for="kv-toggle-deposit">One-time contribution</label>
				</kv-toggle>
				<transition name="kvfastfade">
					<kv-pill-toggle
						v-show="isRecurring"
						id="amount-selector"
						:options="amountOptions"
						:selected="amountSelected"
						@pill-toggled="selectAmount"
						:split-pills="true"
					/>
				</transition>
				<transition name="kvfastfade">
					<div class="custom-amount-holder" v-show="isRecurring && customAmountActive">
						<kv-currency-input
							id="custom-amount-input"
							class="input-element"
							v-model="customAmount"
							:aria-disabled="!customAmountActive"
							:disabled="!customAmountActive"
						/>
					</div>
				</transition>
				<transition name="kvfastfade">
					<div class="custom-amount-holder" v-show="!isRecurring">
						<kv-currency-input
							id="onetime-amount-input"
							class="input-element"
							v-model="onetimeAmount"
						/>
					</div>
				</transition>
			</fieldset>
			<!-- TODO: Add inline validations once design is finalized -->
			<!-- <fieldset class="large-4 medium-5 small-12 columns input-wrapper">
				<label class="show-for-sr" :class="{ 'error': $v.$invalid }" :for="'amount' + componentKey">
					Amount
				</label>
				<kv-currency-input :id="'amount' + componentKey" :value="amount" @input="updateAmount" />
				<ul class="validation-errors" v-if="$v.$invalid">
					<li v-if="!$v.amount.required">
						Field is required
					</li>
					<li v-if="!$v.amount.minValue || !$v.amount.maxValue">
						Enter an amount of $5-$10,000
					</li>
				</ul>
			</fieldset> -->
		</div>

		<kv-button class="smaller" type="submit" :disabled="$v.$invalid">
			{{ buttonText }}
		</kv-button>
	</form>
</template>


<script>
import numeral from 'numeral';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

import KvPillToggle from '@/components/Kv/KvPillToggle';
import KvToggle from '@/components/Kv/KvToggle';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import KvButton from '@/components/Kv/KvButton';

export default {
	mixins: [
		validationMixin,
	],
	components: {
		KvButton,
		KvCurrencyInput,
		KvPillToggle,
		KvToggle,
	},
	validations: {
		mgAmount: {
			required,
			minValue: minValue(5),
			maxValue: maxValue(10000)
		},
	},
	props: {
		selectedGroup: {
			type: String,
			default: 'default'
		},
		buttonText: {
			type: String,
			default: 'Contribute monthly'
		},
	},
	data() {
		return {
			amountOptions: [
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
			amountSelected: '25',
			customAmount: 5,
			customAmountActive: false,
			onetimeAmount: 25,
			isRecurring: true,
			mgAmount: 10
		};
	},
	watch: {
		amountSelected(newAmount, prevAmount) {
			if (newAmount !== prevAmount) {
				if (newAmount === 'custom') {
					this.updateAmount(this.customAmount);
				} else {
					this.updateAmount(this.amountSelected);
				}
			}
		},
		customAmount(newAmount, prevAmount) {
			if (newAmount !== prevAmount) {
				this.updateAmount(newAmount);
			}
		},
		onetimeAmount(newAmount, prevAmount) {
			if (newAmount !== prevAmount) {
				this.updateAmount(newAmount);
			}
		},
		isRecurring(newState) {
			if (newState) {
				if (this.amountSelected === 'custom') {
					this.updateAmount(this.customAmount);
				} else {
					this.updateAmount(this.amountSelected);
				}
			} else {
				this.updateAmount(this.onetimeAmount);
			}
		}
	},
	methods: {
		selectAmount(value) {
			if (value === 'custom') {
				this.customAmountActive = true;
				this.updateAmount(Number(this.customAmount));
				this.amountSelected = 'custom';
			} else {
				this.customAmountActive = false;
				this.updateAmount(Number(value));
				this.amountSelected = value;
			}
		},
		updateAmount(value) {
			// updates local var
			this.mgAmount = numeral(value).value();
			// Emits values to parent for synchronization of 2 landing form instances
			// TODO: Remove if duplicate instances are included in this design
			this.$emit('update:amount', numeral(value).value());
		},
		submit() {
			this.$router.push({
				path: '/monthlygood/setup',
				query: {
					amount: this.mgAmount,
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

// Pill Overrides
::v-deep .kv-pill-toggle {
	margin-bottom: 0.5rem;
	margin-left: -0.5rem;
	margin-right: -0.5rem;

	.pill {
		border-radius: 0.1875rem;
	}
}

#amount-selector {
	margin-bottom: 0.5rem;
}

.custom-amount-holder {
	margin: 0 0 0.5rem;

	#custom-amount-input,
	#onetime-amount-input {
		height: 2rem;
		margin: 0;
	}
}

.kv-toggle {
	margin: 0.5rem 0;

	label {
		font-weight: 400;
		display: inline;
	}
}

input[type="text"] {
	// styles to match KvDropDownRounded
	// border-radius: $button-radius;
	border-radius: 0.1875rem;
	color: $charcoal;
	// font-size: $medium-text-font-size;
	// font-weight: $global-weight-highlight;
	margin: 0;
}

// When label is error, validation styles overwrite this
label:not(.error) + input {
	border: 1px solid $charcoal;
}

::v-deep .dropdown-wrapper select.dropdown {
	width: 100%;
}

.input-wrapper {
	legend {
		font-weight: 400;
		margin: 0;
	}

	.input-element {
		margin-bottom: 1rem;
	}
}

.validation-errors {
	padding: 0.15rem 0 0 0;
	margin-bottom: 0;

	li {
		line-height: 1.15rem;
	}
}
</style>

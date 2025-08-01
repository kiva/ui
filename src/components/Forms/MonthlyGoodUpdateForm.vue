<template>
	<form
		@submit.prevent
		novalidate
	>
		<fieldset :disabled="disabled">
			<div>
				<strong>Each month on the</strong>
				<label
					class="tw-sr-only"
					:class="{ 'error': v$.form?.dayOfMonth?.$invalid }" :for="form.dayOfMonth"
				>
					Day of the Month
				</label>
				<kv-text-input
					v-if="isDayInputShown"
					@blur="hideDayInput()"
					class="text-input__day"
					id="dayOfMonth"
					type="number"
					placeholder=""
					required
					min="1"
					max="31"
					v-model.number="form.dayOfMonth"
				/>
				<button
					class="tw-text-link tw-font-medium"
					@click="isDayInputShown = true"
					v-if="!isDayInputShown"
				>
					<strong>{{ $filters.numeral(form.dayOfMonth, 'Oo') }}</strong>
					<kv-material-icon
						class="tw-w-2.5 tw-h-2.5 tw-text-action"
						:icon="mdiPencil"
						:title="'Edit'"
					/>
				</button>
				<strong>we'll process the following:</strong>
				<ul class="validation-errors" v-if="v$.form?.dayOfMonth?.$invalid">
					<li v-if="v$.form?.dayOfMonth?.required?.$invalid">
						Field is required
					</li>
					<li v-if="v$.form?.dayOfMonth?.minValue?.$invalid || v$.form?.dayOfMonth?.maxValue?.$invalid">
						Enter day of month between 1 and 31
					</li>
				</ul>
				<div class="additional-day-info">
					<small v-if="form.dayOfMonth > 28">
						(note - may be processed on the last day of the month)
					</small>
				</div>
			</div>
			<div>
				<div class="tw-flex tw-items-center tw-justify-between tw-mt-2">
					<div>
						<span>
							Deposit for lending
						</span>
					</div>

					<div>
						<label
							class="tw-sr-only"
							:class="{ 'error': v$.form?.mgAmount?.$invalid }"
							for="amount"
						>
							Amount
						</label>
						<kv-currency-input
							id="amount"
							class="tw-w-15"
							v-model="form.mgAmount"
						/>
					</div>
				</div>
				<div>
					<ul class="tw-text-right validation-errors" v-if="v$.form?.mgAmount?.$invalid">
						<li v-if="v$.form?.mgAmount?.required?.$invalid">
							Field is required
						</li>
						<li v-if="v$.form?.mgAmount?.minValue?.$invalid || v$.form?.mgAmount?.maxValue?.$invalid">
							Enter an amount of $5-$10,000
						</li>
					</ul>
				</div>
				<div class="tw-flex tw-items-center tw-justify-between tw-mt-2">
					<div>
						<span>
							Optional donation to support Kiva
						</span>
					</div>

					<div>
						<label
							class="tw-sr-only"
							:class="{ 'error': v$.form?.donation?.$invalid }"
							for="donation"
						>
							Donation
						</label>
						<kv-currency-input
							id="donation"
							class="tw-w-15"
							v-model="form.donation"
						/>
					</div>
				</div>
				<div>
					<ul class="tw-text-right validation-errors" v-if="v$.form?.donation?.$invalid">
						<li v-if="v$.form?.donation?.minValue?.$invalid || v$.form?.donation?.maxValue?.$invalid">
							Enter an amount of $0-$10,000
						</li>
					</ul>
				</div>
				<div class="tw-flex tw-items-center tw-justify-between tw-mt-2">
					<div>
						<strong>Total/month</strong>
					</div>

					<div>
						<strong
							class="additional-left-pad-currency"
						>{{ $filters.numeral(totalCombinedDeposit, '$0,0.00') }}</strong>
					</div>
				</div>
				<div>
					<ul
						class="tw-text-center validation-errors"
						v-if="v$.form?.mgAmount?.maxTotal?.$invalid || v$.form?.donation?.maxTotal?.$invalid"
					>
						<li>
							The maximum Monthly Good total is $10,000.<br>
							Please try again by entering in a smaller amount.
						</li>
					</ul>
				</div>
			</div>
			<div class="tw-flex tw-items-center tw-justify-between tw-mt-2">
				<div>
					<label class="tw-font-medium" for="monthly-good-categories-select">Your contribution will:</label>
				</div>
				<div>
					<kv-select
						v-model="form.category"
						id="monthly-good-categories-select"
					>
						<option
							v-for="(option, index) in lendingCategories"
							:value="option.value"
							:key="index"
						>
							{{ option.label }}
						</option>
					</kv-select>
				</div>
			</div>
		</fieldset>
	</form>
</template>

<script>
import numeral from 'numeral';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue } from '@vuelidate/validators';

import loanGroupCategoriesMixin from '#src/plugins/loan-group-categories';
import KvCurrencyInput from '#src/components/Kv/KvCurrencyInput';
import { mdiPencil } from '@mdi/js';
import { KvSelect, KvTextInput, KvMaterialIcon } from '@kiva/kv-components';

/**
 * This form contains all the fields and validation to modify a MG Subscription
 * It accepts values as props and sets those to initial data values.
 * When values are changed it emits the validity state and the values
 * so a parent component can access them.
 */
export default {
	name: 'MonthlyGoodUpdateForm',
	components: {
		KvMaterialIcon,
		KvCurrencyInput,
		KvSelect,
		KvTextInput,
	},
	data() {
		return {
			form: {
				category: this.category,
				dayOfMonth: this.dayOfMonth,
				donation: this.donation,
				mgAmount: this.mgAmount,
			},
			isDayInputShown: false,
			mdiPencil,
		};
	},
	setup() { return { v$: useVuelidate() }; },
	emits: ['form-update'],
	props: {
		/**
		 * Should all inputs on the form be disabled
		* */
		disabled: {
			type: Boolean,
			default: false
		},
		/**
		 * Monthly Good Donation to Kiva
		* */
		donation: {
			type: Number,
			default: 0
		},
		/**
		 * Monthly Good Amount to go to loans
		* */
		mgAmount: {
			type: Number,
			default: 0
		},
		/**
		 * Day of month Monthly Good will take effect
		* */
		dayOfMonth: {
			type: Number,
			default: new Date().getDate()
		},
		/**
		 * Category to lend to.
		 * Should be Category short name found in loanGroupCategoriesMixin
		* */
		category: {
			type: String,
			default: ''
		},
	},
	mixins: [
		loanGroupCategoriesMixin
	],
	validations() {
		return {
			form: {
				mgAmount: {
					required,
					minValue: minValue(5),
					maxValue: maxValue(10000),
					maxTotal(value) {
						return numeral(value).value() + numeral(this.donation).value() < 10000;
					}
				},
				donation: {
					minValue: minValue(0),
					maxValue: maxValue(10000),
					maxTotal(value) {
						return numeral(value).value() + numeral(this.mgAmount).value() < 10000;
					}
				},
				dayOfMonth: {
					required,
					minValue: minValue(1),
					maxValue: maxValue(31)
				},
				category: {
					required,
				}
			}
		};
	},
	mounted() {
		/** Accommodate for special cases where MG category might be legacy or null.
		 */
		if (!this.category) {
			this.lendingCategories.push(
				{ label: 'Preserve existing settings', value: '', shortName: '' }
			);
		}
		// Removing Covid 19 category option if it is not active for the user
		if (this.category?.marketingName !== 'COVID-19') {
			this.lendingCategories = this.lendingCategories.filter(category => category.marketingName !== 'COVID-19');
		}
		/** After initial value is loaded, setup watch to make form dirty on value changes
		 * and emit values on value changes. Setting this in mounted prevents the form
		 * from being dirty on initial load
		 */
		this.$watch('form', () => {
			this.v$.$touch();
			/**
			 * Event emitted whenever a form value changes.
			 * @type {Event}
			 */
			this.$emit('form-update', {
				...this.form,
				isChanged: this.v$.$dirty,
				isFormValid: !this.v$.$invalid,
			});
		}, { deep: true });
	},
	computed: {
		totalCombinedDeposit() {
			return numeral(this.form.donation).value() + numeral(this.form.mgAmount).value();
		},
	},
	methods: {
		hideDayInput() {
			if (!this.v$.form?.dayOfMonth?.$invalid) {
				this.isDayInputShown = false;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@use '#src/assets/scss/settings' as *;

form {
	.row {
		margin-bottom: 0.25em;
	}

	.additional-left-pad-currency {
		padding-left: 0.65rem;
	}

	.icon-pencil {
		height: 1rem;
		width: 1rem;
	}

	.text-input__day {
		margin: 0 0 0 0.25rem;
	}

	.validation-errors {
		margin: 0;
	}

	.additional-day-info {
		margin-bottom: 1.25rem;

		small,
		strong {
			display: block;
		}
	}

	:deep(.loading-spinner) {
		vertical-align: middle;
		width: 1rem;
		height: 1rem;
	}

	:deep(.loading-spinner) .line {
		background-color: $white;
	}

	:deep(.dropdown-wrapper.group-dropdown) .dropdown {
		margin-top: 0.65rem;
		margin-bottom: 0;
	}

	.middle-wrapper {
		padding-left: 2rem;
		padding-right: 2rem;
	}

	.group-dropdown {
		margin-right: 2rem;
	}
}
</style>

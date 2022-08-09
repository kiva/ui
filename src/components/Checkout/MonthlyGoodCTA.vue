<template>
	<div class="monthly-good-cta tw-text-left md:tw-text-center hide-for-print">
		<h2 class="monthly-good-cta__headline">
			{{ headline }}
		</h2>
		<p class="monthly-good-cta__subhead">
			{{ bodyCopy }}
		</p>
		<form class="monthly-good-cta__form" @submit.prevent>
			<div class="row">
				<div class="small-12 large-4 column">
					<label
						class="tw-font-medium"
						:class="{ 'error': $v.mgAmount.$invalid }"
						for="amount"
					>
						Amount
					</label>
					<kv-select
						v-model="mgOptionSelected"
						class="monthly-good-cta__dropdown tw-mb-2"
						v-kv-track-event="selectedAmountTracking"
						v-if="mgOptionSelected !== 'other'"
						id="amount"
					>
						<option
							v-for="(option, index) in mgAmountOptions"
							:value="option.value"
							:key="index"
						>
							{{ option.label }}
						</option>
					</kv-select>
					<kv-currency-input
						class="text-input"
						:class="{ 'error': $v.mgAmount.$invalid }"
						id="amount"
						v-model="mgAmount"
						v-if="mgOptionSelected === 'other'"
						ref="kvCurrencyInputComponentRef"
					/>
				</div>
				<div class="column">
					<label
						class="tw-font-medium"
						for="cause"
					>
						Cause to support
					</label>
					<kv-select
						v-model="selectedGroup"
						id="cause"
						v-kv-track-event="selectedCategoryTracking"
						class="monthly-good-cta__dropdown tw-mb-2"
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
			<!-- Errors and Messaging -->
			<div class="row column tw-text-center">
				<ul class="validation-errors tw-text-danger" v-if="$v.mgAmount.$invalid">
					<li v-if="!$v.mgAmount.required">
						Amount field is required
					</li>
					<li v-if="!$v.mgAmount.minValue || !$v.mgAmount.maxValue">
						Enter an amount of $5-$8,500
					</li>
				</ul>
			</div>
			<div class="row">
				<div class="column">
					<kv-button
						:to="{
							path: '/monthlygood/setup',
							query: {
								amount: this.mgAmount,
								category: this.selectedGroup,
								nextmonth: true
							}
						}"
						v-kv-track-event="['Thanks', 'EXP-SUBS-526-Oct2020', 'click-monthly-good-signup']"
						class="monthly-good-cta__button"
						:state="$v.mgAmount.$invalid ? 'disabled' : ''"
					>
						{{ buttonText }}
					</kv-button>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import numeral from 'numeral';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';

import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';

/**
 * This CTA goes to the MG setup form
 * To prevent an initial error state on max amount
 * on the setup form we'll round this max amount to 8500
 * */
const maxAmount = 8500;

export default {
	name: 'MonthlyGoodCTA',
	components: {
		KvButton,
		KvCurrencyInput,
		KvSelect,
	},
	props: {
		headline: {
			type: String,
			default: 'Grow your lending with Monthly Good!'
		},
		bodyCopy: {
			type: String,
			// eslint-disable-next-line max-len
			default: 'Want to change lives all year long? Sign up for Monthly Good and for as little as $5 a month, you can make a lasting impact on hundreds of borrowers.'
		},
		buttonText: {
			type: String,
			default: 'Sign me up'
		}

	},
	mixins: [
		loanGroupCategoriesMixin,
		validationMixin
	],
	validations: {
		mgAmount: {
			required,
			minValue: minValue(5),
			maxValue: maxValue(maxAmount),
		},
	},
	data() {
		return {
			selectedGroup: 'default',
			mgAmount: 10,
			mgOptionSelected: 10,
			mgAmountOptions: [
				{
					value: 35,
					label: `${numeral(35).format('$0,0.00')}`,
				},
				{
					value: 30,
					label: `${numeral(30).format('$0,0.00')}`,
				},
				{
					value: 25,
					label: `${numeral(25).format('$0,0.00')}`,
				},
				{
					value: 20,
					label: `${numeral(20).format('$0,0.00')}`,
				},
				{
					value: 15,
					label: `${numeral(15).format('$0,0.00')}`,
				},
				{
					value: 10,
					label: `${numeral(10).format('$0,0.00')}`,
				},
				{
					value: 5,
					label: `${numeral(5).format('$0,0.00')}`,
				},
				{
					value: 'other',
					label: 'Other',
				},
			]
		};
	},
	computed: {
		selectedAmountTracking() {
			return ['MonthlyGood', 'click-amount-option', numeral(this.mgOptionSelected).format('$0,0.00')];
		},
		selectedCategoryTracking() {
			return ['MonthlyGood', 'click-category-option', this.selectedGroup];
		},
	},
	watch: {
		mgOptionSelected(newVal) {
			if (newVal === 'other') {
				// Focus on currency input
				this.$nextTick(() => {
					try {
						const kvCurrencyComponent = this.$refs.kvCurrencyInputComponentRef;
						const kvCurrencyInput = kvCurrencyComponent.$refs.kvCurrencyInputRef;
						kvCurrencyInput.focus();
					} catch (e) {
						// noop
					}
				});
			} else {
				// set mgAmount to dropdown value
				this.mgAmount = newVal;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.monthly-good-cta {
	padding: 1.5rem;

	&__dropdown {
		width: 100%;
	}

	&__headline {
		margin-bottom: 1.5rem;
	}

	&__subhead {
		margin-bottom: 2rem;
	}

	&__form {
		max-width: rem-calc(509);
		margin: 0 auto;
	}

	&__button {
		width: 100%;
		margin-top: 1rem;
	}
}
</style>

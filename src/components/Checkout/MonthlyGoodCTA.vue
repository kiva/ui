<template>
	<div class="monthly-good-cta hide-for-print">
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
						:class="{ 'error': $v.mgAmount.$invalid }"
						for="amount"
					>
						Amount
					</label>
					<select
						v-model="mgOptionSelected"
						class="monthly-good-cta__dropdown"
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
					</select>
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
						for="cause"
					>
						Cause to support
					</label>
					<select
						v-model="selectedGroup"
						id="cause"
						class="monthly-good-cta__dropdown"
					>
						<option
							v-for="(option, index) in lendingCategories"
							:value="option.value"
							:key="index"
						>
							{{ option.label }}
						</option>
					</select>
				</div>
			</div>
			<!-- Errors and Messaging -->
			<div class="row column tw-text-center">
				<ul class="validation-errors" v-if="$v.mgAmount.$invalid">
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
					<kv-button :to="{
							path: '/monthlygood/setup',
							query: {
								amount: this.mgAmount,
								category: this.selectedGroup,
								nextmonth: true
							}
						}"
						v-kv-track-event="['Thanks', 'EXP-SUBS-526-Oct2020', 'click-monthly-good-signup']"
						class="monthly-good-cta__button smaller"
						:disabled="$v.mgAmount.$invalid"
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

import KvButton from '@/components/Kv/KvButton';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';

import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

/**
 * This CTA goes to the MG setup form
 * To prevent an initial error state on max amount
 * on the setup form we'll round this max amount to 8500
 * */
const maxAmount = 8500;

export default {
	components: {
		KvButton,
		KvCurrencyInput,
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
	text-align: left;

	@include breakpoint(large) {
		text-align: center;
	}

	&__dropdown {
		width: 100%;
	}

	&__headline {
		@include big-text();

		margin-bottom: 1.5rem;
	}

	&__subhead {
		@include featured-text();

		margin-bottom: 2rem;
	}

	&__form {
		max-width: rem-calc(509);
		margin: 0 auto;
		text-align: center;

		label {
			font-weight: bold;
			text-align: left;
			font-size: 1rem;
		}
	}

	&__button {
		width: 100%;
		margin-top: 1rem;
	}
}

.text-input:not(.error) {
	border: 1px solid $charcoal;
}
</style>

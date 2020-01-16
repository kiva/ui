<template>
	<form @submit.prevent.stop="submit" novalidate>
		<fieldset>
			<label class="show-for-sr" :class="{ 'error': $v.$invalid }" :for="'amount' + componentKey">
				Amount
			</label>
			<kv-currency-input :id="'amount' + componentKey" :value="amount" @input="updateAmount" />
			<ul class="validation-errors" v-if="$v.$invalid">
				<li class="input-error" v-if="!$v.amount.required">
					Field is required
				</li>
				<li class="input-error" v-if="!$v.amount.minValue || !$v.amount.maxValue">
					Enter an amount of $5-$10,000
				</li>
			</ul>
		</fieldset>
		<kv-dropdown-rounded :value="selectedCategory" @input="updateSelected">
			<option v-for="(option, index) in lendingCategories" :value="option.value" :key="index">
				{{ option.label }}
			</option>
		</kv-dropdown-rounded>

		<kv-button class="button smaller" type="submit" :disabled="$v.$invalid">
			Contribute monthly
		</kv-button>
	</form>
</template>


<script>
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import KvButton from '@/components/Kv/KvButton';

export default {
	mixins: [validationMixin],
	components: {
		KvButton,
		KvCurrencyInput,
		KvDropdownRounded,
	},
	validations: {
		amount: {
			required,
			minValue: minValue(5),
			maxValue: maxValue(10000)
		},
	},
	props: {
		amount: {
			type: Number,
			default: 25
		},
		selectedCategory: {
			type: String,
			default: 'default'
		},
	},
	computed: {
		componentKey() {
			// This component can exist multiple times on the page or can be iterated over.
			// If it has a key attribute, then it will be used in the input id to avoid
			// duplicate inputs with the same id.
			return this.$vnode.key || '';
		}
	},
	methods: {
		updateSelected(value) {
			this.$emit('update:selectedCategory', value);
		},
		updateAmount(value) {
			this.$emit('update:amount', value);
		},
		submit() {
		}
	},
	data() {
		return {
			lendingCategories: [
				{
					value: 'default',
					label: 'Support all borrowers'
				},
				{
					value: 'women',
					label: 'Support women'
				},

				{
					value: 'agriculture',
					label: 'Support farmers'
				},
				{
					value: 'refugees',
					label: 'Support refugees'
				},
				{
					value: 'education',
					label: 'Support students'
				},
				{
					value: 'eco_friendly',
					label: 'Support eco-friendly loans'
				}
			],
		};
	},
};

</script>
<style lang="scss">
@import 'settings';

// TODO temporary form CSS, tweak when rest of page is created
.validation-errors {
	margin: 0;
	float: left;

	.input-error {
		list-style: none;
		color: $kiva-accent-red;
		font-weight: $global-weight-highlight;
		font-size: $small-text-font-size;
	}
}

label.error {
	input,
	input:focus {
		border: 1px solid $kiva-accent-red;
	}
}
// end temporary form CSS
</style>

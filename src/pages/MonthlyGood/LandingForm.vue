<template>
	<form @submit.prevent.stop="submit" novalidate>
		<div class="row">
			<fieldset class="large-4 medium-6 small-8 columns">
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
			</fieldset>
			<fieldset class="large-8 medium-6 small-8 columns">
				<kv-dropdown-rounded :value="selectedGroup" @input="updateSelected">
					<option v-for="(option, index) in lendingCategories" :value="option.value" :key="index">
						{{ option.label }}
					</option>
				</kv-dropdown-rounded>
			</fieldset>
		</div>

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
import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';

export default {
	mixins: [
		validationMixin,
		loanGroupCategoriesMixin
	],
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
		selectedGroup: {
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
		// Emits values to parent component to allow the synchronization of 2 landing
		// forms on the same page
		updateSelected(value) {
			this.$emit('update:selectedGroup', value);
		},
		// Emits values to parent component to allow the synchronization of 2 landing
		// forms on the same page
		updateAmount(value) {
			this.$emit('update:amount', value);
		},
		submit() {
			this.$router.push({
				path: '/monthlygood-ui/setup',
				query: {
					amount: this.amount,
					group: this.selectedGroup
				}
			});
		}
	},
};

</script>
<style lang="scss">
@import 'settings';

// styles to match KvDropDownRounded
input[id*="amount"] {
	border: 1px solid $charcoal;
	border-radius: $button-radius;
	color: $charcoal;
	font-size: $medium-text-font-size;
	font-weight: $global-weight-highlight;
	margin: 0;
}
</style>

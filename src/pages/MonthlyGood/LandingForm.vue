<template>
	<form @submit.prevent.stop="submit" novalidate>
		<div class="row">
			<fieldset class="large-4 medium-5 small-12 columns input-wrapper">
				<label class="show-for-sr" :class="{ 'error': $v.$invalid }" :for="'amount-' + componentKey">
					Amount
				</label>
				<kv-currency-input :id="'amount-' + componentKey" :value="amount" @input="updateAmount" />
				<ul class="validation-errors" v-if="$v.$invalid">
					<li v-if="!$v.amount.required">
						Field is required
					</li>
					<li v-if="!$v.amount.minValue || !$v.amount.maxValue">
						Enter an amount of $5-$8,500
					</li>
				</ul>
			</fieldset>
			<fieldset class="large-8 medium-7 small-12 columns">
				<kv-select :value="selectedGroup" @input="updateSelected">
					<option v-for="(option, index) in lendingCategories" :value="option.value" :key="index">
						{{ option.label }}
					</option>
				</kv-select>
			</fieldset>
		</div>

		<kv-button class="smaller" type="submit" :disabled="$v.$invalid" v-kv-track-event="[
			'MonthlyGood',
			`click-start-form-${componentKey}`,
			buttonText
		]"
		>
			{{ buttonText }}
		</kv-button>
	</form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

import KvSelect from '@/components/Kv/KvSelect';
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
		KvSelect,
	},
	validations: {
		amount: {
			required,
			minValue: minValue(5),
			maxValue: maxValue(8500)
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
		buttonText: {
			type: String,
			default: 'Contribute monthly'
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
				path: '/monthlygood/setup',
				query: {
					amount: this.amount,
					category: this.selectedGroup
				}
			});
		}
	},
};

</script>
<style lang="scss" scoped>
@import 'settings';

// styles to match KvSelect
input[type="text"] {
	border-radius: $button-radius;
	color: $charcoal;
	font-size: $medium-text-font-size;
	font-weight: $global-weight-highlight;
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
	padding-bottom: 1rem;
}

.validation-errors {
	padding: 0.15rem 0 0 0;
	margin-bottom: 0;

	li {
		line-height: 1.15rem;
	}
}
</style>

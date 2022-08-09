<template>
	<form @submit.prevent.stop="submit" novalidate>
		<div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-2">
			<fieldset class="tw-basis-full md:tw-hidden">
				<label for="borrower-categories" class="tw-sr-only">Lending category to support</label>
				<kv-select
					class="tw-w-full" id="borrower-categories"
					:model-value="selectedGroup"
					@update:modelValue="updateSelected"
				>
					<option v-for="(option, index) in lendingCategories" :value="option.value" :key="index">
						{{ option.label }}
					</option>
				</kv-select>
			</fieldset>
			<div class="tw-flex tw-gap-2">
				<fieldset class="tw-basis-2/6">
					<label
						class="tw-sr-only" :class="{ 'tw-text-danger': $v.$invalid }"
						:for="'amount-' + componentKey"
					>
						Amount
					</label>
					<kv-currency-input
						:id="'amount-' + componentKey"
						:value="amount"
						@input="updateAmount"
					/>
					<ul class="validation-errors tw-text-danger" v-if="$v.$invalid">
						<li v-if="!$v.amount.required">
							Field is required
						</li>
						<li v-if="!$v.amount.minValue || !$v.amount.maxValue">
							Enter an amount of $5-$8,500
						</li>
					</ul>
				</fieldset>
				<fieldset class="tw-basis-full tw-hidden md:tw-block">
					<label for="borrower-categories" class="tw-sr-only">Lending category to support</label>
					<kv-select
						class="tw-w-full" id="borrower-categories"
						:model-value="selectedGroup"
						@update:modelValue="updateSelected"
					>
						<option v-for="(option, index) in lendingCategories" :value="option.value" :key="index">
							{{ option.label }}
						</option>
					</kv-select>
				</fieldset>
				<kv-button
					class="tw-basis-4/6 tw-mb-2"
					type="submit"
					:disabled="$v.$invalid"
					v-kv-track-event="[
						'MonthlyGood',
						`click-start-form-${componentKey}`,
						buttonText
					]"
				>
					{{ buttonText }}
				</kv-button>
			</div>
		</div>
	</form>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import loanGroupCategoriesMixin from '@/plugins/loan-group-categories';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'LandingFormVisibilityExp',
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
		},
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

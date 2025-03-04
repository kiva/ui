<template>
	<form @submit.prevent.stop="submit" novalidate>
		<div class="tw-flex tw-flex-col tw-gap-2">
			<fieldset class="tw-basis-full">
				<p class="tw-text-h4 tw-mb-2">
					CHOOSE A CATEGORY
				</p>
				<label for="borrower-categories" class="tw-sr-only">Lending category to support</label>
				<kv-select
					class="tw-w-full" id="borrower-categories"
					:model-value="selectedGroup"
					@update:model-value="updateSelected"
				>
					<option v-for="(option, index) in lendingCategories" :value="option.value" :key="index">
						{{ option.label }}
					</option>
				</kv-select>
			</fieldset>
			<div class="tw-flex tw-items-center tw-gap-2">
				<fieldset class="tw-basis-2/6">
					<label
						class="tw-sr-only" :class="{ 'tw-text-danger': v$.$invalid }"
						:for="'amount-' + componentKey"
					>
						Amount
					</label>
					<kv-currency-input
						:id="'amount-' + componentKey"
						v-model="monthlyAmount"
						@input="updateAmount"
					/>
					<ul class="validation-errors tw-text-danger" v-if="v$.$invalid">
						<li v-if="v$.amount?.required?.$invalid">
							Field is required
						</li>
						<li v-if="v$.amount?.minValue?.$invalid || v$.amount?.maxValue?.$invalid">
							Enter an amount of $5-$8,500
						</li>
					</ul>
				</fieldset>
				<kv-button
					class="tw-basis-4/6"
					style="margin-top: 0;"
					type="submit"
					:disabled="v$.$invalid"
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
import { getCurrentInstance } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue } from '@vuelidate/validators';

import KvCurrencyInput from '#src/components/Kv/KvCurrencyInput';
import loanGroupCategoriesMixin from '#src/plugins/loan-group-categories';
import { KvSelect, KvButton } from '@kiva/kv-components';

export default {
	name: 'LandingForm',
	mixins: [
		loanGroupCategoriesMixin
	],
	components: {
		KvButton,
		KvCurrencyInput,
		KvSelect,
	},
	validations() {
		return {
			amount: {
				required,
				minValue: minValue(5),
				maxValue: maxValue(8500)
			}
		};
	},
	emits: ['update:amount', 'update:selectedGroup'],
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
	data() {
		return {
			monthlyAmount: this.amount,
		};
	},
	setup() { return { v$: useVuelidate() }; },
	computed: {
		componentKey() {
			// This component can exist multiple times on the page or can be iterated over.
			// If it has a key attribute, then it will be used in the input id to avoid
			// duplicate inputs with the same id.
			return getCurrentInstance().vnode.key || '';
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
	watch: {
		amount(newValue) {
			if (newValue !== this.monthlyAmount) {
				this.monthlyAmount = newValue;
			}
		}
	}
};

</script>

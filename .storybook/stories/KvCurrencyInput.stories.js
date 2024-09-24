import KvCurrencyInput from '#src/components/Kv/KvCurrencyInput';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue } from '@vuelidate/validators';

export default {
	title: 'Kv/Form Elements/KvCurrencyInput',
	component: KvCurrencyInput
};

export const Default = () => ({
	components: {
		KvCurrencyInput
	},
	data() {
		return {
			amount: 25,
		}
	},
	template: `
		<fieldset>
			<label class="input-label"for="amount">
				Amount
			</label>
			<kv-currency-input id="amount" v-model="amount"/>
		</fieldset>
	`
});

export const WithValidation = () => ({
	validations() {
		return {
			amount: {
				required,
				minValue: minValue(5),
				maxValue: maxValue(10000)
			}
		}
	},
	components: {
		KvCurrencyInput
	},
	data() {
		return {
			amount: 25,
		}
	},
	setup() { return { v$: useVuelidate() }; },
	template: `
		<fieldset>
			<label :style="{ ...(v$.$invalid && { color: 'red' })}" for="amount">
				Amount
			</label>
			<kv-currency-input id="amount" v-model="amount"/>
			<ul class="validation-errors">
				<li v-if="v$.amount?.required?.$invalid">Field is required</li>
				<li v-if="v$.amount?.minValue?.$invalid || v$.amount?.maxValue?.$invalid">
					Enter an amount of $5-$10,000
				</li>
			</ul>
		</fieldset>
	`
});

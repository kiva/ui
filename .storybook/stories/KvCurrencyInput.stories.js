import KvCurrencyInput from '#src/components/Kv/KvCurrencyInput';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

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
		mixins: [validationMixin],
		validations: {
			amount: {
				required,
				minValue: minValue(5),
				maxValue: maxValue(10000)
			},
		},
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
				<label :class="{ 'error': $v.$invalid }" for="amount">
					Amount
				</label>
				<kv-currency-input id="amount" v-model="amount"/>
				<ul class="validation-errors">
					<li v-if="!$v.amount.required">Field is required</li>
					<li v-if="!$v.amount.minValue || !$v.amount.maxValue">
						Enter an amount of $5-$10,000
					</li>
				</ul>
			</fieldset>
		`
	});

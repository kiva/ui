import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

export default { title: 'Kv | Form Elements/KvCurrencyInput' };

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
				<kv-currency-input id="amount" v-model="amount"/>
			</label>
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
				<label class="input-label" :class="{ 'error': $v.$invalid }" for="amount">
					<kv-currency-input id="amount" v-model="amount"/>
					<ul class="validation-errors">
						<li class="input-error" v-if="!$v.amount.required">Field is required</li>
						<li class="input-error" v-if="!$v.amount.minValue || !$v.amount.maxValue">
							Enter an amount of $5-$10,000
						</li>
					</ul>
				</label>
			</fieldset>
		`
	});

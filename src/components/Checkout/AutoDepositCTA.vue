<template>
	<div class="auto-deposit-cta tw-text-left md:tw-text-center hide-for-print">
		<h2 class="auto-deposit-cta__headline">
			Finish your<br> auto-deposit sign up
		</h2>
		<p v-if="bodyCopy" class="auto-deposit-cta__subhead">
			{{ bodyCopy }}
		</p>
		<form
			class="auto-deposit-cta__form"
			@submit.prevent
			novalidate
		>
			<div class="">
				<div>
					<p class="tw-mb-2">
						Starting today, we’ll process the following on the
						<kv-text-input v-if="isDayInputShown"
							@blur="hideDayInput()"
							class="text-input"
							id="dayOfMonth"
							type="number"
							placeholder=""
							required
							min="1"
							max="31"
							v-model.number="dayOfMonth"
						/>
						<button
							class="tw-text-action hover:tw-text-action-highlight"
							@click="isDayInputShown = true"
							v-if="!isDayInputShown"
						>
							<strong>{{ dayOfMonth | numeral('Oo') }}</strong> of each month:
						</button>
					</p>
				</div>
				<div class="tw-mb-2.5">
					<label
						class="tw-sr-only"
						:class="{ 'error': $v.adAmount.$invalid }"
						for="amount"
					>
						Amount
					</label>
					<kv-select
						v-model="adOptionSelected"
						class="auto-deposit-cta__dropdown tw-mb-2"
						v-if="adOptionSelected !== 'other'"
						id="amount"
					>
						<option
							v-for="(option, index) in adAmountOptions"
							:value="option.value"
							:key="index"
						>
							{{ option.label }}
						</option>
					</kv-select>
					<kv-currency-input
						class="text-input"
						:class="{ 'error': $v.adAmount.$invalid }"
						id="amount"
						v-model="adAmount"
						v-if="adOptionSelected === 'other'"
						ref="kvCurrencyInputComponentRef"
					/>
				</div>
			</div>
			<!-- Errors and Messaging -->
			<div class="row column tw-text-center tw-mb-2.5">
				<ul class="validation-errors tw-text-danger" v-if="$v.adAmount.$invalid">
					<li v-if="!$v.adAmount.required">
						Amount field is required
					</li>
					<li v-if="!$v.adAmount.minValue || !$v.adAmount.maxValue">
						Enter an amount of $5-$8,500
					</li>
				</ul>
			</div>

			<h3 class="tw-text-right tw-mb-4">
				Total: {{ adOptionSelected | numeral('$0.00') }}
			</h3>

			<div v-if="isClientReady" class="">
				<!-- TODO: Fix activeLoginCheck on thanks route -->
				<div class="tw-text-center tw-relative">
					<div class="payment-dropin-invalid-cover" v-if="$v.$invalid"></div>
					<auto-deposit-drop-in-payment-wrapper
						:amount="adAmount"
						:donate-amount="donation"
						:day-of-month="dayOfMonth"
						@complete-transaction="completeADBraintree"
					/>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import numeral from 'numeral';
import { validationMixin } from 'vuelidate';
import { required, minValue, maxValue } from 'vuelidate/lib/validators';

import AutoDepositDropInPaymentWrapper from '@/components/AutoDeposit/AutoDepositDropInPaymentWrapper';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';

import KvSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

// arbitrary number below 10k
const maxAmount = 10000;

export default {
	components: {
		AutoDepositDropInPaymentWrapper,
		KvCurrencyInput,
		KvSelect,
		KvTextInput,
	},
	props: {
		// TODO: Implement Contentful Driven Content
		headline: {
			type: String,
			default: 'Finish your auto-deposit sign up'
		},
		// TODO: Implement Contentful Driven Content
		bodyCopy: {
			type: String,
			// eslint-disable-next-line max-len
			default: ''
		},
		// TODO: Implement Contentful Driven Content
		buttonText: {
			type: String,
			default: 'Complete auto-deposit'
		}

	},
	mixins: [
		validationMixin
	],
	validations: {
		adAmount: {
			required,
			minValue: minValue(5),
			maxValue: maxValue(maxAmount),
		},
		donation: {
			minValue: minValue(0),
			maxValue: maxValue(maxAmount),
			combinedTotal(value) {
				return value + this.adAmount < maxAmount && value + this.adAmount > 0;
			}
		},
		dayOfMonth: {
			required,
			minValue: minValue(1),
			maxValue: maxValue(31)
		},
	},
	data() {
		return {
			adAmount: 5,
			adOptionSelected: 5,
			adAmountOptions: [
				{
					value: 35,
					label: `${numeral(35).format('$0,0.00')} / month`,
				},
				{
					value: 30,
					label: `${numeral(30).format('$0,0.00')} / month`,
				},
				{
					value: 25,
					label: `${numeral(25).format('$0,0.00')} / month`,
				},
				{
					value: 20,
					label: `${numeral(20).format('$0,0.00')} / month`,
				},
				{
					value: 15,
					label: `${numeral(15).format('$0,0.00')} / month`,
				},
				{
					value: 10,
					label: `${numeral(10).format('$0,0.00')} / month`,
				},
				{
					value: 5,
					label: `${numeral(5).format('$0,0.00')} / month`,
				},
				{
					value: 'other',
					label: 'Other',
				},
			],
			dayOfMonth: new Date().getDate(),
			donation: 0,
			isClientReady: false,
			isDayInputShown: false,
			showLoadingOverlay: false
		};
	},
	watch: {
		adOptionSelected(newVal) {
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
				// set adAmount to dropdown value
				this.adAmount = newVal;
			}
		}
	},
	methods: {
		completeADBraintree() {
			this.showLoadingOverlay = true;
			this.$kvTrackEvent('Registration', 'successful-auto-deposit-reg', 'register-auto-deposit-thanks');
			// Send to thanks page
			this.$router.push({
				path: '/auto-deposit/thanks',
			}).finally(() => {
				this.showLoadingOverlay = false;
			});
		},
		hideDayInput() {
			if (!this.$v.dayOfMonth.$invalid) {
				this.isDayInputShown = false;
			}
		},
	},
	mounted() {
		this.isClientReady = !this.$isServer;
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.auto-deposit-cta {
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

<template>
	<div class="auto-deposit-cta tw-text-center hide-for-print">
		<div class="tw-m-3">
			<img
				class="tw-mx-auto"
				:src="imageRequire(`./loan-re-cycle.svg`)"
				alt="loan to loan relending graphic"
			>
		</div>
		<h2 class="auto-deposit-cta__headline">
			{{ headline }}
		</h2>
		<p v-if="bodyCopy" class="auto-deposit-cta__subhead tw-text-left">
			{{ bodyCopy }}
		</p>
		<hr class="tw-my-4">
		<form
			class="auto-deposit-cta__form"
			@submit.prevent
			novalidate
		>
			<div class="">
				<div class="tw-mb-2 tw-text-left">
					<p class="tw-mb-1">
						Starting today, we’ll process the following on the
						<kv-text-input
							v-if="isDayInputShown"
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
							v-kv-track-event="['Thanks', 'click-Edit-auto-deposit-date', 'auto-deposit-edit-date']"
						>
							<strong>{{ dayOfMonth | numeral('Oo') }}</strong> of each month:
						</button>
					</p>
					<!-- Errors and Messaging -->
					<ul class="validation-errors tw-mb-1" v-if="$v.dayOfMonth.$invalid">
						<li v-if="!$v.dayOfMonth.required">
							Day field is required
						</li>
						<li v-if="!$v.dayOfMonth.minValue || !$v.dayOfMonth.maxValue">
							Enter day of month - 1 to 31
						</li>
					</ul>
					<small v-if="!$v.dayOfMonth.$invalid && dayOfMonth > 28" class="tw-mb-1">
						(note - deposit may be processed on the last day of the month)
					</small>
				</div>
				<div class="tw-mb-2.5 tw-flex">
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
						class="text-input tw-flex-1"
						:class="{ 'error': $v.adAmount.$invalid }"
						id="amount"
						v-model="adAmount"
						v-if="adOptionSelected === 'other'"
						ref="kvCurrencyInputComponentRef"
					/>
					<button
						v-if="adOptionSelected === 'other'"
						class="tw-flex tw-items-center tw-justify-center tw-h-6 tw-w-4"
						@click="adOptionSelected = 10"
						v-kv-track-event="[
							'Thanks',
							'click-Close-custom-auto-deposit-amount',
							'close-auto-deposit-custom-amount']
						"
					>
						<kv-material-icon
							class="tw-h-3 tw-w-3"
							:icon="mdiClose"
						/>
					</button>
				</div>
				<!-- Errors and Messaging -->
				<ul class="validation-errors tw-text-danger tw-mb-2" v-if="$v.adAmount.$invalid">
					<li v-if="!$v.adAmount.required">
						Amount field is required
					</li>
					<li v-if="!$v.adAmount.minValue || !$v.adAmount.maxValue">
						Enter an amount of $5-$10,000
					</li>
				</ul>
			</div>

			<h3 class="tw-text-right tw-mb-4">
				Total: {{ adAmount | numeral('$0.00') }}
			</h3>

			<div v-if="isClientReady">
				<!-- TODO: Fix activeLoginCheck on thanks route -->
				<div class="tw-text-center tw-relative">
					<div class="payment-dropin-invalid-cover" v-if="$v.$invalid"></div>
					<auto-deposit-drop-in-payment-wrapper
						class="tw-mx-auto"
						:amount="adAmount"
						:button-text="buttonText"
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
import { mdiClose } from '@mdi/js';

import AutoDepositDropInPaymentWrapper from '@/components/AutoDeposit/AutoDepositDropInPaymentWrapper';
import KvCurrencyInput from '@/components/Kv/KvCurrencyInput';

import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvSelect from '~/@kiva/kv-components/vue/KvSelect';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

const imageRequire = require.context('@/assets/images/kiva-classic-illustrations/', true);

// arbitrary number below 10k
const maxAmount = 10000;

export default {
	name: 'AutoDepositCTA',
	components: {
		AutoDepositDropInPaymentWrapper,
		KvCurrencyInput,
		KvMaterialIcon,
		KvSelect,
		KvTextInput,
	},
	props: {
		// TODO: Implement Contentful Driven Content
		headline: {
			type: String,
			default: 'Never forget to lend'
		},
		// TODO: Implement Contentful Driven Content
		bodyCopy: {
			type: String,
			// eslint-disable-next-line max-len
			default: 'Do more good by setting aside money each month. It’s easy to set up and you get to choose every borrower you support.'
		},
		// TODO: Implement Contentful Driven Content
		buttonText: {
			type: String,
			default: 'Join today'
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
			dayOfMonth: parseInt(new Date().getDate(), 10),
			donation: 0,
			imageRequire,
			isClientReady: false,
			isDayInputShown: false,
			mdiClose,
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
				this.adAmount = parseInt(newVal, 10);
			}
			this.$kvTrackEvent('Thanks', 'Select-auto-deposit-amount', 'select-auto-deposit-amount', newVal, newVal);
		}
	},
	methods: {
		completeADBraintree() {
			this.showLoadingOverlay = true;
			this.$kvTrackEvent('Registration', 'successful-auto-deposit-reg', 'register-auto-deposit-upsell');
			this.$kvTrackEvent('Thanks', 'successful-auto-deposit-reg', 'register-auto-deposit-upsell');
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

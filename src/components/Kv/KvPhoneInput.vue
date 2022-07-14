<template>
	<div
		class="kv-phone-input"
		:class="{
			'kv-phone-input--is-empty': isEmpty,
			'kv-phone-input--is-invalid': !isValid,
			'kv-phone-input--is-valid': isValid,
		}"
	>
		<div class="kv-phone-input__wrapper">
			<label
				class="tw-sr-only"
				:for="`country_select_${id}`"
			>
				Select your country
			</label>

			<div class="kv-phone-input__select-wrapper">
				<kv-flag
					class="kv-phone-input__select-flag"
					:country="selectedCountryCode"
					:inline-svg="true"
				/>

				<select
					class="kv-phone-input__select-country"
					:id="`country_select_${id}`"
					v-model="selectedCountryCode"
					@change="onInputCountry"
					:disabled="disabled"
				>
					<option
						v-for="country in countryList"
						:key="`country-${country.name}`"
						:value="country.code"
					>
						{{ country.name }}
					</option>
				</select>
			</div>

			<span class="kv-phone-input__country-prefix">
				+{{ countryCallingCode }}
			</span>

			<kv-text-input
				type="tel"
				class="kv-phone-input__input"
				:id="id"
				:placeholder="placeholderNumber"
				:value="displayNumber"
				:disabled="disabled"
				:valid="valid"
				v-bind="$attrs"
				v-on="inputListeners"
				@input="onInputPhoneNumber"
			/>
		</div>
	</div>
</template>

<script>
import { getCountryList } from 'flag-icon-css';
import {
	AsYouType,
	getCountryCallingCode,
	getCountries as getSupportedCountryCodes,
	getExampleNumber,
	parsePhoneNumberFromString,
} from 'libphonenumber-js';
import exampleNumbers from 'libphonenumber-js/examples.mobile.json'; // used for populating placeholders
import KvFlag from '@/components/Kv/KvFlag';
import KvTextInput from '~/@kiva/kv-components/vue/KvTextInput';

const supportedCountryCodes = getSupportedCountryCodes();
const countryList = getCountryList() // get all country names and codes
	.filter(countryObj => supportedCountryCodes.includes(countryObj.code)) // remove unsupported countries
	.sort((a, b) => a.name.localeCompare(b.name)); // alphabetize

export default {
	name: 'KvPhoneInput',
	components: {
		KvFlag,
		KvTextInput
	},
	model: {
		prop: 'value',
		event: 'input'
	},
	props: {
		id: {
			type: String,
			required: true
		},
		value: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		valid: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			countryList,
			displayNumber: this.formatPhoneNumber(this.value), // pretty display of the phone number
			selectedCountryCode: 'US',
		};
	},
	computed: {
		countryCallingCode() {
			return getCountryCallingCode(this.selectedCountryCode);
		},
		e164Number() { // E.164 formatted phone number
			const phoneNumber = parsePhoneNumberFromString(this.displayNumber, this.selectedCountryCode);
			return phoneNumber?.number || '';
		},
		isEmpty() {
			return this.displayNumber.length === 0;
		},
		isValid() {
			const phoneNumber = parsePhoneNumberFromString(this.displayNumber, this.selectedCountryCode);
			return phoneNumber?.isValid() || false;
		},
		placeholderNumber() {
			return getExampleNumber(this.selectedCountryCode, exampleNumbers)?.formatNational() || '';
		},
		inputListeners() {
			return {
				// Pass through any listeners from the parent to the input element, like blur, focus, etc. ...
				// https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components
				...this.$listeners,
				// ...except for the listener to the 'input' event which is emitted by this component
				input: () => {},
			};
		},
	},
	watch: {
		isValid() {
			this.emitValidity();
		}
	},
	inheritAttrs: false,
	methods: {
		formatPhoneNumber(val) {
			// workaround for https://github.com/catamphetamine/libphonenumber-js/issues/225
			if (val.includes('(') && !val.includes(')')) {
				return val.replace('(', '');
			}

			const asYouTypeFormatter = new AsYouType(this.selectedCountryCode);
			return asYouTypeFormatter.input(val);
		},
		onInputCountry() {
			this.displayNumber = this.formatPhoneNumber(this.displayNumber);
			this.emitUpdatedNumber();
		},
		onInputPhoneNumber(value) {
			this.displayNumber = this.formatPhoneNumber(value);
			this.emitUpdatedNumber();
		},
		emitUpdatedNumber() {
			/**
			 * The value of the input in E.164 formatting
			 * @event input
			 * @type {Event}
			 */
			this.$emit('input', this.e164Number);
		},
		emitValidity() {
			/**
			 * Whether the input number is a valid phone number
			 * @event validity-changed
			 * @type {Event}
			 */
			this.$emit('validity-changed', this.isValid);
		},
		setCountryFromNumber(num) {
			const phoneNumber = parsePhoneNumberFromString(num);
			if (phoneNumber?.country) {
				this.selectedCountryCode = phoneNumber.country;
				this.displayNumber = this.formatPhoneNumber(phoneNumber.formatNational());
			}
		}
	},
	async created() {
		await this.$nextTick();
		this.setCountryFromNumber(this.e164Number);
		this.emitValidity();
	}
};
</script>

<style lang="scss" scoped>
@import "settings";

.kv-phone-input {
	&__wrapper {
		display: flex;
		align-items: center;
	}

	&__country-prefix {
		margin: 0 0.5rem;
	}

	&__select-wrapper {
		position: relative;
	}

	&__select-country {
		width: rem-calc(56);
		height: rem-calc(56 * 0.75);
	}

	&__select-flag {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: rem-calc(56);
		margin: 0;
		pointer-events: none;
		border-color: transparent;
	}

	/* &--is-invalid:not(.kv-phone-input--is-empty) {
		.kv-phone-input__input {
			border-color: red;
		}
	}

	&--is-valid:not(.kv-phone-input--is-empty) {
		.kv-phone-input__input {
			border-color: green;
		}
	} */
}
</style>

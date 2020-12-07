<template>
	<div class="kv-phone-input"
		:class="{
			'kv-phone-input--is-empty': isEmpty,
			'kv-phone-input--is-invalid': !isValid,
			'kv-phone-input--is-valid': isValid,
		}"
	>
		<div class="kv-phone-input__wrapper">
			<label
				class="show-for-sr"
				:for="`country_select_${id}`"
			>
				Select your country
			</label>

			<kv-dropdown-rounded
				class="kv-phone-input__country-select"
				:id="`country_select_${id}`"
				v-model="selectedCountryCode"
				@input="onInputCountry"
			>
				<option
					v-for="country in countryList"
					:key="`country-${country.code}`"
					:value="country.code"
				>
					{{ country.name }}
				</option>
			</kv-dropdown-rounded>

			<span class="kv-phone-input__country-prefix">
				+{{ countryCallingCode }}
			</span>

			<input type="tel"
				class="kv-phone-input__input"
				:id="id"
				:placeholder="placeholderNumber"
				:value="displayNumber"
				@input="onInputPhoneNumber"
			>
		</div>
		<div>
			DEBUG:<br>
			Valid: {{ isValid }}<br>
			E.164 number: {{ e164Number }}
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
import KvDropdownRounded from '@/components/Kv/KvDropdownRounded';

const supportedCountryCodes = getSupportedCountryCodes();
const countryList = getCountryList() // get all country names and codes
	.filter(countryObj => supportedCountryCodes.includes(countryObj.code)) // remove unsupported countries
	.sort((a, b) => a.name.localeCompare(b.name)); // alphabetize

export default {
	components: {
		KvDropdownRounded
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
			return phoneNumber?.isValid();
		},
		placeholderNumber() {
			return getExampleNumber(this.selectedCountryCode, exampleNumbers)?.formatNational() || '';
		},
	},
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
		onInputPhoneNumber(e) {
			this.displayNumber = this.formatPhoneNumber(e.target.value);
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
	}
};
</script>

<style lang="scss" scoped>
@import "settings";

.kv-phone-input {
	&__wrapper {
		display: flex;
		align-items: baseline;
	}

	&__country-select {
		width: rem-calc(200);
	}

	&__country-prefix {
		margin: 0 1rem;
	}

	&--is-invalid:not(.kv-phone-input--is-empty) {
		.kv-phone-input__input {
			border-color: red;
		}
	}

	&--is-valid:not(.kv-phone-input--is-empty) {
		.kv-phone-input__input {
			border-color: green;
		}
	}
}
</style>

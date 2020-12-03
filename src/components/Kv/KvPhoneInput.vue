<template>
	<div class="kv-phone-input"
		:class="{
			'kv-phone-input--is-empty': isEmpty,
			'kv-phone-input--is-invalid': !isValid,
			'kv-phone-input--is-valid': isValid,
		}"
	>
		<div class="kv-phone-input__wrapper">
			<kv-dropdown-rounded
				class="kv-phone-input__country-select"
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
				:placeholder="placeholderNumber"
				:value="displayValue"
				@input="onInputPhoneNumber"
			>
		</div>
		<div>
			DEBUG:<br>
			Valid: {{ isValid }}<br>
			E.164 number: {{ e164Value }}
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
	data() {
		return {
			asYouTypeFormatter: new AsYouType('US'), // initial instance of the libphonenumber formatter class
			countryList,
			displayValue: '', // pretty display of the phone number
			selectedCountryCode: 'US',
		};
	},
	computed: {
		isEmpty() {
			return this.displayValue.length === 0;
		},
		isValid() {
			return this.asYouTypeFormatter?.isValid();
		},
		countryCallingCode() {
			return this.asYouTypeFormatter?.getNumber()?.countryCallingCode
			|| getCountryCallingCode(this.selectedCountryCode);
		},
		placeholderNumber() {
			return getExampleNumber(this.selectedCountryCode, exampleNumbers)?.formatNational() || '';
		},
		e164Value() { // E.164 formatted phone number
			return this.asYouTypeFormatter?.getNumber()?.number || '';
		}
	},
	methods: {
		onInputCountry() {
			this.displayValue = this.formatNumber(this.displayValue);
		},
		onInputPhoneNumber(e) {
			this.displayValue = this.formatNumber(e.target.value);
			this.$emit('input', this.e164Value);
		},
		formatNumber(val) {
			this.asYouTypeFormatter = new AsYouType(this.selectedCountryCode);
			return this.asYouTypeFormatter.input(val);
		},
	},
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

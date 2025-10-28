import {
	describe, expect, it, vi
} from 'vitest';
import { render } from '@testing-library/vue';
import KvPhoneInput from '#src/components/Kv/KvPhoneInput';

// Mock libphonenumber-js
vi.mock('libphonenumber-js', () => ({
	AsYouType: vi.fn().mockImplementation(() => ({
		input: vi.fn(val => val),
	})),
	getCountryCallingCode: vi.fn(() => '1'),
	getCountries: vi.fn(() => ['US', 'CA', 'GB']),
	getExampleNumber: vi.fn(() => ({
		formatNational: () => '(555) 555-5555',
	})),
	parsePhoneNumberFromString: vi.fn(() => ({
		number: '+15555555555',
		country: 'US',
		isValid: () => true,
		formatNational: () => '(555) 555-5555',
	})),
}));

// Mock flag-icon-css
vi.mock('flag-icon-css', () => ({
	getCountryList: vi.fn(() => [
		{ code: 'US', name: 'United States' },
		{ code: 'CA', name: 'Canada' },
		{ code: 'GB', name: 'United Kingdom' },
	]),
}));

// Mock child components
const KvFlag = {
	name: 'KvFlag',
	template: '<div class="kv-flag"></div>',
	props: ['country', 'name'],
};

const KvTextInput = {
	name: 'KvTextInput',
	template: '<input type="tel" v-bind="$attrs" v-model="modelValue" />',
	props: ['modelValue', 'type', 'placeholder', 'disabled', 'valid', 'id'],
	emits: ['input', 'update:modelValue'],
};

const global = {
	stubs: {
		KvFlag,
		KvTextInput,
	},
};

describe('KvPhoneInput.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvPhoneInput).toBeDefined();
		expect(KvPhoneInput.name).toBe('KvPhoneInput');
	});

	it('requires id prop', () => {
		expect(KvPhoneInput.props.id.required).toBe(true);
	});

	it('requires modelValue prop', () => {
		expect(KvPhoneInput.props.modelValue.required).toBe(true);
	});

	it('has disabled prop with default false', () => {
		expect(KvPhoneInput.props.disabled.default).toBe(false);
	});

	it('has valid prop with default true', () => {
		expect(KvPhoneInput.props.valid.default).toBe(true);
	});

	it('renders phone input wrapper', () => {
		const { container } = render(KvPhoneInput, {
			props: {
				id: 'phone-input',
				modelValue: '',
			},
			global,
		});

		const wrapper = container.querySelector('.kv-phone-input');
		expect(wrapper).toBeTruthy();
	});

	it('renders country select', () => {
		const { container } = render(KvPhoneInput, {
			props: {
				id: 'phone-input',
				modelValue: '',
			},
			global,
		});

		const select = container.querySelector('.kv-phone-input__select-country');
		expect(select).toBeTruthy();
	});

	it('renders country flag', () => {
		const { container } = render(KvPhoneInput, {
			props: {
				id: 'phone-input',
				modelValue: '',
			},
			global,
		});

		const flag = container.querySelector('.kv-flag');
		expect(flag).toBeTruthy();
	});

	it('renders country calling code', () => {
		const { container } = render(KvPhoneInput, {
			props: {
				id: 'phone-input',
				modelValue: '',
			},
			global,
		});

		const prefix = container.querySelector('.kv-phone-input__country-prefix');
		expect(prefix).toBeTruthy();
		expect(prefix.textContent).toContain('+');
	});

	it('renders KvTextInput for phone number', () => {
		const { container } = render(KvPhoneInput, {
			props: {
				id: 'phone-input',
				modelValue: '',
			},
			global,
		});

		const input = container.querySelector('input[type="tel"]');
		expect(input).toBeTruthy();
	});

	it('has countryCallingCode computed property', () => {
		expect(KvPhoneInput.computed.countryCallingCode).toBeDefined();
	});

	it('has e164Number computed property', () => {
		expect(KvPhoneInput.computed.e164Number).toBeDefined();
	});

	it('has isEmpty computed property', () => {
		expect(KvPhoneInput.computed.isEmpty).toBeDefined();
	});

	it('has isValid computed property', () => {
		expect(KvPhoneInput.computed.isValid).toBeDefined();
	});

	it('has placeholderNumber computed property', () => {
		expect(KvPhoneInput.computed.placeholderNumber).toBeDefined();
	});

	it('watches isValid changes', () => {
		expect(KvPhoneInput.watch.isValid).toBeDefined();
	});

	it('emits input event', () => {
		expect(KvPhoneInput.emits).toContain('input');
	});

	it('emits validity-changed event', () => {
		expect(KvPhoneInput.emits).toContain('validity-changed');
	});

	it('has formatPhoneNumber method', () => {
		expect(KvPhoneInput.methods.formatPhoneNumber).toBeDefined();
	});

	it('has onInputCountry method', () => {
		expect(KvPhoneInput.methods.onInputCountry).toBeDefined();
	});

	it('has onInputPhoneNumber method', () => {
		expect(KvPhoneInput.methods.onInputPhoneNumber).toBeDefined();
	});

	it('has emitUpdatedNumber method', () => {
		expect(KvPhoneInput.methods.emitUpdatedNumber).toBeDefined();
	});

	it('has emitValidity method', () => {
		expect(KvPhoneInput.methods.emitValidity).toBeDefined();
	});

	it('has setCountryFromNumber method', () => {
		expect(KvPhoneInput.methods.setCountryFromNumber).toBeDefined();
	});

	it('has inheritAttrs set to false', () => {
		expect(KvPhoneInput.inheritAttrs).toBe(false);
	});

	it('applies is-empty class when empty', () => {
		const { container } = render(KvPhoneInput, {
			props: {
				id: 'phone-input',
				modelValue: '',
			},
			global,
		});

		const wrapper = container.querySelector('.kv-phone-input--is-empty');
		expect(wrapper).toBeTruthy();
	});

	it('renders label for country select', () => {
		const { container } = render(KvPhoneInput, {
			props: {
				id: 'phone-input',
				modelValue: '',
			},
			global,
		});

		const label = container.querySelector('label[for="country_select_phone-input"]');
		expect(label).toBeTruthy();
		expect(label.textContent).toContain('Select your country');
	});

	it('label has sr-only class', () => {
		const { container } = render(KvPhoneInput, {
			props: {
				id: 'phone-input',
				modelValue: '',
			},
			global,
		});

		const label = container.querySelector('label.tw-sr-only');
		expect(label).toBeTruthy();
	});

	it('can be disabled', () => {
		const { container } = render(KvPhoneInput, {
			props: {
				id: 'phone-input',
				modelValue: '',
				disabled: true,
			},
			global,
		});

		const select = container.querySelector('select');
		expect(select.disabled).toBe(true);
	});

	it('renders country options', () => {
		const { container } = render(KvPhoneInput, {
			props: {
				id: 'phone-input',
				modelValue: '',
			},
			global,
		});

		const options = container.querySelectorAll('option');
		expect(options.length).toBeGreaterThan(0);
	});
});

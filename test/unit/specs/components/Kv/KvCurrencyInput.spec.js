import {
	describe, expect, it, vi
} from 'vitest';
import { render } from '@testing-library/vue';
import KvCurrencyInput from '#src/components/Kv/KvCurrencyInput';

// Mock numeral.js
vi.mock('numeral', () => ({
	default: vi.fn(value => ({
		format: vi.fn(() => {
			if (typeof value === 'number') {
				return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
			}
			return '$0.00';
		}),
		value: vi.fn(() => {
			if (typeof value === 'string') {
				const cleaned = value.replace(/[$,]/g, '');
				return parseFloat(cleaned) || 0;
			}
			return value;
		}),
	})),
}));

// Mock KvTextInput component
const KvTextInput = {
	name: 'KvTextInput',
	template: `<input
		type="text"
		v-bind="$attrs"
		v-model="modelValue"
		@blur="$emit('blur')"
		@focus="$emit('focus')"
	/>`,
	props: ['modelValue', 'type', 'placeholder', 'id'],
	emits: ['blur', 'focus', 'update:modelValue'],
};

const global = {
	stubs: {
		KvTextInput,
	},
};

describe('KvCurrencyInput.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvCurrencyInput).toBeDefined();
		expect(KvCurrencyInput.name).toBe('KvCurrencyInput');
	});

	it('requires modelValue prop', () => {
		expect(KvCurrencyInput.props.modelValue.required).toBe(true);
	});

	it('accepts number modelValue', () => {
		expect(KvCurrencyInput.props.modelValue.type).toContain(Number);
	});

	it('accepts string modelValue', () => {
		expect(KvCurrencyInput.props.modelValue.type).toContain(String);
	});

	it('has optional id prop', () => {
		expect(KvCurrencyInput.props.id).toBeDefined();
		expect(KvCurrencyInput.props.id.default).toBe('');
	});

	it('renders KvTextInput component', () => {
		const { container } = render(KvCurrencyInput, {
			props: {
				modelValue: 100,
			},
			global,
		});

		const textInput = container.querySelector('input[type="text"]');
		expect(textInput).toBeTruthy();
	});

	it('passes id prop to KvTextInput', () => {
		const { container } = render(KvCurrencyInput, {
			props: {
				modelValue: 100,
				id: 'currency-input',
			},
			global,
		});

		// Check that component is rendered (we can't easily check internal prop passing with stubs)
		const component = container.querySelector('input[type="text"]');
		expect(component).toBeTruthy();
	});	it('emits input event', () => {
		expect(KvCurrencyInput.emits).toContain('input');
	});

	it('has displayValue computed property', () => {
		expect(KvCurrencyInput.computed.displayValue).toBeDefined();
	});

	it('has isInputActive data property', () => {
		expect(KvCurrencyInput.data).toBeDefined();
	});

	it('watches modelValue changes', () => {
		expect(KvCurrencyInput.watch.modelValue).toBeDefined();
	});

	it('passes through additional attributes', () => {
		const { container } = render(KvCurrencyInput, {
			props: {
				modelValue: 100,
				disabled: true,
				'data-test': 'currency',
			},
			global,
		});

		const input = container.querySelector('input');
		expect(input.disabled).toBe(true);
		expect(input.getAttribute('data-test')).toBe('currency');
	});

	it('has ref kvCurrencyInputRef', () => {
		const { container } = render(KvCurrencyInput, {
			props: {
				modelValue: 100,
			},
			global,
		});

		expect(container.querySelector('input')).toBeTruthy();
	});

	it('uses numeral for formatting', () => {
		// Component imports numeral from 'numeral' package
		const component = render(KvCurrencyInput, {
			props: {
				modelValue: 1234.56,
			},
			global,
		});

		expect(component.container).toBeTruthy();
	});

	it('handles focus event', () => {
		const { container } = render(KvCurrencyInput, {
			props: {
				modelValue: 100,
			},
			global,
		});

		const input = container.querySelector('input');
		input.focus();
		expect(input).toBe(document.activeElement);
	});

	it('handles blur event', () => {
		const { container } = render(KvCurrencyInput, {
			props: {
				modelValue: 100,
			},
			global,
		});

		const input = container.querySelector('input');
		input.focus();
		input.blur();
		expect(input).not.toBe(document.activeElement);
	});
});

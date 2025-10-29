import {
	render, fireEvent
} from '@testing-library/vue';
import KvVerificationCodeInput from '../../../../../src/components/Kv/KvVerificationCodeInput';

describe('KvVerificationCodeInput.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvVerificationCodeInput).toBeDefined();
		expect(KvVerificationCodeInput.name).toBe('KvVerificationCodeInput');
	});

	it('renders an input element', () => {
		const { container } = render(KvVerificationCodeInput);

		const input = container.querySelector('input');
		expect(input).toBeTruthy();
		expect(input.type).toBe('text');
	});

	it('has default maxlength of 6', () => {
		const { container } = render(KvVerificationCodeInput);

		const input = container.querySelector('input');
		expect(input.maxLength).toBe(6);
	});

	it('accepts custom maxlength prop', () => {
		const { container } = render(KvVerificationCodeInput, {
			props: {
				maxlength: 4
			}
		});

		const input = container.querySelector('input');
		expect(input.maxLength).toBe(4);
	});

	it('has inputmode set to numeric', () => {
		const { container } = render(KvVerificationCodeInput);

		const input = container.querySelector('input');
		expect(input.getAttribute('inputmode')).toBe('numeric');
	});

	it('has pattern attribute for numbers only', () => {
		const { container } = render(KvVerificationCodeInput);

		const input = container.querySelector('input');
		expect(input.pattern).toBe('[0-9]*');
	});

	it('has autocomplete set to one-time-code', () => {
		const { container } = render(KvVerificationCodeInput);

		const input = container.querySelector('input');
		expect(input.autocomplete).toBe('one-time-code');
	});

	it('is not disabled by default', () => {
		const { container } = render(KvVerificationCodeInput);

		const input = container.querySelector('input');
		expect(input.disabled).toBe(false);
	});

	it('can be disabled via prop', () => {
		const { container } = render(KvVerificationCodeInput, {
			props: {
				disabled: true
			}
		});

		const input = container.querySelector('input');
		expect(input.disabled).toBe(true);
	});

	it('emits update event on input', async () => {
		const { container, emitted } = render(KvVerificationCodeInput);

		const input = container.querySelector('input');
		await fireEvent.input(input, { target: { value: '123456' } });

		expect(emitted().update).toBeTruthy();
		expect(emitted().update[0]).toEqual(['123456']);
	});

	it('applies correct CSS class to input', () => {
		const { container } = render(KvVerificationCodeInput);

		const input = container.querySelector('input');
		expect(input.classList.contains('kv-verification-code-input__input')).toBe(true);
	});

	it('applies border styling classes to wrapper', () => {
		const { container } = render(KvVerificationCodeInput);

		const wrapper = container.querySelector('.kv-verification-code-input');
		expect(wrapper.classList.contains('tw-border')).toBe(true);
		expect(wrapper.classList.contains('tw-border-tertiary')).toBe(true);
	});

	it('sets CSS custom property based on maxlength', () => {
		const { container } = render(KvVerificationCodeInput, {
			props: {
				maxlength: 8
			}
		});

		const wrapper = container.querySelector('.kv-verification-code-input');
		expect(wrapper.style.getPropertyValue('--kv-verification-code-input-maxlength')).toBe('8');
	});

	it('computes cssVars correctly', () => {
		const { container } = render(KvVerificationCodeInput, {
			props: {
				maxlength: 4
			}
		});

		const wrapper = container.querySelector('.kv-verification-code-input');
		expect(wrapper.style.getPropertyValue('--kv-verification-code-input-maxlength')).toBe('4');
	});
});

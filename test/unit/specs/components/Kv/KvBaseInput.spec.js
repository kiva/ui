import { render } from '@testing-library/vue';
import KvBaseInput from '#src/components/Kv/KvBaseInput';

describe('KvBaseInput.vue', () => {
	describe('text input type', () => {
		it('renders a text input by default', () => {
			const { container } = render(KvBaseInput, {
				props: {
					name: 'test-input',
					type: 'text',
					modelValue: '',
					validation: {}
				},
				slots: {
					default: 'Input Label'
				}
			});

			const label = container.querySelector('label');
			expect(label).toBeTruthy();
			expect(label.textContent).toBe('Input Label');
		});

		it('associates label with input via name prop', () => {
			const { container } = render(KvBaseInput, {
				props: {
					name: 'email-input',
					type: 'text',
					modelValue: '',
					validation: {}
				},
				slots: {
					default: 'Email'
				}
			});

			const label = container.querySelector('label');
			expect(label.getAttribute('for')).toBe('email-input');
		});

		it('does not show error list when validation has no errors', () => {
			const { container } = render(KvBaseInput, {
				props: {
					name: 'test-input',
					type: 'text',
					modelValue: '',
					validation: { $error: false }
				},
				slots: {
					default: 'Label'
				}
			});

			const errorList = container.querySelector('ul');
			expect(errorList).toBeTruthy();
			// Error list should be hidden
			const styles = window.getComputedStyle(errorList);
			expect(styles.display).toBe('none');
		});

		it('shows error list when validation has errors', () => {
			const { container } = render(KvBaseInput, {
				props: {
					name: 'test-input',
					type: 'text',
					modelValue: '',
					validation: {
						$error: true,
						$errors: [
							{ $params: { type: 'required' } }
						]
					}
				},
				slots: {
					default: 'Label',
					required: 'This field is required'
				}
			});

			const errorList = container.querySelector('ul');
			// Error list should be visible
			const styles = window.getComputedStyle(errorList);
			expect(styles.display).not.toBe('none');
		});
	});

	describe('checkbox input type', () => {
		it('renders a checkbox when type is checkbox', () => {
			const { container } = render(KvBaseInput, {
				props: {
					name: 'agree',
					type: 'checkbox',
					modelValue: false,
					validation: {}
				},
				slots: {
					default: 'I agree'
				}
			});

			const checkbox = container.querySelector('input[type="checkbox"]');
			expect(checkbox).toBeTruthy();
		});

		it('uses name prop as checkbox name attribute', () => {
			const { container } = render(KvBaseInput, {
				props: {
					name: 'terms-checkbox',
					type: 'checkbox',
					modelValue: false,
					validation: {}
				},
				slots: {
					default: 'Accept terms'
				}
			});

			const checkbox = container.querySelector('input[type="checkbox"]');
			// KvCheckbox may generate its own ID, but name attribute should match
			expect(checkbox.getAttribute('name')).toBe('terms-checkbox');
		});

		it('passes checkboxValue prop to KvCheckbox', () => {
			const { container } = render(KvBaseInput, {
				props: {
					name: 'custom-checkbox',
					type: 'checkbox',
					checkboxValue: 'yes',
					modelValue: false,
					validation: {}
				},
				slots: {
					default: 'Custom Value'
				}
			});

			const checkbox = container.querySelector('input[type="checkbox"]');
			expect(checkbox.value).toBe('yes');
		});
	});

	describe('validation errors', () => {
		it('renders error message in named slot', () => {
			const { getByText } = render(KvBaseInput, {
				props: {
					name: 'email',
					type: 'text',
					modelValue: '',
					validation: {
						$error: true,
						$errors: [
							{ $params: { type: 'required' } }
						]
					}
				},
				slots: {
					default: 'Email',
					required: 'Email is required'
				}
			});

			expect(getByText('Email is required')).toBeTruthy();
		});

		it('renders multiple error messages', () => {
			const { getByText } = render(KvBaseInput, {
				props: {
					name: 'password',
					type: 'text',
					modelValue: 'abc',
					validation: {
						$error: true,
						$errors: [
							{ $params: { type: 'required' } },
							{ $params: { type: 'minLength' } }
						]
					}
				},
				slots: {
					default: 'Password',
					required: 'Password is required',
					minLength: 'Password must be at least 8 characters'
				}
			});

			expect(getByText('Password is required')).toBeTruthy();
			expect(getByText('Password must be at least 8 characters')).toBeTruthy();
		});
	});

	describe('after slot', () => {
		it('renders after slot content', () => {
			const { getByText } = render(KvBaseInput, {
				props: {
					name: 'test',
					type: 'text',
					modelValue: '',
					validation: {}
				},
				slots: {
					default: 'Label',
					after: 'Additional info'
				}
			});

			expect(getByText('Additional info')).toBeTruthy();
		});
	});

	describe('errors computed property', () => {
		it('handles validation without $errors property', () => {
			const { container } = render(KvBaseInput, {
				props: {
					name: 'test',
					type: 'text',
					modelValue: '',
					validation: { $error: false }
				},
				slots: {
					default: 'Label'
				}
			});

			// Should not crash when $errors is undefined
			const errorList = container.querySelector('ul');
			expect(errorList).toBeTruthy();
		});

		it('handles empty validation object', () => {
			const { container } = render(KvBaseInput, {
				props: {
					name: 'test',
					type: 'text',
					modelValue: '',
					validation: {}
				},
				slots: {
					default: 'Label'
				}
			});

			// Should not crash with empty validation
			const errorList = container.querySelector('ul');
			expect(errorList).toBeTruthy();
		});
	});
});

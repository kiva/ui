import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvRadio from '../../../../../src/components/Kv/KvRadio';

describe('KvRadio.vue', () => {
	it('renders with required props', () => {
		const { container } = render(KvRadio, {
			props: {
				id: 'test-radio',
				radioValue: 'option1',
				modelValue: 'option1'
			},
			slots: {
				default: 'Radio label'
			}
		});

		const input = container.querySelector('input[type="radio"]');
		expect(input).toBeTruthy();
		expect(input.id).toBe('test-radio');
		expect(input.value).toBe('option1');
	});

	it('renders label text from slot', () => {
		const { getByText } = render(KvRadio, {
			props: {
				id: 'test-radio',
				radioValue: 'yes',
				modelValue: ''
			},
			slots: {
				default: 'Yes'
			}
		});

		expect(getByText('Yes')).toBeTruthy();
	});

	it('associates label with input via id', () => {
		const { container } = render(KvRadio, {
			props: {
				id: 'my-radio',
				radioValue: 'val',
				modelValue: ''
			},
			slots: {
				default: 'Radio'
			}
		});

		const input = container.querySelector('input');
		const label = container.querySelector('label');
		expect(input.id).toBe('my-radio');
		expect(label.getAttribute('for')).toBe('my-radio');
	});

	it('is checked when radioValue matches modelValue', () => {
		const { container } = render(KvRadio, {
			props: {
				id: 'test-radio',
				radioValue: 'option1',
				modelValue: 'option1'
			}
		});

		const input = container.querySelector('input');
		expect(input.checked).toBe(true);
	});

	it('is not checked when radioValue does not match modelValue', () => {
		const { container } = render(KvRadio, {
			props: {
				id: 'test-radio',
				radioValue: 'option1',
				modelValue: 'option2'
			}
		});

		const input = container.querySelector('input');
		expect(input.checked).toBe(false);
	});

	it('works in a radio button group', async () => {
		const user = userEvent.setup();
		const TestComponent = {
			template: `
				<div>
					<KvRadio
						id="radio1"
						radio-value="option1"
						v-model="selectedOption"
					>
						Option 1
					</KvRadio>
					<KvRadio
						id="radio2"
						radio-value="option2"
						v-model="selectedOption"
					>
						Option 2
					</KvRadio>
					<KvRadio
						id="radio3"
						radio-value="option3"
						v-model="selectedOption"
					>
						Option 3
					</KvRadio>
					<span>Selected: {{ selectedOption }}</span>
				</div>
			`,
			components: { KvRadio },
			data: () => ({ selectedOption: 'option1' }),
		};

		const { getByText, container } = render(TestComponent);

		// Initially option1 is selected
		expect(getByText('Selected: option1')).toBeTruthy();
		const radio1 = container.querySelector('#radio1');
		expect(radio1.checked).toBe(true);

		// Click option2
		const radio2 = container.querySelector('#radio2');
		await user.click(radio2);

		// Should be option2 now
		expect(getByText('Selected: option2')).toBeTruthy();
		expect(radio2.checked).toBe(true);
		expect(radio1.checked).toBe(false);

		// Click option3
		const radio3 = container.querySelector('#radio3');
		await user.click(radio3);

		// Should be option3 now
		expect(getByText('Selected: option3')).toBeTruthy();
		expect(radio3.checked).toBe(true);
		expect(radio2.checked).toBe(false);
	});

	it('renders disc element for styling', () => {
		const { container } = render(KvRadio, {
			props: {
				id: 'test-radio',
				radioValue: 'val',
				modelValue: ''
			}
		});

		const disc = container.querySelector('.disc');
		expect(disc).toBeTruthy();
	});
});

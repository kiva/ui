import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvCheckbox from '#src/components/Kv/KvCheckbox';

describe('KvCheckbox.vue', () => {
	it('renders with required id prop', () => {
		const { container } = render(KvCheckbox, {
			props: {
				id: 'test-checkbox'
			},
			slots: {
				default: 'Checkbox label'
			}
		});

		const input = container.querySelector('input[type="checkbox"]');
		expect(input).toBeTruthy();
		expect(input.id).toBe('test-checkbox');
	});

	it('renders label text from slot', () => {
		const { getByText } = render(KvCheckbox, {
			props: {
				id: 'test-checkbox'
			},
			slots: {
				default: 'Accept terms'
			}
		});

		expect(getByText('Accept terms')).toBeTruthy();
	});

	it('associates label with input via id', () => {
		const { container } = render(KvCheckbox, {
			props: {
				id: 'my-checkbox'
			},
			slots: {
				default: 'Checkbox'
			}
		});

		const input = container.querySelector('input');
		const label = container.querySelector('label');
		expect(input.id).toBe('my-checkbox');
		expect(label.getAttribute('for')).toBe('my-checkbox');
	});

	it('is unchecked by default', () => {
		const { container } = render(KvCheckbox, {
			props: {
				id: 'test-checkbox'
			}
		});

		const input = container.querySelector('input');
		expect(input.checked).toBe(false);
	});

	it('is checked when checked prop is true', () => {
		const { container } = render(KvCheckbox, {
			props: {
				id: 'test-checkbox',
				checked: true
			}
		});

		const input = container.querySelector('input');
		expect(input.checked).toBe(true);
	});

	it('is not disabled by default', () => {
		const { container } = render(KvCheckbox, {
			props: {
				id: 'test-checkbox'
			}
		});

		const input = container.querySelector('input');
		expect(input.disabled).toBe(false);
	});

	it('is disabled when disabled prop is true', () => {
		const { container } = render(KvCheckbox, {
			props: {
				id: 'test-checkbox',
				disabled: true
			}
		});

		const input = container.querySelector('input');
		expect(input.disabled).toBe(true);
	});

	it('emits update event when checked', async () => {
		const user = userEvent.setup();
		const { container, emitted } = render(KvCheckbox, {
			props: {
				id: 'test-checkbox'
			}
		});

		const input = container.querySelector('input');
		await user.click(input);

		expect(emitted().update).toBeTruthy();
		expect(emitted().update[0][0]).toBe(true);
	});

	it('emits update event with false when unchecked', async () => {
		const user = userEvent.setup();
		const { container, emitted } = render(KvCheckbox, {
			props: {
				id: 'test-checkbox',
				checked: true
			}
		});

		const input = container.querySelector('input');
		await user.click(input);

		expect(emitted().update).toBeTruthy();
		expect(emitted().update[0][0]).toBe(false);
	});

	it('positions checkbox on right when checkboxRight is true', () => {
		const { container } = render(KvCheckbox, {
			props: {
				id: 'test-checkbox',
				checkboxRight: true
			},
			slots: {
				default: 'Label'
			}
		});

		const wrapper = container.querySelector('.kv-checkbox');
		expect(wrapper.classList.contains('kv-checkbox--right')).toBe(true);
	});

	it('works with v-model pattern', async () => {
		const user = userEvent.setup();
		const TestComponent = {
			template: `
				<div>
					<KvCheckbox id="test-checkbox" v-model="isChecked">
						Check me
					</KvCheckbox>
					<span>Value: {{ isChecked }}</span>
				</div>
			`,
			components: { KvCheckbox },
			data: () => ({ isChecked: false }),
		};

		const { getByText, container } = render(TestComponent);

		// Initially false
		expect(getByText('Value: false')).toBeTruthy();

		// Check it
		const input = container.querySelector('input');
		await user.click(input);

		// Should be true now
		expect(getByText('Value: true')).toBeTruthy();
	});
});

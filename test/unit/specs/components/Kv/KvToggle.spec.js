import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvToggle from '../../../../../src/components/Kv/KvToggle';

describe('KvToggle.vue', () => {
	it('renders with required id prop', () => {
		const { container } = render(KvToggle, {
			props: {
				id: 'test-toggle'
			},
			slots: {
				default: 'Toggle label'
			}
		});

		const input = container.querySelector('input[type="checkbox"]');
		expect(input).toBeTruthy();
		expect(input.id).toBe('test-toggle');
	});

	it('renders label text from slot', () => {
		const { getByText } = render(KvToggle, {
			props: {
				id: 'test-toggle'
			},
			slots: {
				default: 'Enable notifications'
			}
		});

		expect(getByText('Enable notifications')).toBeTruthy();
	});

	it('associates label with input via id', () => {
		const { container } = render(KvToggle, {
			props: {
				id: 'my-toggle'
			},
			slots: {
				default: 'Toggle'
			}
		});

		const input = container.querySelector('input');
		const label = container.querySelector('label');
		expect(input.id).toBe('my-toggle');
		expect(label.getAttribute('for')).toBe('my-toggle');
	});

	it('is unchecked by default when checked prop is false', () => {
		const { container } = render(KvToggle, {
			props: {
				id: 'test-toggle',
				checked: false
			}
		});

		const input = container.querySelector('input');
		expect(input.checked).toBe(false);
	});

	it('is checked when checked prop is true', () => {
		const { container } = render(KvToggle, {
			props: {
				id: 'test-toggle',
				checked: true
			}
		});

		const input = container.querySelector('input');
		expect(input.checked).toBe(true);
	});

	it('is not disabled by default', () => {
		const { container } = render(KvToggle, {
			props: {
				id: 'test-toggle'
			}
		});

		const input = container.querySelector('input');
		expect(input.disabled).toBe(false);
	});

	it('is disabled when disabled prop is true', () => {
		const { container } = render(KvToggle, {
			props: {
				id: 'test-toggle',
				disabled: true
			}
		});

		const input = container.querySelector('input');
		expect(input.disabled).toBe(true);
	});

	it('emits change event when toggled', async () => {
		const user = userEvent.setup();
		const { container, emitted } = render(KvToggle, {
			props: {
				id: 'test-toggle',
				checked: false
			},
			slots: {
				default: 'Toggle'
			}
		});

		const input = container.querySelector('input');
		await user.click(input);

		expect(emitted().change).toBeTruthy();
		expect(emitted().change[0][0]).toBe(true);
	});

	it('emits false when toggled off', async () => {
		const user = userEvent.setup();
		const { container, emitted } = render(KvToggle, {
			props: {
				id: 'test-toggle',
				checked: true
			}
		});

		const input = container.querySelector('input');
		await user.click(input);

		expect(emitted().change).toBeTruthy();
		expect(emitted().change[0][0]).toBe(false);
	});

	it('works with v-model pattern', async () => {
		const user = userEvent.setup();
		const TestComponent = {
			template: `
				<div>
					<KvToggle id="test-toggle" :checked="isEnabled" @change="isEnabled = $event">
						Toggle me
					</KvToggle>
					<span>Value: {{ isEnabled }}</span>
				</div>
			`,
			components: { KvToggle },
			data: () => ({ isEnabled: false }),
		};

		const { getByText, container } = render(TestComponent);

		// Initially false
		expect(getByText('Value: false')).toBeTruthy();

		// Toggle on
		const input = container.querySelector('input');
		await user.click(input);

		// Should be true now
		expect(getByText('Value: true')).toBeTruthy();
	});
});

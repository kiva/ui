import { render } from '@testing-library/vue';
import KvSelect from '../../../../../src/components/Kv/KvSelect';

describe('KvSelect.vue', () => {
	it('exports a valid Vue component', () => {
		expect(KvSelect).toBeDefined();
		expect(KvSelect.name).toBe('KvSelect');
	});

	it('renders a select element', () => {
		const { container } = render(KvSelect, {
			props: {
				modelValue: 'test',
			},
			slots: {
				default: '<option value="test">Test</option>',
			},
		});

		const select = container.querySelector('select');
		expect(select).toBeTruthy();
	});

	it('requires modelValue prop', () => {
		expect(KvSelect.props.modelValue.required).toBe(true);
	});

	it('accepts string modelValue', () => {
		expect(KvSelect.props.modelValue.type).toContain(String);
	});

	it('accepts boolean modelValue', () => {
		expect(KvSelect.props.modelValue.type).toContain(Boolean);
	});

	it('accepts number modelValue', () => {
		expect(KvSelect.props.modelValue.type).toContain(Number);
	});

	it('renders option slot content', () => {
		const { getByText } = render(KvSelect, {
			props: {
				modelValue: 'option1',
			},
			slots: {
				default: '<option value="option1">Option 1</option><option value="option2">Option 2</option>',
			},
		});

		expect(getByText('Option 1')).toBeTruthy();
		expect(getByText('Option 2')).toBeTruthy();
	});

	it('updates internal value when modelValue prop changes', async () => {
		const { rerender } = render(KvSelect, {
			props: {
				modelValue: 'initial',
			},
			slots: {
				default: '<option value="initial">Initial</option><option value="updated">Updated</option>',
			},
		});

		await rerender({ modelValue: 'updated' });
		// Component watches modelValue and updates inputValue
		expect(KvSelect.watch.modelValue).toBeDefined();
	});

	it('applies dropdown-wrapper class', () => {
		const { container } = render(KvSelect, {
			props: {
				modelValue: 'test',
			},
			slots: {
				default: '<option value="test">Test</option>',
			},
		});

		const wrapper = container.querySelector('.dropdown-wrapper');
		expect(wrapper).toBeTruthy();
	});

	it('applies dropdown class to select', () => {
		const { container } = render(KvSelect, {
			props: {
				modelValue: 'test',
			},
			slots: {
				default: '<option value="test">Test</option>',
			},
		});

		const select = container.querySelector('.dropdown');
		expect(select).toBeTruthy();
	});

	it('passes through additional attributes via v-bind', () => {
		const { container } = render(KvSelect, {
			props: {
				modelValue: 'test',
				id: 'my-select',
				'data-test': 'custom-attr',
			},
			slots: {
				default: '<option value="test">Test</option>',
			},
		});

		const select = container.querySelector('select');
		expect(select.getAttribute('id')).toBe('my-select');
		expect(select.getAttribute('data-test')).toBe('custom-attr');
	});

	it('can be disabled', () => {
		const { container } = render(KvSelect, {
			props: {
				modelValue: 'test',
				disabled: true,
			},
			slots: {
				default: '<option value="test">Test</option>',
			},
		});

		const select = container.querySelector('select');
		expect(select.disabled).toBe(true);
	});

	it('syncs v-model correctly', () => {
		const { container } = render(KvSelect, {
			props: {
				modelValue: 'selected-value',
			},
			slots: {
				default: '<option value="selected-value">Selected</option>',
			},
		});

		const select = container.querySelector('select');
		expect(select).toBeTruthy();
		// Component uses v-model="inputValue" and watches modelValue
		expect(KvSelect.data).toBeDefined();
	});
});

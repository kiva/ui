import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvPillToggle from '#src/components/Kv/KvPillToggle';

describe('KvPillToggle.vue', () => {
	const defaultOptions = [
		{ title: 'Option 1', key: 'option1', disabled: false },
		{ title: 'Option 2', key: 'option2', disabled: false },
		{ title: 'Option 3', key: 'option3', disabled: false }
	];

	it('renders with required props', () => {
		const { container } = render(KvPillToggle, {
			props: {
				id: 'test-toggle',
				options: defaultOptions
			}
		});

		const toggle = container.querySelector('.kv-pill-toggle');
		expect(toggle).toBeTruthy();
	});

	it('renders all options', () => {
		const { getByText } = render(KvPillToggle, {
			props: {
				id: 'test-toggle',
				options: defaultOptions
			}
		});

		expect(getByText('Option 1')).toBeTruthy();
		expect(getByText('Option 2')).toBeTruthy();
		expect(getByText('Option 3')).toBeTruthy();
	});

	it('renders radio inputs for each option', () => {
		const { container } = render(KvPillToggle, {
			props: {
				id: 'test-toggle',
				options: defaultOptions
			}
		});

		const radios = container.querySelectorAll('input[type="radio"]');
		expect(radios.length).toBe(3);
	});

	it('uses id prop to generate unique input ids', () => {
		const { container } = render(KvPillToggle, {
			props: {
				id: 'my-toggle',
				options: defaultOptions
			}
		});

		const radio1 = container.querySelector('#my-toggle-option1');
		const radio2 = container.querySelector('#my-toggle-option2');
		const radio3 = container.querySelector('#my-toggle-option3');

		expect(radio1).toBeTruthy();
		expect(radio2).toBeTruthy();
		expect(radio3).toBeTruthy();
	});

	it('selects option based on selected prop', () => {
		const { container } = render(KvPillToggle, {
			props: {
				id: 'test-toggle',
				options: defaultOptions,
				selected: 'option2'
			}
		});

		const radio2 = container.querySelector('#test-toggle-option2');
		expect(radio2.checked).toBe(true);
	});

	it('emits pill-toggled event when option is clicked', async () => {
		const user = userEvent.setup();
		const { container, emitted } = render(KvPillToggle, {
			props: {
				id: 'test-toggle',
				options: defaultOptions
			}
		});

		const radio1 = container.querySelector('#test-toggle-option1');
		await user.click(radio1);

		expect(emitted()['pill-toggled']).toBeTruthy();
		expect(emitted()['pill-toggled'][0][0]).toBe('option1');
	});

	it('disables options when disabled property is true', () => {
		const optionsWithDisabled = [
			{ title: 'Option 1', key: 'option1', disabled: false },
			{ title: 'Option 2', key: 'option2', disabled: true },
			{ title: 'Option 3', key: 'option3', disabled: false }
		];

		const { container } = render(KvPillToggle, {
			props: {
				id: 'test-toggle',
				options: optionsWithDisabled
			}
		});

		const radio2 = container.querySelector('#test-toggle-option2');
		expect(radio2.disabled).toBe(true);
	});

	it('applies split-pills class when splitPills prop is true', () => {
		const { container } = render(KvPillToggle, {
			props: {
				id: 'test-toggle',
				options: defaultOptions,
				splitPills: true
			}
		});

		const toggle = container.querySelector('.split-pills');
		expect(toggle).toBeTruthy();
	});

	it('applies split-pill class to pills when splitPills is true', () => {
		const { container } = render(KvPillToggle, {
			props: {
				id: 'test-toggle',
				options: defaultOptions,
				splitPills: true
			}
		});

		const pills = container.querySelectorAll('.split-pill');
		expect(pills.length).toBe(3);
	});

	it('changes selection when different option is clicked', async () => {
		const user = userEvent.setup();
		const { container } = render(KvPillToggle, {
			props: {
				id: 'test-toggle',
				options: defaultOptions,
				selected: 'option1'
			}
		});

		const radio2 = container.querySelector('#test-toggle-option2');
		await user.click(radio2);

		expect(radio2.checked).toBe(true);
	});
});

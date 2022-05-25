import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvCheckboxList from '@/components/Kv/KvCheckboxList';

const items = [...Array(4)].map((_, i) => ({ value: `${i}`, title: `Option ${i}` }));

describe('KvCheckboxList', () => {
	it('should render all items', () => {
		const { getByLabelText } = render(KvCheckboxList, { props: { items } });
		items.forEach(item => {
			getByLabelText(item.title);
		});
	});

	it('should check on click', () => {
		const user = userEvent.setup();
		const { getByLabelText } = render(KvCheckboxList, { props: { items } });
		items.forEach(async item => {
			const checkbox = getByLabelText(item.title);
			await user.click(checkbox);
			expect(checkbox.checked).toBeTruthy();
		});
	});

	it('should not have select all', () => {
		const { queryByText } = render(KvCheckboxList, { props: { items } });
		expect(queryByText('Select all')).toBeNull();
	});

	it('should have select all', () => {
		const { getByText } = render(KvCheckboxList, { props: { showSelectAll: true, items } });
		getByText('Select all');
	});

	it('should have deselect all', async () => {
		const user = userEvent.setup();
		const { getByLabelText, getByText } = render(KvCheckboxList, { props: { showSelectAll: true, items } });
		getByText('Select all');
		await Promise.all(items.map(async item => {
			const checkbox = getByLabelText(item.title);
			return user.click(checkbox);
		}));
		getByText('Deselect all');
	});

	it('should toggle select and deselect all', async () => {
		const user = userEvent.setup();
		const { getByText, getByLabelText } = render(KvCheckboxList, { props: { showSelectAll: true, items } });

		let toggle = getByText('Select all');
		await user.click(toggle);
		items.forEach(item => {
			const checkbox = getByLabelText(item.title);
			expect(checkbox.checked).toBeTruthy();
		});

		toggle = getByText('Deselect all');
		await user.click(toggle);
		items.forEach(item => {
			const checkbox = getByLabelText(item.title);
			expect(checkbox.checked).toBeFalsy();
		});
	});

	it('should be pre-selected', () => {
		const { getByText, getByLabelText } = render(KvCheckboxList, {
			props: {
				showSelectAll: true,
				items,
				initialSelected: items.map(i => i.value)
			}
		});

		getByText('Deselect all');

		items.forEach(item => {
			const checkbox = getByLabelText(item.title);
			expect(checkbox.checked).toBeTruthy();
		});
	});

	it('should emit updated', async () => {
		const user = userEvent.setup();
		const { getByLabelText, emitted } = render(KvCheckboxList, { props: { items } });

		await user.click(getByLabelText(items[0].title));

		expect(emitted().updated[0]).toEqual([[items[0].value]]);
	});

	it('should disable checkboxes', () => {
		const { getByLabelText } = render(KvCheckboxList, {
			props: { items: items.map(i => ({ ...i, disabled: true })) }
		});

		items.forEach(item => {
			const checkbox = getByLabelText(item.title);
			expect(checkbox.disabled).toBeTruthy();
		});
	});
});

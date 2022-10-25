import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvSelectBox, { NO_RESULTS } from '@/components/Kv/KvSelectBox';

const items = [...Array(20)].map((_, i) => ({ id: i, name: `Item ${20 - i + 1}`, header: `Header ${i % 5}` }));

describe('KvSelectBox', () => {
	it('should render no results found', () => {
		const { getByText } = render(KvSelectBox, { props: { id: 'id' } });

		getByText(NO_RESULTS);
	});

	it('should render with placeholder', () => {
		const { getByPlaceholderText } = render(KvSelectBox, { props: { id: 'id', placeholder: 'test' } });

		getByPlaceholderText('test');
	});

	it('should render with full width', async () => {
		const { getByText, getByRole, updateProps } = render(KvSelectBox, { props: { id: 'id', placeholder: 'test' } });

		expect(getByRole('textbox').parentNode.parentNode.classList.contains('tw-w-full')).toBe(false);
		expect(getByText(NO_RESULTS).parentNode.parentNode.parentNode.classList.contains('tw-w-full')).toBe(false);

		await updateProps({ isFullWidth: true });

		expect(getByRole('textbox').parentNode.parentNode.classList.contains('tw-w-full')).toBe(true);
		expect(getByText(NO_RESULTS).parentNode.parentNode.parentNode.classList.contains('tw-w-full')).toBe(true);
	});

	it('should render all headers and items', () => {
		const { getByText } = render(KvSelectBox, { props: { id: 'id', items, headerKey: 'header' } });

		[...Array(5)].forEach((_, i) => getByText(`Header ${i}`));

		items.forEach(item => getByText(item.name));
	});

	it('should render hidden', () => {
		const { getByText } = render(KvSelectBox, { props: { id: 'id' } });

		expect(getByText(NO_RESULTS).parentNode.parentNode.classList.contains('tw-hidden')).toBe(true);
	});

	it('should display when clicked', async () => {
		const user = userEvent.setup();

		const { getByRole, getByText } = render(KvSelectBox, { props: { id: 'id' } });

		await user.click(getByRole('textbox'));

		expect(getByText(NO_RESULTS).parentNode.parentNode.classList.contains('tw-hidden')).toBe(false);
	});

	it('should hide when document clicked', async () => {
		const user = userEvent.setup();

		const { getByRole, getByText } = render(KvSelectBox, { props: { id: 'id' } });

		await user.click(getByRole('textbox'));

		const popper = getByText(NO_RESULTS).parentNode.parentNode;

		expect(popper.classList.contains('tw-hidden')).toBe(false);

		await user.click(popper.parentNode);

		expect(popper.classList.contains('tw-hidden')).toBe(true);
	});

	it('should sort', async () => {
		const { getAllByRole, updateProps } = render(KvSelectBox, { props: { id: 'id', items, headerKey: 'header' } });

		expect(getAllByRole('listitem')[1].textContent.trim()).toBe('Item 11');

		await updateProps({ shouldSort: false });

		expect(getAllByRole('listitem')[1].textContent.trim()).toBe('Item 21');
	});

	it('should emit selected', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(KvSelectBox, { props: { id: 'id', items } });

		await user.click(getByText(items[0].name).parentNode);

		const payload = emitted().selected[0][0];

		expect(payload).toEqual({ id: 0 });
	});

	it('should disable selected items', async () => {
		const { getByText, updateProps } = render(KvSelectBox, { props: { id: 'id', items, selectedIds: [1] } });

		const item0 = getByText(items[0].name).parentNode;
		const item1 = getByText(items[1].name).parentNode;
		const item2 = getByText(items[2].name).parentNode;

		expect(item0.classList.contains('tw-bg-tertiary')).toBe(false);
		expect(item0.classList.contains('tw-pointer-events-none')).toBe(false);
		expect(item1.classList.contains('tw-bg-tertiary')).toBe(true);
		expect(item1.classList.contains('tw-pointer-events-none')).toBe(true);
		expect(item2.classList.contains('tw-bg-tertiary')).toBe(false);
		expect(item2.classList.contains('tw-pointer-events-none')).toBe(false);

		await updateProps({ selectedIds: [0, 2] });

		expect(item0.classList.contains('tw-bg-tertiary')).toBe(true);
		expect(item0.classList.contains('tw-pointer-events-none')).toBe(true);
		expect(item1.classList.contains('tw-bg-tertiary')).toBe(false);
		expect(item1.classList.contains('tw-pointer-events-none')).toBe(false);
		expect(item2.classList.contains('tw-bg-tertiary')).toBe(true);
		expect(item2.classList.contains('tw-pointer-events-none')).toBe(true);
	});

	it('should prevent clicking selected items', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(KvSelectBox, {
			props: {
				id: 'id',
				items,
				selectedIds: [0, 2]
			}
		});

		const item0 = getByText(items[0].name).parentNode;
		const item2 = getByText(items[0].name).parentNode;

		await user.click(item0);
		await user.click(item2);

		expect(emitted().selected).toBe(undefined);
	});

	it('should prevent clicking headers', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(KvSelectBox, {
			props: {
				id: 'id',
				items,
				headerKey: 'header',
				selectedIds: [0, 2]
			}
		});

		const header = getByText('Header 1').parentNode;

		await user.click(header);

		expect(emitted().selected).toBe(undefined);
	});
});

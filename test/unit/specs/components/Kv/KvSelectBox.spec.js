import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvSelectBox, { NO_RESULTS } from '@/components/Kv/KvSelectBox';

const items = [...Array(20)].map((_, i) => ({ id: i, name: `Item ${i + 1}` }));
[...Array(5)].forEach((_, i) => items.splice([i * 5], 0, { isHeader: true, name: `Header ${i + 1}` }));

describe('KvSelectBox', () => {
	it('should render no results found', () => {
		const { getByText } = render(KvSelectBox, { props: { id: 'id' } });

		getByText(NO_RESULTS);
	});

	it('should render all headers and items', () => {
		const { getByText } = render(KvSelectBox, { props: { id: 'id', items } });

		items.forEach(item => {
			getByText(item.name);
		});
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

	it('should emit selected', async () => {
		const user = userEvent.setup();

		const { getByText, emitted } = render(KvSelectBox, { props: { id: 'id', items } });

		await user.click(getByText(items[1].name).parentNode);

		const payload = emitted().selected[0][0];

		expect(payload).toEqual({ id: 0 });
	});
});

import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvPagination from '@/components/Kv/KvPagination';

global.scrollTo = jest.fn();

describe('KvPagination', () => {
	afterEach(jest.clearAllMocks);

	it('should render arrows disabled by default', async () => {
		const user = userEvent.setup();

		const { getByLabelText, emitted } = render(KvPagination, { props: { limit: 10, total: 0 } });

		await user.click(getByLabelText('Previous page'));
		await user.click(getByLabelText('Next page'));

		expect(emitted()['page-changed']).toBe(undefined);
	});

	it('should render aria current page label', () => {
		const { getByText } = render(KvPagination, { props: { limit: 10, total: 30 } });

		getByText("You're on page");
	});

	it('should render fewer pages', () => {
		const { getByLabelText } = render(KvPagination, { props: { limit: 10, total: 30 } });

		getByLabelText('Page 1');
		getByLabelText('Page 2');
		getByLabelText('Page 3');
	});

	it('should render more pages', () => {
		const { getByLabelText } = render(KvPagination, { props: { limit: 10, total: 1000 } });

		getByLabelText('Page 1');
		getByLabelText('Page 2');
		getByLabelText('Page 3');
		getByLabelText('Page 4');
		getByLabelText('Page 100');
	});

	it('should render fourth selected', () => {
		const { getByLabelText } = render(KvPagination, { props: { limit: 10, total: 1000, offset: 30 } });

		getByLabelText('Page 1');
		getByLabelText('Page 3');
		getByLabelText('Page 4');
		getByLabelText('Page 5');
		getByLabelText('Page 100');
	});

	it('should render last selected', () => {
		const { getByLabelText } = render(KvPagination, { props: { limit: 10, total: 1000, offset: 990 } });

		getByLabelText('Page 1');
		getByLabelText('Page 97');
		getByLabelText('Page 98');
		getByLabelText('Page 99');
		getByLabelText('Page 100');
	});

	it('should render fourth to last last selected', () => {
		const { getByLabelText } = render(KvPagination, { props: { limit: 10, total: 1000, offset: 960 } });

		getByLabelText('Page 1');
		getByLabelText('Page 96');
		getByLabelText('Page 97');
		getByLabelText('Page 98');
		getByLabelText('Page 100');
	});

	it('should render more extra pages', () => {
		const { getByLabelText } = render(KvPagination, { props: { limit: 10, total: 1000, extraPages: 6 } });

		getByLabelText('Page 1');
		getByLabelText('Page 2');
		getByLabelText('Page 3');
		getByLabelText('Page 4');
		getByLabelText('Page 5');
		getByLabelText('Page 6');
		getByLabelText('Page 7');
		getByLabelText('Page 100');
	});

	it('should emit page click', async () => {
		const user = userEvent.setup();

		const { getByLabelText, emitted } = render(KvPagination, { props: { limit: 10, total: 1000 } });

		await user.click(getByLabelText('Page 2'));

		expect(global.scrollTo).toHaveBeenCalledTimes(1);
		expect(emitted()['page-changed']).toEqual([[{ pageOffset: 10 }]]);
	});

	it('should not emit current page click', async () => {
		const user = userEvent.setup();

		const { getByLabelText, emitted } = render(KvPagination, { props: { limit: 10, total: 1000 } });

		await user.click(getByLabelText('Page 1'));

		expect(emitted()['page-changed']).toBe(undefined);
	});

	it('should emit previous click', async () => {
		const user = userEvent.setup();

		const { getByLabelText, emitted } = render(KvPagination, { props: { limit: 10, total: 1000, offset: 10 } });

		await user.click(getByLabelText('Previous page'));

		expect(global.scrollTo).toHaveBeenCalledTimes(1);
		expect(emitted()['page-changed']).toEqual([[{ pageOffset: 0 }]]);
	});

	it('should emit next click', async () => {
		const user = userEvent.setup();

		const { getByLabelText, emitted } = render(KvPagination, { props: { limit: 10, total: 1000 } });

		await user.click(getByLabelText('Next page'));

		expect(global.scrollTo).toHaveBeenCalledTimes(1);
		expect(emitted()['page-changed']).toEqual([[{ pageOffset: 10 }]]);
	});
});

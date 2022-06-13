import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvPager from '@/components/Kv/KvPager';

global.scrollTo = jest.fn();

describe('KvPager', () => {
	afterEach(jest.clearAllMocks);

	it('should render arrows disabled by default', async () => {
		const user = userEvent.setup();

		const { getByLabelText, emitted } = render(KvPager, { props: { pageSize: 10, total: 0 } });

		await user.click(getByLabelText('Previous page'));
		await user.click(getByLabelText('Next page'));

		expect(emitted()['page-changed']).toBe(undefined);
	});

	it('should render aria current page label', () => {
		const { getByText } = render(KvPager, { props: { pageSize: 10, total: 30 } });

		getByText("You're on page");
	});

	it('should render fewer pages', () => {
		const { getByLabelText } = render(KvPager, { props: { pageSize: 10, total: 30 } });

		getByLabelText('Page 1');
		getByLabelText('Page 2');
		getByLabelText('Page 3');
	});

	it('should render more pages', () => {
		const { getByLabelText } = render(KvPager, { props: { pageSize: 10, total: 1000 } });

		getByLabelText('Page 1');
		getByLabelText('Page 2');
		getByLabelText('Page 3');
		getByLabelText('Page 4');
		getByLabelText('Page 100');
	});

	it('should render fourth selected', () => {
		const { getByLabelText } = render(KvPager, { props: { pageSize: 10, total: 1000, current: 3 } });

		getByLabelText('Page 1');
		getByLabelText('Page 3');
		getByLabelText('Page 4');
		getByLabelText('Page 5');
		getByLabelText('Page 100');
	});

	it('should render last selected', () => {
		const { getByLabelText } = render(KvPager, { props: { pageSize: 10, total: 1000, current: 99 } });

		getByLabelText('Page 1');
		getByLabelText('Page 97');
		getByLabelText('Page 98');
		getByLabelText('Page 99');
		getByLabelText('Page 100');
	});

	it('should render fourth to last last selected', () => {
		const { getByLabelText } = render(KvPager, { props: { pageSize: 10, total: 1000, current: 96 } });

		getByLabelText('Page 1');
		getByLabelText('Page 96');
		getByLabelText('Page 97');
		getByLabelText('Page 98');
		getByLabelText('Page 100');
	});

	it('should render more extra pages', () => {
		const { getByLabelText } = render(KvPager, { props: { pageSize: 10, total: 1000, extraPages: 6 } });

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

		const { getByLabelText, emitted } = render(KvPager, { props: { pageSize: 10, total: 1000 } });

		await user.click(getByLabelText('Page 2'));

		expect(global.scrollTo).toHaveBeenCalledTimes(1);
		expect(emitted()['page-changed']).toEqual([[{ pageNumber: 1 }]]);
	});

	it('should not emit current page click', async () => {
		const user = userEvent.setup();

		const { getByLabelText, emitted } = render(KvPager, { props: { pageSize: 10, total: 1000 } });

		await user.click(getByLabelText('Page 1'));

		expect(emitted()['page-changed']).toBe(undefined);
	});

	it('should emit previous click', async () => {
		const user = userEvent.setup();

		const { getByLabelText, emitted } = render(KvPager, { props: { pageSize: 10, total: 1000, current: 1 } });

		await user.click(getByLabelText('Previous page'));

		expect(global.scrollTo).toHaveBeenCalledTimes(1);
		expect(emitted()['page-changed']).toEqual([[{ pageNumber: 0 }]]);
	});

	it('should emit next click', async () => {
		const user = userEvent.setup();

		const { getByLabelText, emitted } = render(KvPager, { props: { pageSize: 10, total: 1000, current: 0 } });

		await user.click(getByLabelText('Next page'));

		expect(global.scrollTo).toHaveBeenCalledTimes(1);
		expect(emitted()['page-changed']).toEqual([[{ pageNumber: 1 }]]);
	});
});

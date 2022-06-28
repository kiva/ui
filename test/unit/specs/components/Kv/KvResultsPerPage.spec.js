import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import KvResultsPerPage, { defaultOptions } from '@/components/Kv/KvResultsPerPage';

global.scrollTo = jest.fn();

describe('KvResultsPerPage', () => {
	afterEach(jest.clearAllMocks);

	it('should render default options', () => {
		const { getByLabelText } = render(KvResultsPerPage);

		defaultOptions.forEach(option => {
			getByLabelText(`${option} per page`);
		});
	});

	it('should render all options', () => {
		const options = [1, 2, 3];

		const { getByLabelText } = render(KvResultsPerPage, { props: { options } });

		options.forEach(option => {
			getByLabelText(`${option} per page`);
		});
	});

	it('should select prop by default', () => {
		const options = [1, 2, 3];

		const { getByRole } = render(KvResultsPerPage, { props: { options, selected: 2 } });

		expect(getByRole('combobox').value).toBe('2');
	});

	it('should emit updated', async () => {
		const user = userEvent.setup();

		const options = [1, 2, 3];

		const { getByRole, emitted } = render(KvResultsPerPage, { props: { options } });

		await user.selectOptions(getByRole('combobox'), '1');

		expect(global.scrollTo).toHaveBeenCalledTimes(1);
		expect(emitted().updated).toEqual([[{ pageLimit: 1 }]]);
	});

	it('should not emit updated with prop change', async () => {
		const options = [1, 2, 3];

		const { updateProps, getByRole, emitted } = render(KvResultsPerPage, { props: { options } });

		await updateProps({ selected: 2 });

		expect(getByRole('combobox').value).toBe('2');
		expect(emitted().updated).toBe(undefined);
	});

	it('should not set invalid option', async () => {
		const options = [1, 2, 3];

		const { updateProps, getByRole } = render(KvResultsPerPage, { props: { options, selected: 2 } });

		expect(getByRole('combobox').value).toBe('2');

		await updateProps({ selected: 4 });

		expect(getByRole('combobox').value).toBe('1');
	});
});

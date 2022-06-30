import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchCheckboxListFilter from '@/components/Lend/LoanSearch/LoanSearchCheckboxListFilter';
import { getCheckboxLabel } from '@/util/loanSearchUtils';

const getOptions = disabled => [...Array(4)].map((_c, i) => ({
	id: i,
	name: `Option ${i}`,
	numLoansFundraising: disabled ? 0 : 5,
}));

describe('LoanSearchCheckboxListFilter', () => {
	it('should display items', () => {
		const options = getOptions();

		const { getByText } = render(LoanSearchCheckboxListFilter, { props: { options } });

		options.forEach(item => getByText(getCheckboxLabel(item)));
	});

	it('should pre-select', () => {
		const options = getOptions();

		const { getByLabelText } = render(LoanSearchCheckboxListFilter, { props: { options, ids: [0] } });

		expect(getByLabelText(getCheckboxLabel(options[0])).checked).toBeTruthy();
	});

	it('should select based on prop', async () => {
		const options = getOptions();

		const { getByLabelText, updateProps } = render(LoanSearchCheckboxListFilter, { props: { options } });

		await updateProps({ ids: [0] });
		expect(getByLabelText(getCheckboxLabel(options[0])).checked).toBeTruthy();

		await updateProps({ ids: [0, 1] });
		expect(getByLabelText(getCheckboxLabel(options[0])).checked).toBeTruthy();
		expect(getByLabelText(getCheckboxLabel(options[1])).checked).toBeTruthy();

		await updateProps({ ids: [] });
		options.forEach(item => expect(getByLabelText(getCheckboxLabel(item)).checked).toBeFalsy());
	});

	it('should emit updated', async () => {
		const options = getOptions();

		const user = userEvent.setup();
		const { getByText, emitted } = render(LoanSearchCheckboxListFilter, {
			props: { options, filterKey: 'sectorId' }
		});

		const option = getByText(getCheckboxLabel(options[0]));
		await user.click(option);

		expect(emitted().updated[0]).toEqual([{ sectorId: [options[0].id] }]);
	});

	it('should disable checkboxes when no fundraising loans', async () => {
		const initialOptions = getOptions();

		const { getByLabelText, updateProps } = render(
			LoanSearchCheckboxListFilter,
			{ props: { options: initialOptions } }
		);

		initialOptions.forEach(s => expect(getByLabelText(getCheckboxLabel(s)).disabled).toBeFalsy());

		const options = getOptions(true);
		await updateProps({ options });

		options.forEach(s => expect(getByLabelText(getCheckboxLabel(s)).disabled).toBeTruthy());
	});
});

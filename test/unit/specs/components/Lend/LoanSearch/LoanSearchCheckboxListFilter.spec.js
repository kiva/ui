import Vue from 'vue';
import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchCheckboxListFilter from '@/components/Lend/LoanSearch/LoanSearchCheckboxListFilter';
import { filterOptionUtils } from '@kiva/kv-loan-filters';

const getOptions = disabled => [...Array(4)].map((_c, i) => ({
	id: i,
	name: `Option ${i}`,
	numLoansFundraising: disabled ? 0 : 5,
}));

describe('LoanSearchCheckboxListFilter', () => {
	let spyTrackEvent;

	beforeEach(() => {
		spyTrackEvent = jest.spyOn(Vue.prototype, '$kvTrackEvent');
	});

	afterEach(jest.restoreAllMocks);

	it('should display items', () => {
		const options = getOptions();

		const { getByText } = render(LoanSearchCheckboxListFilter, {
			props: { options, filterKey: 'key', eventAction: 'action' }
		});

		options.forEach(item => getByText(filterOptionUtils.getCheckboxLabel(item)));
	});

	it('should pre-select', () => {
		const options = getOptions();

		const { getByLabelText } = render(LoanSearchCheckboxListFilter, {
			props: {
				options, ids: [0], filterKey: 'key', eventAction: 'action'
			}
		});

		expect(getByLabelText(filterOptionUtils.getCheckboxLabel(options[0])).checked).toBeTruthy();
	});

	it('should select based on prop', async () => {
		const options = getOptions();

		const { getByLabelText, updateProps } = render(LoanSearchCheckboxListFilter, {
			props: { options, filterKey: 'key', eventAction: 'action' }
		});

		await updateProps({ ids: [0] });
		expect(getByLabelText(filterOptionUtils.getCheckboxLabel(options[0])).checked).toBeTruthy();

		await updateProps({ ids: [0, 1] });
		expect(getByLabelText(filterOptionUtils.getCheckboxLabel(options[0])).checked).toBeTruthy();
		expect(getByLabelText(filterOptionUtils.getCheckboxLabel(options[1])).checked).toBeTruthy();

		await updateProps({ ids: [] });
		options.forEach(item => expect(getByLabelText(filterOptionUtils.getCheckboxLabel(item)).checked).toBeFalsy());
	});

	it('should emit updated', async () => {
		const options = getOptions();

		const user = userEvent.setup();
		const { getByText, emitted } = render(LoanSearchCheckboxListFilter, {
			props: { options, filterKey: 'key', eventAction: 'action' }
		});

		const option = getByText(filterOptionUtils.getCheckboxLabel(options[0]));
		await user.click(option);

		expect(emitted().updated[0]).toEqual([{ key: [options[0].id] }]);
	});

	it('should disable checkboxes when no fundraising loans', async () => {
		const initialOptions = getOptions();

		const { getByLabelText, updateProps } = render(
			LoanSearchCheckboxListFilter,
			{ props: { options: initialOptions, filterKey: 'key', eventAction: 'action' } }
		);

		initialOptions.forEach(s => expect(getByLabelText(filterOptionUtils.getCheckboxLabel(s)).disabled).toBeFalsy());

		const options = getOptions(true);
		await updateProps({ options });

		options.forEach(s => expect(getByLabelText(filterOptionUtils.getCheckboxLabel(s)).disabled).toBeTruthy());
	});

	it('should track event', async () => {
		const options = getOptions();

		const user = userEvent.setup();
		const { getByText } = render(LoanSearchCheckboxListFilter, {
			props: { options, filterKey: 'key', eventAction: 'action' }
		});

		let option = getByText(filterOptionUtils.getCheckboxLabel(options[0]));
		await user.click(option);

		option = getByText(filterOptionUtils.getCheckboxLabel(options[0]));
		await user.click(option);

		expect(spyTrackEvent).toHaveBeenCalledTimes(2);
		expect(spyTrackEvent).toHaveBeenCalledWith('Lending', 'action', 'Option 0', 'selected');
		expect(spyTrackEvent).toHaveBeenCalledWith('Lending', 'action', 'Option 0', 'deselected');
	});
});

import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchRadioGroupFilter, { ALL_LOANS_TITLE } from '@/components/Lend/LoanSearch/LoanSearchRadioGroupFilter';

const getOptions = () => [...Array(4)].map((_c, i) => ({ title: `Option ${i}`, name: i.toString() }));

describe('LoanSearchRadioGroupFilter', () => {
	it('should default to all', () => {
		const { getByLabelText } = render(LoanSearchRadioGroupFilter, {
			props: { options: getOptions(), filterKey: 'option', eventAction: 'action' }
		});
		const radio = getByLabelText(ALL_LOANS_TITLE);
		expect(radio.checked).toBeTruthy();
	});

	it('should select based on prop', async () => {
		const options = getOptions();

		const { getByLabelText, updateProps } = render(LoanSearchRadioGroupFilter, {
			props: { options, filterKey: 'option', eventAction: 'action' }
		});

		let radio = getByLabelText(ALL_LOANS_TITLE);
		expect(radio.checked).toBeTruthy();

		await updateProps({ selected: options[0].name });
		radio = getByLabelText('Option 0');
		expect(radio.checked).toBeTruthy();

		await updateProps({ selected: '' });
		radio = getByLabelText(ALL_LOANS_TITLE);
		expect(radio.checked).toBeTruthy();

		await updateProps({ selected: 'asd' });
		radio = getByLabelText(ALL_LOANS_TITLE);
		expect(radio.checked).toBeTruthy();

		await updateProps({ selected: null });
		radio = getByLabelText(ALL_LOANS_TITLE);
		expect(radio.checked).toBeTruthy();
	});

	it('should select based on click', async () => {
		const options = getOptions();

		const user = userEvent.setup();

		const { getByLabelText } = render(LoanSearchRadioGroupFilter, {
			props: { options, filterKey: 'option', eventAction: 'action' }
		});

		let radio = getByLabelText(ALL_LOANS_TITLE);
		expect(radio.checked).toBeTruthy();

		radio = getByLabelText('Option 1');
		expect(radio.checked).toBeFalsy();
		await user.click(radio);
		expect(radio.checked).toBeTruthy();

		radio = getByLabelText('Option 2');
		expect(radio.checked).toBeFalsy();
		await user.click(radio);
		expect(radio.checked).toBeTruthy();
	});

	it('should set all option title', () => {
		const options = getOptions();

		const allOptionTitle = 'All stuff';

		const { getByLabelText } = render(LoanSearchRadioGroupFilter, {
			props: {
				options, filterKey: 'option', eventAction: 'action', allOptionTitle
			}
		});

		const radio = getByLabelText(allOptionTitle);
		expect(radio.checked).toBeTruthy();
	});
});

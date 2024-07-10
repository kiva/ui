import Vue from 'vue';
import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchRadioGroupFilter, { ALL_LOANS_TITLE } from '@/components/Lend/LoanSearch/LoanSearchRadioGroupFilter';

const getOptions = (isObject = false, isBoolean = false) => [...Array(4)].map((_c, i) => ({
	title: `Option ${i}`,
	name: i.toString(),
	// eslint-disable-next-line no-nested-ternary
	value: isObject ? { asd: `${i + 1}` } : (isBoolean ? false : `${i + 1}`),
}));

// eslint-disable-next-line no-param-reassign
const getValueMap = options => options.reduce((map, option) => { map[option.name] = option.value; return map; }, {});

describe('LoanSearchRadioGroupFilter', () => {
	const mockTrackEvent = jest.fn();

	beforeEach(() => {
		Vue.prototype.$kvTrackEvent = mockTrackEvent;
		jest.resetAllMocks();
	});

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

	it('should emit and track updated', async () => {
		const options = getOptions();

		const user = userEvent.setup();

		const { getByLabelText, emitted } = render(LoanSearchRadioGroupFilter, {
			props: { options, filterKey: 'option', eventAction: 'action' }
		});

		let radio = getByLabelText(ALL_LOANS_TITLE);
		expect(radio.checked).toBeTruthy();

		radio = getByLabelText('Option 1');
		await user.click(radio);
		expect(radio.checked).toBeTruthy();

		expect(mockTrackEvent).toHaveBeenCalledTimes(1);
		expect(mockTrackEvent).toHaveBeenCalledWith('Lending', 'action', '2');

		expect(emitted().updated[0]).toEqual([{ option: options[1].value }]);
	});

	it('should emit and track updated when map used', async () => {
		const user = userEvent.setup();

		const options = getOptions(true);
		const map = getValueMap(options);

		const { getByLabelText, emitted } = render(LoanSearchRadioGroupFilter, {
			props: {
				options, filterKey: 'option', eventAction: 'action', valueMap: map
			}
		});

		let radio = getByLabelText(ALL_LOANS_TITLE);
		expect(radio.checked).toBeTruthy();

		radio = getByLabelText('Option 1');
		await user.click(radio);
		expect(radio.checked).toBeTruthy();

		expect(mockTrackEvent).toHaveBeenCalledTimes(1);
		expect(mockTrackEvent).toHaveBeenCalledWith('Lending', 'action', '1');

		expect(emitted().updated[0]).toEqual([{ option: options[1].value }]);
	});

	it('should use value map', async () => {
		const user = userEvent.setup();

		const options = getOptions();
		const map = getValueMap(options);

		const { getByLabelText, updateProps, emitted } = render(LoanSearchRadioGroupFilter, {
			props: {
				options, selected: '2', filterKey: 'option', eventAction: 'action', valueMap: map
			}
		});

		let radio = getByLabelText(ALL_LOANS_TITLE);
		expect(radio.checked).toBeFalsy();

		radio = getByLabelText('Option 1');
		expect(radio.checked).toBeTruthy();

		await updateProps({ selected: options[0].value });
		radio = getByLabelText('Option 0');
		expect(radio.checked).toBeTruthy();

		radio = getByLabelText('Option 1');
		await user.click(radio);
		expect(radio.checked).toBeTruthy();

		expect(emitted().updated[0]).toEqual([{ option: options[1].value }]);
	});

	it('should handle boolean', async () => {
		const user = userEvent.setup();

		const options = getOptions(false, true);
		const map = getValueMap(options);

		const { getByLabelText, updateProps, emitted } = render(LoanSearchRadioGroupFilter, {
			props: {
				options, filterKey: 'option', eventAction: 'action', valueMap: map
			}
		});

		let radio = getByLabelText(ALL_LOANS_TITLE);
		expect(radio.checked).toBeTruthy();

		await updateProps({ selected: options[0].value });
		radio = getByLabelText('Option 0');
		expect(radio.checked).toBeTruthy();

		radio = getByLabelText('Option 1');
		await user.click(radio);
		expect(radio.checked).toBeTruthy();

		expect(emitted().updated[0]).toEqual([{ option: options[1].value }]);
	});

	it('should handle object', async () => {
		const user = userEvent.setup();

		const options = getOptions(true);
		const map = getValueMap(options);

		const { getByLabelText, updateProps, emitted } = render(LoanSearchRadioGroupFilter, {
			props: {
				options, filterKey: 'option', selected: false, eventAction: 'action', valueMap: map
			}
		});

		let radio = getByLabelText(ALL_LOANS_TITLE);
		expect(radio.checked).toBeTruthy();

		await updateProps({ selected: options[0].value });
		radio = getByLabelText('Option 0');
		expect(radio.checked).toBeTruthy();

		radio = getByLabelText('Option 1');
		await user.click(radio);
		expect(radio.checked).toBeTruthy();

		expect(emitted().updated[0]).toEqual([{ option: options[1].value }]);
	});
});

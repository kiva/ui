import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchGenderFilter,
{
	BOTH_TITLE,
	FEMALE_KEY,
	FEMALE_TITLE,
	MALE_KEY,
	MALE_TITLE,
	NON_BINARY_TITLE,
	NON_BINARY_KEY
} from '@/components/Lend/LoanSearch/LoanSearchGenderFilter';

describe('LoanSearchGenderFilter', () => {
	it('should default to both', () => {
		const { getByLabelText } = render(LoanSearchGenderFilter);
		const radio = getByLabelText(BOTH_TITLE);
		expect(radio.checked).toBeTruthy();
	});

	it('should select based on prop', async () => {
		const { getByLabelText, updateProps } = render(LoanSearchGenderFilter);

		let radio = getByLabelText(BOTH_TITLE);
		expect(radio.checked).toBeTruthy();

		await updateProps({ gender: FEMALE_KEY });
		radio = getByLabelText(FEMALE_TITLE);
		expect(radio.checked).toBeTruthy();

		await updateProps({ gender: MALE_KEY });
		radio = getByLabelText(MALE_TITLE);
		expect(radio.checked).toBeTruthy();

		await updateProps({ gender: NON_BINARY_KEY });
		radio = getByLabelText(NON_BINARY_TITLE);
		expect(radio.checked).toBeTruthy();

		await updateProps({ gender: '' });
		radio = getByLabelText(BOTH_TITLE);
		expect(radio.checked).toBeTruthy();

		await updateProps({ gender: 'asd' });
		radio = getByLabelText(BOTH_TITLE);
		expect(radio.checked).toBeTruthy();

		await updateProps({ gender: null });
		radio = getByLabelText(BOTH_TITLE);
		expect(radio.checked).toBeTruthy();
	});

	it('should select based on click', async () => {
		const user = userEvent.setup();
		const { getByLabelText } = render(LoanSearchGenderFilter);

		let radio = getByLabelText(BOTH_TITLE);
		expect(radio.checked).toBeTruthy();

		radio = getByLabelText(FEMALE_TITLE);
		expect(radio.checked).toBeFalsy();
		await user.click(radio);
		expect(radio.checked).toBeTruthy();

		radio = getByLabelText(MALE_TITLE);
		expect(radio.checked).toBeFalsy();
		await user.click(radio);
		expect(radio.checked).toBeTruthy();

		radio = getByLabelText(NON_BINARY_TITLE);
		expect(radio.checked).toBeFalsy();
		await user.click(radio);
		expect(radio.checked).toBeTruthy();
	});
});

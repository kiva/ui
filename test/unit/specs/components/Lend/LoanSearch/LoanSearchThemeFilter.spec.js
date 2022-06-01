import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { getCheckboxLabel } from '@/util/loanSearchUtils';
import LoanSearchThemeFilter from '@/components/Lend/LoanSearch/LoanSearchThemeFilter';

const getItems = disabled => [...Array(4)].map((_c, i) => ({
	id: i,
	name: `Option ${i}`,
	numLoansFundraising: disabled ? 0 : 5,
}));

describe('LoanSearchThemeFilter', () => {
	it('should display items', () => {
		const themes = getItems();
		const { getByText } = render(LoanSearchThemeFilter, { props: { themes } });
		themes.forEach(item => getByText(getCheckboxLabel(item)));
	});

	it('should emit updated', async () => {
		const user = userEvent.setup();
		const themes = getItems();
		const { getByText, emitted } = render(LoanSearchThemeFilter, { props: { themes } });

		// Select first theme
		const country = getByText(getCheckboxLabel(themes[0]));
		await user.click(country);

		// Expect theme name to be emitted
		expect(emitted().updated[0]).toEqual([{ theme: [themes[0].name] }]);
	});

	it('should disable checkboxes when no fundraising loans', async () => {
		const initialThemes = getItems();
		const { getByLabelText, updateProps } = render(LoanSearchThemeFilter, { props: { themes: initialThemes } });

		initialThemes.forEach(a => expect(getByLabelText(getCheckboxLabel(a)).disabled).toBeFalsy());

		const themes = getItems(true);
		await updateProps({ themes });

		themes.forEach(a => expect(getByLabelText(getCheckboxLabel(a)).disabled).toBeTruthy());
	});
});

import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { getCheckboxLabel } from '@/util/loanSearchUtils';
import LoanSearchAttributeFilter from '@/components/Lend/LoanSearch/LoanSearchAttributeFilter';

const getItems = disabled => [...Array(4)].map((_c, i) => ({
	id: i,
	name: `Option ${i}`,
	numLoansFundraising: disabled ? 0 : 5,
}));

describe('LoanSearchAttributeFilter', () => {
	it('should display items', () => {
		const attributes = getItems();
		const { getByText } = render(LoanSearchAttributeFilter, { props: { attributes } });
		attributes.forEach(item => getByText(getCheckboxLabel(item)));
	});

	it('should emit updated', async () => {
		const user = userEvent.setup();
		const attributes = getItems();
		const { getByText, emitted } = render(LoanSearchAttributeFilter, { props: { attributes } });

		// Select first attribute
		const country = getByText(getCheckboxLabel(attributes[0]));
		await user.click(country);

		// Expect attribute name to be emitted
		expect(emitted().updated[0]).toEqual([{ attribute: [attributes[0].name] }]);
	});

	it('should disable checkboxes when no fundraising loans', async () => {
		const { getByLabelText, updateProps } = render(LoanSearchAttributeFilter, { props: { regions: getItems() } });

		const attributes = getItems(true);
		await updateProps({ attributes });

		attributes.forEach(a => expect(getByLabelText(getCheckboxLabel(a)).disabled).toBeTruthy());
	});
});

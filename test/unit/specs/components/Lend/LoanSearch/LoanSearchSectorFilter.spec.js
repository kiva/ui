import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchSectorFilter from '@/components/Lend/LoanSearch/LoanSearchSectorFilter';
import { getCheckboxLabel } from '@/util/loanSearchUtils';

const getItems = disabled => [...Array(4)].map((_c, i) => ({
	id: i,
	name: `Option ${i}`,
	numLoansFundraising: disabled ? 0 : 5,
}));

describe('LoanSearchSectorFilter', () => {
	it('should display items', () => {
		const sectors = getItems();

		const { getByText } = render(LoanSearchSectorFilter, { props: { sectors } });

		sectors.forEach(item => getByText(getCheckboxLabel(item)));
	});

	it('should pre-select', () => {
		const sectors = getItems();

		const { getByLabelText } = render(LoanSearchSectorFilter, { props: { sectors, sectorIds: [0] } });

		expect(getByLabelText(getCheckboxLabel(sectors[0])).checked).toBeTruthy();
	});

	it('should select based on prop', async () => {
		const sectors = getItems();

		const { getByLabelText, updateProps } = render(LoanSearchSectorFilter, { props: { sectors } });

		await updateProps({ sectorIds: [0] });
		expect(getByLabelText(getCheckboxLabel(sectors[0])).checked).toBeTruthy();

		await updateProps({ sectorIds: [0, 1] });
		expect(getByLabelText(getCheckboxLabel(sectors[0])).checked).toBeTruthy();
		expect(getByLabelText(getCheckboxLabel(sectors[1])).checked).toBeTruthy();

		await updateProps({ sectorIds: [] });
		sectors.forEach(item => expect(getByLabelText(getCheckboxLabel(item)).checked).toBeFalsy());
	});

	it('should emit updated', async () => {
		const sectors = getItems();

		const user = userEvent.setup();
		const { getByText, emitted } = render(LoanSearchSectorFilter, { props: { sectors } });

		const sector = getByText(getCheckboxLabel(sectors[0]));
		await user.click(sector);

		expect(emitted().updated[0]).toEqual([{ sectorId: [sectors[0].id] }]);
	});

	it('should disable checkboxes when no fundraising loans', async () => {
		const initialSectors = getItems();

		const { getByLabelText, updateProps } = render(LoanSearchSectorFilter, { props: { sectors: initialSectors } });

		initialSectors.forEach(s => expect(getByLabelText(getCheckboxLabel(s)).disabled).toBeFalsy());

		const sectors = getItems(true);
		await updateProps({ sectors });

		sectors.forEach(s => expect(getByLabelText(getCheckboxLabel(s)).disabled).toBeTruthy());
	});
});

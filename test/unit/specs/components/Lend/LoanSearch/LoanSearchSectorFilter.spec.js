import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchSectorFilter from '@/components/Lend/LoanSearch/LoanSearchSectorFilter';

const sectors = [
	{
		id: 1,
		name: 'Option 1'
	},
	{
		id: 2,
		name: 'Option 2'
	},
	{
		id: 3,
		name: 'Option 3'
	},
	{
		id: 4,
		name: 'Option 4'
	}
];

describe('LoanSearchSectorFilter', () => {
	it('should display items', () => {
		const { getByText } = render(LoanSearchSectorFilter, { props: { sectors } });
		sectors.forEach(item => getByText(item.name));
	});

	it('should pre-select', () => {
		const { getByLabelText } = render(LoanSearchSectorFilter, { props: { sectors, sectorIds: [1] } });
		expect(getByLabelText('Option 1').checked).toBeTruthy();
	});

	it('should select based on prop', async () => {
		const { getByLabelText, updateProps } = render(LoanSearchSectorFilter, { props: { sectors } });

		await updateProps({ sectorIds: [1] });
		expect(getByLabelText('Option 1').checked).toBeTruthy();

		await updateProps({ sectorIds: [1, 2] });
		expect(getByLabelText('Option 1').checked).toBeTruthy();
		expect(getByLabelText('Option 2').checked).toBeTruthy();

		await updateProps({ sectorIds: [] });
		sectors.forEach(item => expect(getByLabelText(item.name).checked).toBeFalsy());
	});

	it('should emit updated', async () => {
		const user = userEvent.setup();
		const { getByText, emitted } = render(LoanSearchSectorFilter, { props: { sectors } });

		const sector = getByText(sectors[0].name);
		await user.click(sector);

		expect(emitted().updated[0]).toEqual([{ sectorId: [sectors[0].id] }]);
	});
});

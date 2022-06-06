import { render } from '@testing-library/vue';
// eslint-disable-next-line import/no-unresolved
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

	it('should emit updated', async () => {
		const user = userEvent.setup();
		const { getByText, emitted } = render(LoanSearchSectorFilter, { props: { sectors } });

		const sector = getByText(sectors[0].name);
		await user.click(sector);

		expect(emitted().updated[0]).toEqual([{ sectorId: [sectors[0].id] }]);
	});
});

import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { getCheckboxLabel } from '@/util/loanSearch/filterUtils';
import LoanSearchLocationFilter from '@/components/Lend/LoanSearch/LoanSearchLocationFilter';

const NUM_ITEMS = 4;

const getRegions = (disabled = false) => [...Array(NUM_ITEMS)].map((_r, i) => ({
	region: `Region ${i}`,
	numLoansFundraising: disabled ? 0 : 20,
	countries: [...Array(NUM_ITEMS)].map((_c, j) => ({
		name: `Country ${j}`,
		isoCode: `ISO ${j}`,
		numLoansFundraising: disabled ? 0 : 5
	}))
}));

describe('LoanSearchLocationFilter', () => {
	it('should display regions', () => {
		const regions = getRegions();
		const { getByText } = render(LoanSearchLocationFilter, { props: { regions } });
		regions.forEach(async region => {
			getByText(getCheckboxLabel(region));
		});
	});

	it('should toggle regions', async () => {
		const user = userEvent.setup();
		const regions = getRegions();
		const { getByText, queryAllByText } = render(LoanSearchLocationFilter, { props: { regions } });

		// Open all regions
		await Promise.all(regions.map(async region => {
			const button = getByText(getCheckboxLabel(region));
			await user.click(button);
		}));

		let countries = queryAllByText(getCheckboxLabel(regions[0].countries[0]));
		expect(countries.length).toBe(NUM_ITEMS);

		// Close all regions
		await Promise.all(regions.map(async region => {
			const button = getByText(getCheckboxLabel(region));
			await user.click(button);
		}));

		countries = queryAllByText(getCheckboxLabel(regions[0].countries[0]));
		expect(countries.length).toBe(0);
	});

	it('should pre-select', async () => {
		const user = userEvent.setup();

		const regions = getRegions();

		const { getByText, getByLabelText } = render(LoanSearchLocationFilter, {
			props: { activeIsoCodes: [regions[0].countries[0].isoCode], regions }
		});

		// Open first region
		const region = getByText(getCheckboxLabel(regions[0]));
		await user.click(region);

		expect(getByLabelText(getCheckboxLabel(regions[0].countries[0])).checked).toBeTruthy();
	});

	it('should select based on prop', async () => {
		const user = userEvent.setup();

		const regions = getRegions();

		const { getByText, getByLabelText, updateProps } = render(LoanSearchLocationFilter, { props: { regions } });

		// Open first region
		const region = getByText(getCheckboxLabel(regions[0]));
		await user.click(region);

		expect(getByLabelText(getCheckboxLabel(regions[0].countries[0])).checked).toBeFalsy();

		await updateProps({ activeIsoCodes: [regions[0].countries[0].isoCode] });
		expect(getByLabelText(getCheckboxLabel(regions[0].countries[0])).checked).toBeTruthy();

		await updateProps({ activeIsoCodes: [regions[0].countries[0].isoCode, regions[0].countries[1].isoCode] });
		expect(getByLabelText(getCheckboxLabel(regions[0].countries[0])).checked).toBeTruthy();
		expect(getByLabelText(getCheckboxLabel(regions[0].countries[1])).checked).toBeTruthy();

		await updateProps({ activeIsoCodes: [] });
		expect(getByLabelText(getCheckboxLabel(regions[0].countries[0])).checked).toBeFalsy();
		expect(getByLabelText(getCheckboxLabel(regions[0].countries[1])).checked).toBeFalsy();
	});

	it('should emit updated', async () => {
		const user = userEvent.setup();
		const regions = getRegions();
		const { getByText, emitted } = render(LoanSearchLocationFilter, { props: { regions } });

		// Open first region
		const region = getByText(getCheckboxLabel(regions[0]));
		await user.click(region);

		// Select first country
		const country = getByText(getCheckboxLabel(regions[0].countries[0]));
		await user.click(country);

		// Expect ISO code to be emitted
		expect(emitted().updated[0]).toEqual([{ countryIsoCode: [regions[0].countries[0].isoCode] }]);
	});

	it('should disable checkboxes when no fundraising loans', async () => {
		const user = userEvent.setup();
		const { getByText, getByLabelText, updateProps } = render(LoanSearchLocationFilter, {
			props: { regions: getRegions() }
		});

		const regions = getRegions(true);
		await updateProps({ regions });

		await user.click(getByText(getCheckboxLabel(regions[0])));
		regions[0].countries.forEach(c => expect(getByLabelText(getCheckboxLabel(c)).disabled).toBeTruthy());
	});
});

import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchLocationFilter, { getLabel } from '@/components/Lend/LoanSearch/LoanSearchLocationFilter';

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
			getByText(getLabel(region));
		});
	});

	it('should toggle regions', async () => {
		const user = userEvent.setup();
		const regions = getRegions();
		const { getByText, queryAllByText } = render(LoanSearchLocationFilter, { props: { regions } });

		// Open all regions
		await Promise.all(regions.map(async region => {
			const button = getByText(getLabel(region));
			await user.click(button);
		}));

		let countries = queryAllByText(getLabel(regions[0].countries[0]));
		expect(countries.length).toBe(NUM_ITEMS);

		// Close all regions
		await Promise.all(regions.map(async region => {
			const button = getByText(getLabel(region));
			await user.click(button);
		}));

		countries = queryAllByText(getLabel(regions[0].countries[0]));
		expect(countries.length).toBe(0);
	});

	it('should emit updated', async () => {
		const user = userEvent.setup();
		const regions = getRegions();
		const { getByText, emitted } = render(LoanSearchLocationFilter, { props: { regions } });

		// Open first region
		const region = getByText(getLabel(regions[0]));
		await user.click(region);

		// Select first country
		const country = getByText(getLabel(regions[0].countries[0]));
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

		await user.click(getByText(getLabel(regions[0])));
		regions[0].countries.map(c => expect(getByLabelText(getLabel(c)).disabled).toBeTruthy());
	});
});

import { render } from '@testing-library/vue';
import LoansFirstLoanCta from '#src/components/Portfolio/LoansFirstLoanCta';

describe('LoansFirstLoanCta', () => {
	it('shows the first-loan onboarding headline', () => {
		const { getByText } = render(LoansFirstLoanCta);
		expect(getByText(/You haven't made a loan yet/i)).toBeTruthy();
	});

	it('links to the woman, single-parent, and all-categories lend pages', () => {
		const { getByText } = render(LoansFirstLoanCta);

		expect(getByText('woman').getAttribute('href')).toBe('/lend-by-category/women');
		expect(getByText('single parent').getAttribute('href')).toBe('/lend-by-category/single-parents');
		expect(getByText('another category').getAttribute('href')).toBe('/lend-by-category');
	});
});

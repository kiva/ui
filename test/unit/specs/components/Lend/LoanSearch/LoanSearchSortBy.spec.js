import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchSortBy from '@/components/Lend/LoanSearch/LoanSearchSortBy';
import { filterOptionUtils } from '@kiva/kv-loan-filters';

// Prospective sort options from both APIs (values for flss will expand)
const allSortOptions = [
	{ name: 'amountLeft', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'expiringSoon', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'loanAmount', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'loanAmountDesc', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'newest', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'popularity', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'random', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'repaymentTerm', sortSrc: filterOptionUtils.STANDARD_QUERY_TYPE },
	{ name: 'amountHighToLow', sortSrc: filterOptionUtils.FLSS_QUERY_TYPE },
	{ name: 'amountLowToHigh', sortSrc: filterOptionUtils.FLSS_QUERY_TYPE },
	{ name: 'expiringSoon', sortSrc: filterOptionUtils.FLSS_QUERY_TYPE },
	{ name: 'personalized', sortSrc: filterOptionUtils.FLSS_QUERY_TYPE }
];

describe('LoanSearchSortBy', () => {
	it('should display flss sort options', () => {
		const { getByLabelText } = render(LoanSearchSortBy, { props: { allSortOptions } });

		const recommendedSort = getByLabelText('Recommended', { selector: 'input' });
		expect(recommendedSort).toHaveProperty('value', 'personalized');

		const expiringSoonSort = getByLabelText('Ending soon', { selector: 'input' });
		expect(expiringSoonSort).toHaveProperty('value', 'expiringSoon');

		const amountHighToLow = getByLabelText('Amount: High to Low', { selector: 'input' });
		expect(amountHighToLow).toHaveProperty('value', 'amountHighToLow');

		const amountLowToHigh = getByLabelText('Amount: Low to High', { selector: 'input' });
		expect(amountLowToHigh).toHaveProperty('value', 'amountLowToHigh');
	});

	it('should display initial flss sort option', async () => {
		const { getByLabelText } = render(LoanSearchSortBy, { props: { allSortOptions } });

		const recommendedSort = getByLabelText('Recommended', { selector: 'input' });
		expect(recommendedSort.checked).toBeTruthy();
	});

	it('should select based on prop', async () => {
		const { getByLabelText, updateProps } = render(LoanSearchSortBy, { props: { allSortOptions } });

		const recommendedSort = getByLabelText('Recommended', { selector: 'input' });
		expect(recommendedSort.checked).toBeTruthy();

		await updateProps({ sort: 'expiringSoon' });
		let radio = getByLabelText('Ending soon');
		expect(radio.checked).toBeTruthy();

		await updateProps({ sort: '' });
		radio = getByLabelText('Recommended');
		expect(radio.checked).toBeTruthy();

		await updateProps({ sort: 'asd' });
		radio = getByLabelText('Recommended');
		expect(radio.checked).toBeTruthy();

		await updateProps({ sort: null });
		radio = getByLabelText('Recommended');
		expect(radio.checked).toBeTruthy();
	});

	it('should change sort option when clicked', async () => {
		const user = userEvent.setup();
		const { getByLabelText } = render(LoanSearchSortBy, { props: { allSortOptions } });

		const recommendedSort = getByLabelText('Recommended', { selector: 'input' });
		const expiringSoonSort = getByLabelText('Ending soon', { selector: 'input' });

		await user.click(expiringSoonSort);
		expect(expiringSoonSort.checked).toBeTruthy();

		await user.click(recommendedSort);
		expect(recommendedSort.checked).toBeTruthy();
	});

	it('should emit updated sort option when clicked', async () => {
		const user = userEvent.setup();
		const { getByLabelText, emitted } = render(LoanSearchSortBy, { props: { allSortOptions } });

		const recommendedSort = getByLabelText('Recommended', { selector: 'input' });
		const expiringSoonSort = getByLabelText('Ending soon', { selector: 'input' });

		await user.click(expiringSoonSort);
		expect(emitted().updated[0]).toEqual([{ sortBy: 'expiringSoon' }]);

		await user.click(recommendedSort);
		expect(emitted().updated[1]).toEqual([{ sortBy: 'personalized' }]);
	});
});

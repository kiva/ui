import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchSortBy from '@/components/Lend/LoanSearch/LoanSearchSortBy';

// Prospective sort options from both APIs (values for flss will expand)
const allSortOptions = [
	{ name: 'amountLeft', sortSrc: 'standard' },
	{ name: 'expiringSoon', sortSrc: 'standard' },
	{ name: 'loanAmount', sortSrc: 'standard' },
	{ name: 'loanAmountDesc', sortSrc: 'standard' },
	{ name: 'newest', sortSrc: 'standard' },
	{ name: 'popularity', sortSrc: 'standard' },
	{ name: 'random', sortSrc: 'standard' },
	{ name: 'repaymentTerm', sortSrc: 'standard' },
	{ name: 'amountHighToLow', sortSrc: 'flss' },
	{ name: 'amountLowToHigh', sortSrc: 'flss' },
	{ name: 'expiringSoon', sortSrc: 'flss' },
	{ name: 'personalized', sortSrc: 'flss' }
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

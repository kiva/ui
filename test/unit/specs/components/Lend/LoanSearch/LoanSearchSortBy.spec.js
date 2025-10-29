import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanSearchSortBy from '../../../../../../src/components/Lend/LoanSearch/LoanSearchSortBy';
import { FLSS_QUERY_TYPE, STANDARD_QUERY_TYPE } from '../../../../../../src/util/loanSearch/filterUtils';

// Prospective sort options from both APIs (values for flss will expand)
const allSortOptions = [
	{ name: 'amountLeft', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'expiringSoon', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'loanAmount', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'loanAmountDesc', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'newest', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'popularity', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'random', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'repaymentTerm', sortSrc: STANDARD_QUERY_TYPE },
	{ name: 'amountHighToLow', sortSrc: FLSS_QUERY_TYPE },
	{ name: 'amountLowToHigh', sortSrc: FLSS_QUERY_TYPE },
	{ name: 'expiringSoon', sortSrc: FLSS_QUERY_TYPE },
	{ name: 'personalized', sortSrc: FLSS_QUERY_TYPE }
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
		const { getByLabelText, rerender } = render(LoanSearchSortBy, { props: { allSortOptions } });

		const recommendedSort = getByLabelText('Recommended', { selector: 'input' });
		expect(recommendedSort.checked).toBeTruthy();

		await rerender({ sort: 'expiringSoon' });
		let radio = getByLabelText('Ending soon');
		expect(radio.checked).toBeTruthy();

		await rerender({ sort: '' });
		radio = getByLabelText('Recommended');
		expect(radio.checked).toBeTruthy();

		await rerender({ sort: 'asd' });
		radio = getByLabelText('Recommended');
		expect(radio.checked).toBeTruthy();

		await rerender({ sort: null });
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

	it('should display info copy for logged in users', () => {
		const { getByText } = render(LoanSearchSortBy, {
			props: { allSortOptions, isLoggedIn: true }
		});

		// Line 80 - isLoggedIn branch
		getByText("Loans we think you'll love based on your lending history.");
	});

	it('should display info copy for logged out users', () => {
		const { getByText } = render(LoanSearchSortBy, {
			props: { allSortOptions, isLoggedIn: false }
		});

		// Line 80 - isLoggedIn false branch
		getByText('Loans recommended by others. Log in for personalized recommendations.');
	});

	it('should handle undefined allSortOptions', () => {
		const { container } = render(LoanSearchSortBy, {
			props: { allSortOptions: undefined }
		});

		// Line 97 - validSortOptions should return empty array with nullish coalescing
		const radios = container.querySelectorAll('input[type="radio"]');
		expect(radios.length).toBe(0);
	});

	it('should handle null allSortOptions', () => {
		const { container } = render(LoanSearchSortBy, {
			props: { allSortOptions: null }
		});

		// Line 97 - validSortOptions should return empty array
		const radios = container.querySelectorAll('input[type="radio"]');
		expect(radios.length).toBe(0);
	});

	it('should display standard query type sort options', () => {
		const { getByLabelText } = render(LoanSearchSortBy, {
			props: {
				allSortOptions,
				queryType: STANDARD_QUERY_TYPE
			}
		});

		// Should show standard sort options (line 93-94 branch)
		const popularitySort = getByLabelText('Trending now', { selector: 'input' });
		expect(popularitySort).toHaveProperty('value', 'popularity');

		const expiringSoonSort = getByLabelText('Ending soon', { selector: 'input' });
		expect(expiringSoonSort).toHaveProperty('value', 'expiringSoon');
	});

	it('should use correct default sort for standard query type', () => {
		const { getByLabelText } = render(LoanSearchSortBy, {
			props: {
				allSortOptions,
				queryType: STANDARD_QUERY_TYPE
			}
		});

		// Line 107 - defaultSort should be 'popularity' for STANDARD_QUERY_TYPE
		const popularitySort = getByLabelText('Trending now', { selector: 'input' });
		expect(popularitySort.checked).toBeTruthy();
	});
});

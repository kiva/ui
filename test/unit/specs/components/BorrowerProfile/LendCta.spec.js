import { ref } from 'vue';
import { render } from '@testing-library/vue';
import LendCta from '#src/components/BorrowerProfile/LendCta';
import { globalOptions } from '../../../specUtils';

vi.mock('#src/composables/useMultiMatching', () => ({
	default: () => ({ enableMultiMatching: ref(true), multiMatchingResolved: ref(true) }),
}));

const textOf = element => element.textContent.replace(/\s+/g, ' ').trim();

function renderVersionB(loan = {}) {
	return render(LendCta, {
		props: { loanData: { id: 1, status: 'fundraising', ...loan }, newUserBpEnabled: true },
		slots: { sharebutton: '<button>Share</button>' },
		global: { ...globalOptions, stubs: { KvAtbModalContainer: true } },
	});
}

describe('LendCta in version b of the new user borrower profile', () => {
	it('has no share button and no "Borrower story" or "Loan details" links', () => {
		const { queryByText, queryByTestId } = renderVersionB();

		expect(queryByText('Share')).toBeNull();
		expect(queryByTestId('bp-jump-link-borrower-story')).toBeNull();
		expect(queryByTestId('bp-jump-link-loan-details')).toBeNull();
	});

	it('shows the 501(c)3 status and the Charity Navigator rating as plain text with four stars', () => {
		const row = renderVersionB().getByTestId('bp-nonprofit-trust-row');

		expect([...row.querySelectorAll('p')].map(textOf))
			.toEqual(['501(c)3 U.S. nonprofit', 'Charity Navigator (4/4)']);
		expect(row.querySelectorAll('a')).toHaveLength(0);
		expect(row.querySelectorAll('svg')).toHaveLength(4);
	});

	it('shows the partner and ratio for a loan with one matching partner', () => {
		const { getByTestId } = renderVersionB({
			simultaneousMatching: [{ managedAccountId: 1, displayName: 'Walton Family Foundation', ratio: 1 }],
		});

		expect(textOf(getByTestId('bp-loan-matching-text')))
			.toBe('2x matching by Walton Family Foundation while funds last');
	});

	it('lists every matching partner with their own ratio when several partners match', () => {
		const { getByTestId } = renderVersionB({
			simultaneousMatching: [
				{ managedAccountId: 1, displayName: 'Capital One', ratio: 1 },
				{ managedAccountId: 2, displayName: 'ACI Worldwide', ratio: 2 },
				{ managedAccountId: 3, displayName: null, ratio: 1 },
			],
		});

		expect(textOf(getByTestId('bp-loan-matching-text')))
			.toBe('2x matching by Capital One, 3x matching by ACI Worldwide, and 2x matching by a Kiva supporter');
	});

	it('leaves no matching text in place for a loan without matching', () => {
		const { queryByTestId } = renderVersionB();

		expect(queryByTestId('bp-loan-matching-info')).toBeNull();
	});
});

/* eslint-disable import/no-extraneous-dependencies */
import { ref } from 'vue';
import { render } from '@testing-library/vue';
import { enableAutoUnmount, shallowMount } from '@vue/test-utils';
import LendCta from '#src/components/BorrowerProfile/LendCta';
import { globalOptions } from '../../../specUtils';

const multiMatching = vi.hoisted(() => ({ enabled: true }));

vi.mock('#src/composables/useMultiMatching', () => ({
	default: () => ({ enableMultiMatching: ref(multiMatching.enabled), multiMatchingResolved: ref(true) }),
}));

enableAutoUnmount(afterEach);

afterEach(() => {
	multiMatching.enabled = true;
});

function mountLendCta(props = {}) {
	return shallowMount(LendCta, {
		props: {
			loanId: 123,
			loanData: {
				id: 123,
				status: 'fundraising',
				name: 'Maria',
				loanAmount: '500',
				unreservedAmount: '400',
				loanFundraisingInfo: { fundedAmount: '100', reservedAmount: '0', isExpiringSoon: false },
				lenders: { totalCount: 3 },
			},
			...props,
		},
		global: {
			...globalOptions,
			renderStubDefaultSlot: true,
			mocks: { ...globalOptions.mocks, $route: { params: { id: '123' }, query: {} } },
		},
	});
}

describe('LendCta jump links', () => {
	it('shows the divider and the jump links by default (control layout)', () => {
		const wrapper = mountLendCta();

		expect(wrapper.find('hr').exists()).toBe(true);
		expect(wrapper.find('[data-testid="bp-lend-cta-jump-links"]').exists()).toBe(true);
	});

	it('hides the divider and the jump links when hideJumpLinks is on', () => {
		const wrapper = mountLendCta({ hideJumpLinks: true });

		expect(wrapper.find('hr').exists()).toBe(false);
		expect(wrapper.find('[data-testid="bp-lend-cta-jump-links"]').exists()).toBe(false);
	});
});

const textOf = element => element.textContent.replace(/\s+/g, ' ').trim();

// Mounted the way FullBorrowerProfile mounts the lend box in the new user version
function renderVersionB(loan = {}, props = {}) {
	return render(LendCta, {
		props: {
			loanData: { id: 1, status: 'fundraising', ...loan },
			newUserBpEnabled: true,
			hideJumpLinks: true,
			...props,
		},
		global: { ...globalOptions, stubs: { KvAtbModalContainer: true } },
	});
}

describe('LendCta in version b of the new user borrower profile', () => {
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

	it('shows the single matching partner when multi matching is off, even if the loan has several', () => {
		multiMatching.enabled = false;
		const { getByTestId } = renderVersionB({
			matchingText: 'Walton Family Foundation',
			matchRatio: 1,
			loanAmount: '15000.00',
			loanFundraisingInfo: { fundedAmount: '8000.00', reservedAmount: '0.00' },
			simultaneousMatching: [
				{ managedAccountId: 1, displayName: 'Capital One', ratio: 1 },
				{ managedAccountId: 2, displayName: 'ACI Worldwide', ratio: 2 },
			],
		});

		expect(textOf(getByTestId('bp-loan-matching-text')))
			.toBe('2x matching by Walton Family Foundation while funds last');
	});

	it('shows how many others support the borrower instead of "powered by" lenders', () => {
		const { getByTestId, queryByText } = renderVersionB({ name: 'Rachel', lenders: { totalCount: 2058 } });

		expect(queryByText(/powered by/i)).toBeNull();
		expect(textOf(getByTestId('bp-loan-supporters-text'))).toBe('2,058 others supporting Rachel');
	});

	it('leaves no matching text in place for a loan without matching', () => {
		const { queryByTestId } = renderVersionB();

		expect(queryByTestId('bp-loan-matching-info')).toBeNull();
	});

	it('gives the sticky copy its own matching tooltip id, so the tooltip in each lend box works', () => {
		const { container } = renderVersionB({
			simultaneousMatching: [{ managedAccountId: 1, displayName: 'Walton Family Foundation', ratio: 1 }],
		}, { stickyCopy: true });

		expect(container.querySelector('#sticky-lend-box-matching-tooltip')).not.toBeNull();
		expect(container.querySelector('#lend-box-matching-tooltip')).toBeNull();
	});

	it('keeps the lend bar fixed at the bottom on mobile and tablet before the visitor scrolls', () => {
		const lendBar = renderVersionB().getByTestId('bp-lend-cta-select-and-button').closest('.tw-bottom-0');

		expect(lendBar.classList).toContain('tw-fixed');
		expect(lendBar.classList).not.toContain('md:tw-static');
	});
});

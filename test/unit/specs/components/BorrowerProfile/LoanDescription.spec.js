/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import LoanDescription from '#src/components/BorrowerProfile/LoanDescription';
import { globalOptions } from '../../../specUtils';

const groupBorrowers = [
	{ id: 1, firstName: 'Aisha' },
	{ id: 2, firstName: 'Fatima' },
	{ id: 3, firstName: 'Nadia' },
];

const BORROWER_LIST = '[data-testid="bp-story-borrower-list"]';

function mountLoanDescription(props) {
	return mount(LoanDescription, {
		global: { ...globalOptions },
		props: {
			loanId: 2000015,
			borrowerOrGroupName: 'Aisha\'s Group',
			borrowerCount: 3,
			borrowers: groupBorrowers,
			storyDescription: 'A group of farmers working together to grow their businesses.',
			...props,
		},
	});
}

describe('LoanDescription', () => {
	it('lists the group members for a non-anonymized group loan', () => {
		const wrapper = mountLoanDescription({ anonymizationLevel: 'none' });

		const list = wrapper.find(BORROWER_LIST);
		expect(list.exists()).toBe(true);
		expect(list.text()).toBe('In this group: Aisha, Fatima, Nadia');
	});

	// Both levels scrub borrower names, so the member list is meaningless and hidden (AD-271).
	it.each(['pii', 'full'])(
		'hides the group members list when the loan is %s anonymized',
		anonymizationLevel => {
			const wrapper = mountLoanDescription({ anonymizationLevel });

			expect(wrapper.find(BORROWER_LIST).exists()).toBe(false);
		},
	);
});

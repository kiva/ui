/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import PreviousLoanDescription from '#src/components/BorrowerProfile/PreviousLoanDescription';
import { globalOptions } from '../../../specUtils';

function mountPreviousLoanDescription() {
	const openDefinition = vi.fn();
	const wrapper = mount(PreviousLoanDescription, {
		props: {
			loanId: 12345,
			previousLoanId: 54321,
			borrowerOrGroupName: 'Test Borrower',
		},
		global: {
			...globalOptions,
			provide: {
				...globalOptions.provide,
				openDefinition,
			},
		},
	});
	return { wrapper, openDefinition };
}

describe('PreviousLoanDescription successive/concurrent info icon', () => {
	it('opens the successive/concurrent definition when the info icon is clicked', async () => {
		const { wrapper, openDefinition } = mountPreviousLoanDescription();

		await wrapper.find('[data-testid="bp-story-successive-concurrent-info"]').trigger('click');

		expect(openDefinition).toHaveBeenCalledWith({
			cid: 'bp-def-successive-concurrent-loans',
			sfid: '50150000000cckn',
			track: [
				'Borrower Profile',
				'click-Loan-Details-tab-definition-link',
				'Learn more about successive and concurrent loans',
			],
		});
	});
});

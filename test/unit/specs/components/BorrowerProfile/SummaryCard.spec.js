/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import SummaryCard from '#src/components/BorrowerProfile/SummaryCard';
import { globalOptions } from '../../../specUtils';

// SummaryCard no longer owns a lightbox: it renders the anonymization affordances
// and delegates to the injected `openDefinition` (provided once per page by
// FullBorrowerProfile / BorrowerSideSheetContent). These tests assert that contract.
function mountSummaryCard({ anonymizationLevel } = {}) {
	const openDefinition = vi.fn();
	const wrapper = mount(SummaryCard, {
		props: {
			loan: {
				id: 12345,
				name: 'Test Borrower',
				fullLoanUse: 'A loan of $600 helps...',
				anonymizationLevel,
			},
		},
		global: {
			...globalOptions,
			mocks: {
				...globalOptions.mocks,
				$route: { params: { id: '12345' } },
			},
			provide: {
				...globalOptions.provide,
				openDefinition,
			},
		},
	});
	return { wrapper, openDefinition };
}

describe('SummaryCard anonymization affordances', () => {
	it('opens the anonymized-loan definition when the PII info icon is clicked', async () => {
		const { wrapper, openDefinition } = mountSummaryCard({ anonymizationLevel: 'pii' });

		await wrapper.find('[data-testid="bp-summary-pii-info"]').trigger('click');

		expect(openDefinition).toHaveBeenCalledWith({
			cid: 'bp-def-anonymized-loan',
			sfid: '501US00000NRTYa',
		});
	});

	it('opens the anonymous-description definition when "Learn more" is clicked', async () => {
		const { wrapper, openDefinition } = mountSummaryCard({ anonymizationLevel: 'full' });

		await wrapper.find('[data-testid="bp-summary-anonymous-learn-more"]').trigger('click');

		expect(openDefinition).toHaveBeenCalledWith({
			cid: 'bp-def-anonymous-description',
			sfid: '50150000000SXVz',
		});
	});

	it('renders neither affordance for a non-anonymized loan', () => {
		const { wrapper } = mountSummaryCard({ anonymizationLevel: '' });

		expect(wrapper.find('[data-testid="bp-summary-pii-info"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="bp-summary-anonymous-learn-more"]').exists()).toBe(false);
	});

	it('shows the PII icon only for pii loans, not full anonymization', () => {
		const { wrapper } = mountSummaryCard({ anonymizationLevel: 'full' });

		expect(wrapper.find('[data-testid="bp-summary-pii-info"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="bp-summary-anonymous-learn-more"]').exists()).toBe(true);
	});
});

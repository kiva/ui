import { render, fireEvent } from '@testing-library/vue';
import RepaymentSchedule from '#src/components/BorrowerProfile/RepaymentSchedule';
import { globalOptions } from '../../../specUtils';

const stubs = {
	KvLightbox: {
		template: '<div v-if="visible" data-testid="repayment-lightbox"><slot></slot></div>',
		props: ['visible', 'title'],
		emits: ['lightbox-closed'],
	},
};

function renderRepaymentSchedule(dataOverrides = {}) {
	const Component = {
		...RepaymentSchedule,
		data() {
			return {
				...RepaymentSchedule.data.call(this),
				isLightboxVisible: false,
				partnerName: 'Test Partner',
				repaymentSchedule: [
					{
						amount: '50.00',
						localAmount: '50.00',
						dueToKivaDate: '2025-06-01T00:00:00Z',
						effectiveDate: '2025-06-01T00:00:00Z',
					},
				],
				repaidAmount: 0,
				loanAmount: 500,
				lenderRepaymentTerm: 12,
				firstRepaymentDate: '2025-06-01T00:00:00Z',
				disbursalDate: '2025-01-01T00:00:00Z',
				...dataOverrides,
			};
		},
		mounted() {
			// Skip calculateRepaymentSchedule in tests
		},
	};

	return render(Component, {
		global: {
			...globalOptions,
			stubs,
		},
		props: { loanId: 123, status: 'fundraising' },
	});
}

describe('RepaymentSchedule', () => {
	it('click trigger opens repayment schedule lightbox', async () => {
		const { getByTestId, queryByTestId } = renderRepaymentSchedule();

		expect(queryByTestId('repayment-lightbox')).toBeNull();

		const trigger = getByTestId('bp-loan-detail-full-repayment-schedule-lightbox-btn');
		await fireEvent.click(trigger);

		expect(getByTestId('repayment-lightbox')).toBeTruthy();
	});
});

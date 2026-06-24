import { render, fireEvent } from '@testing-library/vue';
import PaidAmountModal from '#src/components/Portfolio/PaidAmountModal';

const renderModal = ({ amount = '10', paymentHistory = [] } = {}) => render(PaidAmountModal, {
	props: { amount, paymentHistory },
	global: {
		stubs: {
			// Render the lightbox slot only when visible, mirroring the real component.
			KvLightbox: {
				props: ['visible', 'title'],
				template: '<div v-if="visible" class="kv-lightbox"><slot /></div>',
			},
		},
	},
});

// The clickable trigger is the only span with the tw-text-link class.
const openHistory = async page => {
	await fireEvent.click(page.container.querySelector('.tw-text-link'));
};

const labelRows = page => Array.from(page.container.querySelectorAll('.tw-grid .tw-contents'))
	.map(row => row.querySelectorAll('span')[1].textContent.replace(/\s+/g, ' ').trim());

describe('PaidAmountModal', () => {
	it('shows the empty-state copy when there is no repayment history', async () => {
		const page = renderModal({ paymentHistory: [] });

		await openHistory(page);

		expect(page.getByText('This loan has no repayments')).toBeTruthy();
	});

	it('orders a same-timestamp currency-loss row after its repayment (legacy +0.5 nudge)', async () => {
		const page = renderModal({
			paymentHistory: [
				// Currency-loss row arrives before its same-timestamp repayment in the source order.
				{ createTime: '2026-01-01T00:00:00Z', amount: '5', type: 'loan_repayment_currency_loss' },
				{ createTime: '2026-01-01T00:00:00Z', amount: '20', type: 'loan_repayment' },
				{ createTime: '2025-06-01T00:00:00Z', amount: '10', type: 'loan_repayment' },
			],
		});

		await openHistory(page);

		// Oldest first; the same-second loss row is nudged after its repayment.
		expect(labelRows(page)).toEqual([
			'$10.00 repaid',
			'$20.00 repaid',
			'$5.00 currency loss',
		]);
	});

	it('keeps distinct timestamps in chronological order regardless of type', async () => {
		const page = renderModal({
			paymentHistory: [
				{ createTime: '2026-03-01T00:00:00Z', amount: '8', type: 'loan_repayment' },
				{ createTime: '2026-02-01T00:00:00Z', amount: '3', type: 'direct_loan_repayment_currency_loss' },
			],
		});

		await openHistory(page);

		expect(labelRows(page)).toEqual([
			'$3.00 currency loss',
			'$8.00 repaid',
		]);
	});
});

import { render, fireEvent } from '@testing-library/vue';
import GoalInReviewModal from '#src/components/MyKiva/GoalInReview/GoalInReviewModal';
import { globalOptions } from '../../../specUtils';

vi.mock('@kiva/kv-components', () => ({
	KvLightbox: {
		name: 'KvLightbox',
		props: {
			visible: {
				type: Boolean,
				default: false,
			},
			title: {
				type: String,
				default: '',
			},
		},
		emits: ['lightbox-closed'],
		template: `
			<div v-if="visible" data-testid="goal-in-review-lightbox">
				<slot name="header"></slot>
				<button type="button" @click="$emit('lightbox-closed')">Close</button>
				<slot></slot>
			</div>
		`,
	},
}));

describe('GoalInReviewModal', () => {
	const renderModal = () => render(GoalInReviewModal, {
		global: globalOptions,
		props: {
			show: true,
			data: {
				year: 2026,
			},
		},
	});

	it('renders the seven placeholder slides', () => {
		const { getByText } = renderModal();

		[1, 2, 3, 4, 5, 6, 7].forEach(slideNumber => {
			getByText(`Slide ${slideNumber}`);
		});
	});

	it('emits close when the lightbox closes', async () => {
		const { emitted, getByRole } = renderModal();

		await fireEvent.click(getByRole('button', { name: 'Close' }));

		expect(emitted().close).toHaveLength(1);
	});
});

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
	KvMaterialIcon: {
		name: 'KvMaterialIcon',
		props: ['icon'],
		template: '<span></span>',
	},
	KvMap: {
		name: 'KvMap',
		props: ['countriesData'],
		template: '<div data-testid="kv-map"></div>',
	},
	KvPieChartV2: {
		name: 'KvPieChartV2',
		props: ['values'],
		template: '<div data-testid="kv-pie-chart"></div>',
	},
	KvButton: {
		name: 'KvButton',
		props: ['variant'],
		emits: ['click'],
		template: '<button type="button" @click="$emit(\'click\')"><slot></slot></button>',
	},
	KvFormAssemblyForm: {
		name: 'KvFormAssemblyForm',
		props: ['formAssemblyId', 'title'],
		emits: ['fa-form-submitted'],
		template: '<button type="button" data-testid="fa-submit" @click="$emit(\'fa-form-submitted\')">submit</button>',
	},
}));

describe('GoalInReviewModal', () => {
	const renderModal = ({ trackEvent = vi.fn() } = {}) => render(GoalInReviewModal, {
		global: {
			...globalOptions,
			provide: {
				...globalOptions.provide,
				$kvTrackEvent: trackEvent,
			},
		},
		props: {
			show: true,
			data: {
				year: 2026,
			},
		},
	});

	it('renders the real slides and the remaining placeholders', async () => {
		const { findByText } = renderModal();

		// Slides 1, 3, 4, 5 and 7 are real components; slide 2 is still a placeholder
		await findByText('Your 2026 impact goal recap');
		await findByText('Global reach');
		await findByText('Giving insights');
		await findByText(/Goal Setters create something/);
		await findByText('Thank you!');
		await findByText('Slide 2');
	});

	it('tracks and forwards the slide 7 primary CTA', async () => {
		const trackEvent = vi.fn();
		const currentYear = new Date().getFullYear();
		// in-progress current-year data → primary CTA is "Finish my {year} goal"
		const { emitted, findByText } = render(GoalInReviewModal, {
			global: {
				...globalOptions,
				provide: { ...globalOptions.provide, $kvTrackEvent: trackEvent },
			},
			props: {
				show: true,
				data: { year: currentYear, goalSummary: { status: 'in-progress' } },
			},
		});

		await fireEvent.click(await findByText(`Finish my ${currentYear} goal`));

		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'goal-in-review-finish-goal');
		expect(emitted()['finish-goal']).toHaveLength(1);
	});

	it('passes feedbackSubmitted through to slide 7 to gate the feedback survey', async () => {
		const currentYear = new Date().getFullYear();
		const { queryByText, findByText } = render(GoalInReviewModal, {
			global: globalOptions,
			props: {
				show: true,
				data: { year: currentYear, goalSummary: { status: 'in-progress' } },
				feedbackSubmitted: true,
			},
		});

		await findByText('Thank you!'); // slide 7 rendered
		expect(queryByText('Share your feedback')).toBeNull();
	});

	it('forwards feedback-submitted from slide 7', async () => {
		const currentYear = new Date().getFullYear();
		const { emitted, findByText, getByTestId } = render(GoalInReviewModal, {
			global: globalOptions,
			props: {
				show: true,
				data: { year: currentYear, goalSummary: { status: 'in-progress' } },
			},
		});

		await fireEvent.click(await findByText('Share your feedback'));
		await fireEvent.click(getByTestId('fa-submit'));

		expect(emitted()['feedback-submitted']).toHaveLength(1);
	});

	it('renders the Vishal note (slide 6) only for completed goals', async () => {
		const { queryByText, findByText, rerender } = renderModal();

		// minimal data has no goalSummary.status, so the note is hidden
		expect(queryByText('A personal note')).toBeNull();

		await rerender({ show: true, data: { year: 2026, goalSummary: { status: 'completed' } } });
		await findByText('A personal note');
	});

	it('keeps the Vishal note hidden for an incomplete goal in the next-year state', async () => {
		const lastYear = new Date().getFullYear() - 1;
		const { queryByText, findByText } = render(GoalInReviewModal, {
			global: globalOptions,
			props: { show: true, data: { year: lastYear, goalSummary: { status: 'in-progress' } } },
		});

		await findByText('Thank you!'); // recap is rendered
		expect(queryByText('A personal note')).toBeNull();
	});

	it('emits close when the lightbox closes', async () => {
		const trackEvent = vi.fn();
		const { emitted, getByRole } = renderModal({ trackEvent });

		await fireEvent.click(getByRole('button', { name: 'Close' }));

		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'goal-in-review-close');
		expect(emitted().close).toHaveLength(1);
	});
});

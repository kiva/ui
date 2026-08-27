import { render, fireEvent, waitFor } from '@testing-library/vue';
import GoalInReviewModal from '#src/components/MyKiva/GoalInReview/GoalInReviewModal';
import { globalOptions } from '../../../specUtils';

// Slide 1 fires confetti on mount; canvas-confetti can't run in jsdom, so stub it.
vi.mock('#src/util/animation/confettiUtils', () => ({ showConfetti: vi.fn() }));

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
	KvSimpleMap: {
		name: 'KvSimpleMap',
		props: ['countries'],
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
		template: `<button
			type="button"
			data-testid="fa-submit"
			@click="$emit('fa-form-submitted', { valid: true })"
		>submit</button>`,
	},
	getKivaImageUrl: () => '',
}));

// BorrowerImage (slide 2) reads $appConfig.photoPath.
const globalWithAppConfig = {
	...globalOptions,
	mocks: { ...globalOptions.mocks, $appConfig: { photoPath: '' } },
};

describe('GoalInReviewModal', () => {
	const renderModal = ({ trackEvent = vi.fn() } = {}) => render(GoalInReviewModal, {
		global: {
			...globalWithAppConfig,
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

	it('renders every slide of the recap', async () => {
		const { findByText } = renderModal();

		await findByText('Your 2026 impact goal recap');
		await findByText('The people behind the loans');
		await findByText('Global reach');
		await findByText('Giving insights');
		await findByText(/Goal Setters create something/);
		await findByText('Thank you!');
	});

	it('passes the goal loans and the slide 1 borrower total through to slide 2', async () => {
		const { findByText } = render(GoalInReviewModal, {
			global: globalWithAppConfig,
			props: {
				show: true,
				data: {
					year: 2026,
					loanStats: { borrowers: 48 },
					goalLoans: [{ id: 1, name: 'Aminata', image: { hash: 'hash-1' } }],
				},
			},
		});

		await findByText('Aminata');
		await findByText(/48 borrowers\./);
		await findByText('+47 more');
	});

	it('reconciles the borrower count across slides 1, 2 and 7', async () => {
		const currentYear = new Date().getFullYear();
		const { findByText, getAllByText } = render(GoalInReviewModal, {
			global: globalWithAppConfig,
			props: {
				show: true,
				data: {
					year: currentYear,
					goalSummary: { status: 'completed' },
					loanStats: { totalLent: 1025, borrowers: 14, percentComplete: 100 },
					goalLoans: [{ id: 1, name: 'Aminata', image: { hash: 'hash-1' } }],
				},
			},
		});

		await findByText('Borrowers helped'); // slide 1 stat label
		await findByText(/14 borrowers\./); // slide 2 headline
		await findByText(/14 dreams/); // slide 7 copy
		expect(getAllByText('14').length).toBeGreaterThan(0);
	});

	it('tracks and forwards the slide 7 primary CTA', async () => {
		const trackEvent = vi.fn();
		const currentYear = new Date().getFullYear();
		// in-progress current-year data → primary CTA is "Finish my {year} goal"
		const { emitted, findByText } = render(GoalInReviewModal, {
			global: {
				...globalWithAppConfig,
				provide: { ...globalOptions.provide, $kvTrackEvent: trackEvent },
			},
			props: {
				show: true,
				data: { year: currentYear, goalSummary: { status: 'in-progress' } },
			},
		});

		await fireEvent.click(await findByText(`Finish my ${currentYear} goal`));

		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', `goal-recap-finish-my-${currentYear}-goal`);
		expect(emitted()['finish-goal']).toHaveLength(1);
	});

	it('tracks and forwards the "Back to Kiva" CTA for a completed current-year goal', async () => {
		const trackEvent = vi.fn();
		const currentYear = new Date().getFullYear();
		const { emitted, findByText } = render(GoalInReviewModal, {
			global: {
				...globalOptions,
				provide: { ...globalOptions.provide, $kvTrackEvent: trackEvent },
			},
			props: { show: true, data: { year: currentYear, goalSummary: { status: 'completed' } } },
		});

		await fireEvent.click(await findByText('Back to Kiva'));

		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'goal-recap-back-to-kiva');
		expect(emitted()['goal-recap-back-to-kiva']).toHaveLength(1);
	});

	it('reuses set-a-goal with a from-goal-recap property for the next-year CTA', async () => {
		const trackEvent = vi.fn();
		const currentYear = new Date().getFullYear();
		const { emitted, findByText } = render(GoalInReviewModal, {
			global: {
				...globalOptions,
				provide: { ...globalOptions.provide, $kvTrackEvent: trackEvent },
			},
			// A prior goal year → the recap points forward with "Set my {year} goal".
			props: { show: true, data: { year: currentYear - 1, goalSummary: { status: 'completed' } } },
		});

		await fireEvent.click(await findByText(`Set my ${currentYear} goal`));

		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'set-a-goal', 'from-goal-recap');
		expect(emitted()['set-goal']).toHaveLength(1);
	});

	it('passes feedbackSubmitted through to slide 7 to gate the feedback survey', async () => {
		const currentYear = new Date().getFullYear();
		const { queryByText, findByText } = render(GoalInReviewModal, {
			global: globalWithAppConfig,
			props: {
				show: true,
				data: { year: currentYear, goalSummary: { status: 'in-progress' } },
				feedbackSubmitted: true,
			},
		});

		await findByText('Thank you!'); // slide 7 rendered
		expect(queryByText('Share your feedback')).toBeNull();
	});

	it('tracks and forwards the feedback survey submission', async () => {
		const trackEvent = vi.fn();
		const currentYear = new Date().getFullYear();
		const { emitted, findByText, getByTestId } = render(GoalInReviewModal, {
			global: {
				...globalOptions,
				provide: { ...globalOptions.provide, $kvTrackEvent: trackEvent },
			},
			props: {
				show: true,
				data: { year: currentYear, goalSummary: { status: 'in-progress' } },
			},
		});

		await fireEvent.click(await findByText('Share your feedback'));
		await fireEvent.click(getByTestId('fa-submit'));

		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'submit', 'goal-recap-submit-feedback');
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
			global: globalWithAppConfig,
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

	it('tracks the close event only once even when lightbox-closed fires twice', async () => {
		const trackEvent = vi.fn();
		const { getByRole } = renderModal({ trackEvent });

		// KvLightbox re-emits lightbox-closed when it unmounts, so handleClose runs twice.
		await fireEvent.click(getByRole('button', { name: 'Close' }));
		await fireEvent.click(getByRole('button', { name: 'Close' }));

		const closeCalls = trackEvent.mock.calls.filter(call => call[2] === 'goal-in-review-close');
		expect(closeCalls).toHaveLength(1);
	});

	it('tracks the opening screen (screen-1) view when the modal opens', async () => {
		const trackEvent = vi.fn();
		renderModal({ trackEvent });

		await waitFor(() => {
			expect(trackEvent).toHaveBeenCalledWith('portfolio', 'view', 'goal-in-review', 'screen-1');
		});
	});
});

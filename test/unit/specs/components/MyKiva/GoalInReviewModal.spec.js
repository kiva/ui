import { render, fireEvent, waitFor } from '@testing-library/vue';
import GoalInReviewModal from '#src/components/MyKiva/GoalInReview/GoalInReviewModal';
import { prefersReducedMotion } from '#src/util/animation/motionUtils';
import { globalOptions } from '../../../specUtils';

// Slide 1 fires confetti on mount; canvas-confetti can't run in jsdom, so stub it.
vi.mock('#src/util/animation/confettiUtils', () => ({ showConfetti: vi.fn() }));

// Defaults to false (matching the real SSR-safe default in this test environment) so every
// other test's scroll-to-screen-2 keeps its 'smooth' behavior; only the reduced-motion test
// below overrides it.
vi.mock('#src/util/animation/motionUtils', () => ({ prefersReducedMotion: vi.fn(() => false) }));

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
			preventBackgroundClose: {
				type: Boolean,
				default: false,
			},
			closeButtonShowDelay: {
				type: Number,
				default: 0,
			},
		},
		emits: ['lightbox-closed'],
		// #kvLightboxBody wraps the default slot for real, so the modal's scroll
		// listeners have the same root to attach to in tests as they do at runtime.
		template: `
			<div
				v-if="visible"
				data-testid="goal-in-review-lightbox"
				:data-prevent-background-close="preventBackgroundClose"
				:data-close-button-show-delay="closeButtonShowDelay"
			>
				<slot name="header"></slot>
				<button type="button" @click="$emit('lightbox-closed')">Close</button>
				<div id="kvLightboxBody">
					<slot></slot>
				</div>
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

// The modal creates one IntersectionObserver on open for entrance animations, and a
// second, lazily, for view tracking, once the recap first scrolls. Tests trigger each
// observer's callback directly rather than relying on jsdom to compute intersections.
let observers = [];

class MockIntersectionObserver {
	constructor(callback, options) {
		this.callback = callback;
		this.options = options;
		this.observe = vi.fn();
		this.unobserve = vi.fn();
		this.disconnect = vi.fn();
		observers.push(this);
	}
}

describe('GoalInReviewModal', () => {
	beforeEach(() => {
		observers = [];
		vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
		vi.stubGlobal('IntersectionObserverEntry', { prototype: { intersectionRatio: 0 } });
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

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
		await findByText('The people behind your loans');
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

	it('does not report a close when the next-year CTA tears the recap down (MP-3145)', async () => {
		const trackEvent = vi.fn();
		const currentYear = new Date().getFullYear();
		const { findByText, getByRole } = render(GoalInReviewModal, {
			global: {
				...globalOptions,
				provide: { ...globalOptions.provide, $kvTrackEvent: trackEvent },
			},
			props: { show: true, data: { year: currentYear - 1, goalSummary: { status: 'completed' } } },
		});

		await fireEvent.click(await findByText(`Set my ${currentYear} goal`));
		// The page closes the modal in response, and the lightbox re-emits on teardown.
		await fireEvent.click(getByRole('button', { name: 'Close' }));

		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'set-a-goal', 'from-goal-recap');
		expect(trackEvent.mock.calls.filter(call => call[2] === 'goal-in-review-close')).toHaveLength(0);
	});

	it('does not report a close when Back to Kiva tears the recap down', async () => {
		const trackEvent = vi.fn();
		const currentYear = new Date().getFullYear();
		const { findByText, getByRole } = render(GoalInReviewModal, {
			global: {
				...globalOptions,
				provide: { ...globalOptions.provide, $kvTrackEvent: trackEvent },
			},
			props: { show: true, data: { year: currentYear, goalSummary: { status: 'completed' } } },
		});

		await fireEvent.click(await findByText('Back to Kiva'));
		await fireEvent.click(getByRole('button', { name: 'Close' }));

		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'goal-recap-back-to-kiva');
		expect(trackEvent.mock.calls.filter(call => call[2] === 'goal-in-review-close')).toHaveLength(0);
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

	it('ignores background clicks and delays the close button', async () => {
		const { findByTestId } = renderModal();

		const lightbox = await findByTestId('goal-in-review-lightbox');

		expect(lightbox.dataset.preventBackgroundClose).toBe('true');
		expect(lightbox.dataset.closeButtonShowDelay).toBe('3000');
	});

	// The modal's own view-tracking observer is identified by its rootMargin: some
	// slide components (e.g. GoalInReviewCollectiveImpact) create their own
	// IntersectionObservers too, sharing the modal's reveal margin but not this one.
	const VIEW_ROOT_MARGIN = '0px 0px -50% 0px';
	const findViewObserver = () => observers.find(observer => observer.options.rootMargin === VIEW_ROOT_MARGIN);

	// The modal's reveal observer shares its rootMargin with observers that some slide
	// components create for their own internal reveals, so it's identified by rootMargin
	// AND by observing the slide wrappers themselves.
	const REVEAL_ROOT_MARGIN = '0px 0px -10% 0px';
	const findRevealObserver = () => observers.find(observer => observer.options.rootMargin === REVEAL_ROOT_MARGIN
		&& observer.observe.mock.calls.some(([target]) => target.hasAttribute('data-slide-view')));

	// Slides load separately, so a later slide can lay out while one above it is still
	// empty. Models that: each slide wrapper is 0 height until it's taken out of
	// `unloaded`, and a laid-out wrapper sits right below the laid-out ones above it.
	const mockSlideLayout = (unloaded, rootHeight = 760) => {
		const zeroRect = {
			top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0,
		};
		const SLIDE_HEIGHT = 500;
		const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect')
			.mockImplementation(function mockGetBoundingClientRect() {
				if (this.id === 'kvLightboxBody') {
					return {
						...zeroRect, bottom: rootHeight, height: rootHeight,
					};
				}
				const slideView = this.dataset?.slideView;
				if (!slideView || unloaded.has(slideView)) {
					return zeroRect;
				}
				let top = 0;
				for (let slide = this.previousElementSibling; slide; slide = slide.previousElementSibling) {
					if (!unloaded.has(slide.dataset.slideView)) {
						top += SLIDE_HEIGHT;
					}
				}
				return {
					...zeroRect, top, bottom: top + SLIDE_HEIGHT, height: SLIDE_HEIGHT,
				};
			});
		onTestFinished(() => spy.mockRestore());
	};

	it('re-observes a screen still 0-height on its first notification, revealing it once laid out', async () => {
		vi.stubGlobal('requestAnimationFrame', cb => cb());
		const unloaded = new Set(['2']);
		mockSlideLayout(unloaded);
		const { container, findByText } = renderModal();

		await findByText('The people behind your loans');

		const screen2 = container.querySelector('[data-slide-view="2"]');
		const revealObserver = findRevealObserver();
		expect(revealObserver).toBeDefined();

		// The async slide hasn't laid out yet, so the wrapper is reported at 0 height.
		revealObserver.callback([{ target: screen2, isIntersecting: true, boundingClientRect: { height: 0 } }]);

		expect(revealObserver.unobserve).toHaveBeenCalledWith(screen2);
		expect(revealObserver.observe).toHaveBeenCalledWith(screen2);
		expect(screen2.classList.contains('is-in-view')).toBe(false);

		// Re-observing triggers a fresh notification once the slide has laid out.
		unloaded.clear();
		revealObserver.callback([{ target: screen2, isIntersecting: true, boundingClientRect: { height: 100 } }]);

		expect(screen2.classList.contains('is-in-view')).toBe(true);
	});

	it('only tracks screen-2 as viewed after the recap has scrolled', async () => {
		const trackEvent = vi.fn();
		const { container, findByText } = renderModal({ trackEvent });

		await findByText('The people behind your loans');

		const screen2 = container.querySelector('[data-slide-view="2"]');
		const lightboxBody = container.querySelector('#kvLightboxBody');

		// No view-tracking observer exists yet before any scroll, so a peek at
		// screen 2 can't be counted.
		expect(findViewObserver()).toBeUndefined();
		expect(trackEvent).not.toHaveBeenCalledWith('portfolio', 'view', 'goal-in-review', 'screen-2');

		await fireEvent.scroll(lightboxBody);

		const slideObserver = findViewObserver();
		expect(slideObserver).toBeDefined();

		// A screen already past the midpoint by the time tracking arms still counts.
		slideObserver.callback([{ target: screen2, isIntersecting: true, boundingClientRect: { height: 100 } }]);

		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'view', 'goal-in-review', 'screen-2');
	});

	it('re-observes a 0-height screen for view tracking, counting the view once laid out', async () => {
		vi.stubGlobal('requestAnimationFrame', cb => cb());
		const trackEvent = vi.fn();
		const { container, findByText } = renderModal({ trackEvent });

		await findByText('The people behind your loans');

		const screen2 = container.querySelector('[data-slide-view="2"]');
		const lightboxBody = container.querySelector('#kvLightboxBody');
		await fireEvent.scroll(lightboxBody);

		const slideObserver = findViewObserver();
		expect(slideObserver).toBeDefined();

		// The async slide hasn't laid out yet, so the wrapper is reported at 0 height.
		slideObserver.callback([{ target: screen2, isIntersecting: true, boundingClientRect: { height: 0 } }]);

		expect(slideObserver.unobserve).toHaveBeenCalledWith(screen2);
		expect(slideObserver.observe).toHaveBeenCalledWith(screen2);
		expect(trackEvent).not.toHaveBeenCalledWith('portfolio', 'view', 'goal-in-review', 'screen-2');

		// Re-observing triggers a fresh notification once the slide has laid out.
		slideObserver.callback([{ target: screen2, isIntersecting: true, boundingClientRect: { height: 100 } }]);

		expect(trackEvent).toHaveBeenCalledWith('portfolio', 'view', 'goal-in-review', 'screen-2');
	});

	it('scrolls screen 2 into view when slide 1\'s arrow is clicked', async () => {
		// jsdom has no scrollIntoView, so install a spy and put the original back after.
		const originalScrollIntoView = Element.prototype.scrollIntoView;
		const scrollIntoView = vi.fn();
		Element.prototype.scrollIntoView = scrollIntoView;
		onTestFinished(() => {
			Element.prototype.scrollIntoView = originalScrollIntoView;
		});
		const { container, findByText, getByRole } = renderModal();

		await findByText('The people behind your loans');

		await fireEvent.click(getByRole('button', { name: 'Scroll to the next section' }));

		const screen2 = container.querySelector('[data-slide-view="2"]');
		expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
		expect(scrollIntoView.mock.instances[0]).toBe(screen2);
	});

	it('scrolls screen 2 into view without smooth-scrolling when the visitor prefers reduced motion', async () => {
		const originalScrollIntoView = Element.prototype.scrollIntoView;
		const scrollIntoView = vi.fn();
		Element.prototype.scrollIntoView = scrollIntoView;
		onTestFinished(() => {
			Element.prototype.scrollIntoView = originalScrollIntoView;
		});
		prefersReducedMotion.mockReturnValueOnce(true);
		const { findByText, getByRole } = renderModal();

		await findByText('The people behind your loans');

		await fireEvent.click(getByRole('button', { name: 'Scroll to the next section' }));

		expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
	});

	it('reveals a gated screen that renders inside the visible area even if the observer misses it', async () => {
		// Every slide laid out: screen 1 at the top, screen 2 peeking in below it, and screen 3
		// onward past the bottom of the visible area.
		mockSlideLayout(new Set());

		const { container, findByText } = renderModal();

		await findByText('The people behind your loans');

		const screen2 = container.querySelector('[data-slide-view="2"]');
		const screen3 = container.querySelector('[data-slide-view="3"]');

		// No test code drives the (mocked) IntersectionObserver here, so the reveal has to
		// come from the mount-time fallback alone.
		await waitFor(() => {
			expect(screen2.classList.contains('is-in-view')).toBe(true);
		});
		expect(screen3.classList.contains('is-in-view')).toBe(false);
	});

	it('holds back revealing a screen while a screen above it has not laid out yet', async () => {
		vi.stubGlobal('requestAnimationFrame', cb => cb());
		const unloaded = new Set(['1', '2', '3', '4']);
		mockSlideLayout(unloaded);
		const { container, findByText } = renderModal();

		await findByText('Thank you!');

		const screen5 = container.querySelector('[data-slide-view="5"]');
		const revealObserver = findRevealObserver();

		// Screens 1-4 are still empty, so screen 5 sits at the top and looks in view.
		revealObserver.callback([{ target: screen5, isIntersecting: true, boundingClientRect: { height: 500 } }]);

		expect(screen5.classList.contains('is-in-view')).toBe(false);
		expect(revealObserver.unobserve).toHaveBeenCalledWith(screen5);
		expect(revealObserver.observe).toHaveBeenCalledWith(screen5);

		// Once everything above has laid out, a fresh in-view report reveals it.
		unloaded.clear();
		revealObserver.callback([{ target: screen5, isIntersecting: true, boundingClientRect: { height: 500 } }]);

		expect(screen5.classList.contains('is-in-view')).toBe(true);
	});

	it('does not reveal a screen from the mount-time fallback while a screen above it has not laid out', async () => {
		// Screens 1-2 are laid out, 3-4 are still empty, so 5 stacks right below screen 2,
		// inside a tall visible area, even though it'll end up far below it.
		mockSlideLayout(new Set(['3', '4']), 1600);
		const { container, findByText } = renderModal();

		await findByText('Thank you!');

		const screen2 = container.querySelector('[data-slide-view="2"]');
		await waitFor(() => {
			expect(screen2.classList.contains('is-in-view')).toBe(true);
		});
		expect(container.querySelector('[data-slide-view="5"]').classList.contains('is-in-view')).toBe(false);
	});

	it('shows the bottom scroll fade at the top and hides it while scrolled, reappearing back at the top', async () => {
		const { container, findByText } = renderModal();

		await findByText('The people behind your loans');

		const fade = container.querySelector('[data-testid="goal-in-review-scroll-fade"]');
		const lightboxBody = container.querySelector('#kvLightboxBody');

		expect(fade.classList.contains('tw-opacity-0')).toBe(false);

		lightboxBody.scrollTop = 20;
		await fireEvent.scroll(lightboxBody);
		expect(fade.classList.contains('tw-opacity-0')).toBe(true);

		lightboxBody.scrollTop = 0;
		await fireEvent.scroll(lightboxBody);
		expect(fade.classList.contains('tw-opacity-0')).toBe(false);
	});
});

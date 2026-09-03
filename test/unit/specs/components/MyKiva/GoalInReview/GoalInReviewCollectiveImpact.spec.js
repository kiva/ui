import { render } from '@testing-library/vue';
import GoalInReviewCollectiveImpact from '#src/components/MyKiva/GoalInReview/GoalInReviewCollectiveImpact';
import { globalOptions } from '../../../../specUtils';

const COUNT_UP_DURATION = 2200;

let observers = [];
let frames = [];

class MockIntersectionObserver {
	constructor(callback, options) {
		this.callback = callback;
		this.options = options;
		observers.push(this);
	}

	// eslint-disable-next-line class-methods-use-this
	observe() {}

	// eslint-disable-next-line class-methods-use-this
	unobserve() {}

	// eslint-disable-next-line class-methods-use-this
	disconnect() {}

	scrollIntoView() {
		this.callback([{ isIntersecting: true, target: {} }]);
	}
}

// Runs the queued frames to the end of the count-up.
const finishCountUp = async () => {
	frames.shift()?.(0);
	frames.shift()?.(COUNT_UP_DURATION);
	await Promise.resolve();
};

describe('GoalInReviewCollectiveImpact', () => {
	beforeEach(() => {
		observers = [];
		frames = [];
		vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
		vi.stubGlobal('IntersectionObserverEntry', { prototype: { intersectionRatio: 0 } });
		vi.stubGlobal('requestAnimationFrame', callback => frames.push(callback));
		vi.stubGlobal('cancelAnimationFrame', () => {});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('renders the collective impact copy', () => {
		const { getByText } = render(GoalInReviewCollectiveImpact, { global: globalOptions });

		getByText('Collective impact');
		getByText(/Goal Setters create something/);
		getByText('borrowers');
		getByText('countries');
		getByText('women');
		getByText(/And you were part of it/);
	});

	// The finished numbers used to render before the slide was reached.
	it('keeps the stats out of sight until the slide is scrolled to', () => {
		const { getByText, queryByText } = render(GoalInReviewCollectiveImpact, { global: globalOptions });

		expect(queryByText('400K+')).toBeNull();
		expect(queryByText('95%')).toBeNull();
		// In the layout, not unrendered, so the row does not reflow.
		expect(getByText('0K+').className).toContain('tw-invisible');
	});

	// Header leads at 0s, then 120ms between each card (MP-3178).
	it('cascades the stat cards in behind the header', () => {
		const { getByTestId } = render(GoalInReviewCollectiveImpact, { global: globalOptions });

		const delays = [...getByTestId('goal-in-review-collective-impact-stats').children]
			.map(card => card.style.animationDelay);

		expect(delays).toEqual(['0.12s', '0.24s', '0.36s']);
	});

	// Must match the modal's reveal margin, or the number lags its copy.
	it('starts counting on the same trigger the modal reveals the slide on', () => {
		render(GoalInReviewCollectiveImpact, { global: globalOptions });

		expect(observers[0].options.rootMargin).toBe('0px 0px -10% 0px');
	});

	it('counts up to the stats once the slide comes into view', async () => {
		const { getByText } = render(GoalInReviewCollectiveImpact, { global: globalOptions });

		observers[0].scrollIntoView();
		await finishCountUp();

		getByText('400K+');
		getByText('62');
		getByText('95%');
		expect(getByText('400K+').className).not.toContain('tw-invisible');
	});

	it('shows the stats without animating when IntersectionObserver is unsupported', async () => {
		// What the support check reads: an entry prototype with no intersectionRatio.
		vi.stubGlobal('IntersectionObserverEntry', { prototype: {} });

		const { getByText } = render(GoalInReviewCollectiveImpact, { global: globalOptions });
		await Promise.resolve();

		getByText('400K+');
		getByText('62');
		getByText('95%');
		expect(getByText('400K+').className).not.toContain('tw-invisible');
	});
});

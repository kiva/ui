import { render } from '@testing-library/vue';
import { nextTick } from 'vue';
import GoalInReviewHeadline from '#src/components/MyKiva/GoalInReview/GoalInReviewHeadline';
import Alea from '#src/util/experiment/Alea';
import { globalOptions } from '../../../../specUtils';

// canvas-confetti has no real canvas in jsdom (its rAF loop throws on a null
// context), so stub the util the slide fires on mount.
vi.mock('#src/util/animation/confettiUtils', () => ({ showConfetti: vi.fn() }));

const baseProps = {
	goalStatus: 'completed',
	firstName: 'Alexandra',
	year: 2026,
	amountLent: 1025,
	borrowerCount: 14,
	category: 'women',
	percentComplete: 100,
};

const renderSlide = (props = {}) => render(GoalInReviewHeadline, {
	global: globalOptions,
	props: { ...baseProps, ...props },
});

// Upper half of the slide, inset from the edges: left/top stay within [2, 98] / [4, 50].
const isInUpperHalfBand = (top, left) => top >= 4 && top <= 50
	&& left >= 2 && left <= 98;

describe('GoalInReviewHeadline', () => {
	it('renders the recap pill with the goal year', () => {
		const { getByText } = renderSlide();
		getByText('Your 2026 impact goal recap');
	});

	describe('complete variant', () => {
		it('greets the lender by name', () => {
			const { getByText } = renderSlide({ goalStatus: 'completed' });
			getByText(/You did it,/);
			getByText('Alexandra');
		});

		it('falls back to a generic headline when the name is missing', () => {
			const { getByText, queryByText } = renderSlide({ goalStatus: 'completed', firstName: '' });
			getByText('You did it!');
			expect(queryByText(/You did it,/)).toBeNull();
		});
	});

	describe('in-progress variant', () => {
		it('shows the in-progress headline instead of the complete one', () => {
			const { getByText, queryByText } = renderSlide({ goalStatus: 'in-progress' });
			getByText(/Your goal moved/);
			getByText('lives forward');
			expect(queryByText(/You did it/)).toBeNull();
		});
	});

	describe('stats', () => {
		it('renders all four stats from live data', () => {
			const { getByText } = renderSlide();
			getByText('$1,025');
			getByText('Total lent');
			getByText('14');
			getByText('Borrowers helped');
			getByText('Women');
			getByText('100%');
			getByText('Progress');
		});

		it('uses the singular "Borrower helped" label when the count is 1', () => {
			const { getByText, queryByText } = renderSlide({ borrowerCount: 1 });
			getByText('Borrower helped');
			expect(queryByText('Borrowers helped')).toBeNull();
		});

		it('includes the shorter mobile-only stat labels alongside the desktop labels', () => {
			const { getByText } = renderSlide();
			getByText('Total lent');
			getByText('Borrowers');
			getByText('Your cause');
			getByText('Complete');
		});

		it('renders the total-lent label as a single span, unlike the stats with a mobile/desktop split', () => {
			const { getByTestId } = renderSlide();

			const totalLentLabel = getByTestId('goal-in-review-headline-stat-total-lent')
				.querySelector('.tw-text-caption');
			expect(totalLentLabel.querySelectorAll('span')).toHaveLength(0);
			expect(totalLentLabel.textContent.trim()).toBe('Total lent');

			const borrowersLabel = getByTestId('goal-in-review-headline-stat-borrowers')
				.querySelector('.tw-text-caption');
			expect(borrowersLabel.querySelectorAll('span')).toHaveLength(2);
		});

		it('uses the singular mobile "Borrower" label when the count is 1', () => {
			const { getByText, queryByText } = renderSlide({ borrowerCount: 1 });
			getByText('Borrower');
			expect(queryByText('Borrowers')).toBeNull();
		});

		it('formats large amounts and borrower counts with separators', () => {
			const { getByText } = renderSlide({ amountLent: 12500, borrowerCount: 1200 });
			getByText('$12,500');
			getByText('1,200');
		});

		it('degrades gracefully when stats are missing (no "undefined" in copy)', () => {
			const { container, getAllByText } = renderSlide({
				amountLent: null,
				borrowerCount: null,
				category: '',
				percentComplete: null,
			});
			// all four stat values fall back to an em dash
			expect(getAllByText('—')).toHaveLength(4);
			expect(container.textContent).not.toContain('undefined');
			expect(container.textContent).not.toContain('NaN');
		});
	});

	it('shows the scroll prompt', () => {
		const { getByText } = renderSlide();
		getByText('See what your goal says about you!');
	});

	it('emits scroll-next once when the scroll button is clicked', async () => {
		const { getByRole, emitted } = renderSlide();
		const button = getByRole('button', { name: 'Scroll to the next section' });
		await button.click();
		expect(emitted('scroll-next')).toHaveLength(1);
	});

	it('does not render the header photo row', () => {
		const { queryByTestId, queryByAltText } = renderSlide();
		expect(queryByTestId('goal-in-review-headline-header')).toBeNull();
		expect(queryByAltText('A woman smiling while doing an activity')).toBeNull();
		expect(queryByAltText('A man smiling at the camera')).toBeNull();
		expect(queryByAltText('A woman smiling and looking to the left')).toBeNull();
		expect(queryByAltText('A woman smiling at the camera')).toBeNull();
	});

	describe('decorative stars and dots', () => {
		it('renders 5 stars positioned in the upper half of the slide', async () => {
			const { container } = renderSlide();
			await nextTick();

			const stars = container.querySelectorAll('.headline-star');
			expect(stars).toHaveLength(5);
			stars.forEach(star => {
				const top = parseFloat(star.style.top);
				const left = parseFloat(star.style.left);
				expect(isInUpperHalfBand(top, left)).toBe(true);
			});
		});

		it('renders 8 dots positioned in the upper half of the slide', async () => {
			const { container } = renderSlide();
			await nextTick();

			const dots = container.querySelectorAll('.headline-dot');
			expect(dots).toHaveLength(8);
			dots.forEach(dot => {
				const top = parseFloat(dot.style.top);
				const left = parseFloat(dot.style.left);
				expect(isInUpperHalfBand(top, left)).toBe(true);
			});
		});

		it('leaves the flag rays untouched', async () => {
			const { container } = renderSlide();
			await nextTick();

			expect(container.querySelectorAll('.headline-ray')).toHaveLength(6);
		});

		it('renders the mountain art layer holding the flag rays', () => {
			const { container } = renderSlide();

			const hill = container.querySelector('.headline-hill');
			expect(hill).toBeTruthy();
			expect(hill.getAttribute('aria-hidden')).toBe('true');
			expect(hill.querySelectorAll('.headline-ray')).toHaveLength(6);
		});

		it('sizes every star between 4px and 16px, square', async () => {
			const { container } = renderSlide();
			await nextTick();

			const stars = container.querySelectorAll('.headline-star');
			expect(stars).toHaveLength(5);
			stars.forEach(star => {
				const width = parseFloat(star.style.width);
				const height = parseFloat(star.style.height);
				expect(width).toBeGreaterThanOrEqual(4);
				expect(width).toBeLessThanOrEqual(16);
				expect(height).toBe(width);
			});
		});

		it('sizes every dot between 3px and 6px, square', async () => {
			const { container } = renderSlide();
			await nextTick();

			const dots = container.querySelectorAll('.headline-dot');
			expect(dots).toHaveLength(8);
			dots.forEach(dot => {
				const width = parseFloat(dot.style.width);
				const height = parseFloat(dot.style.height);
				expect(width).toBeGreaterThanOrEqual(3);
				expect(width).toBeLessThanOrEqual(6);
				expect(height).toBe(width);
			});
		});
	});

	describe('decoration count by viewport', () => {
		let originalInnerWidth;

		beforeEach(() => {
			originalInnerWidth = window.innerWidth;
		});

		afterEach(() => {
			Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth });
		});

		it('uses fewer decorations below the md breakpoint', async () => {
			Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });

			const { container } = renderSlide();
			await nextTick();

			expect(container.querySelectorAll('.headline-star')).toHaveLength(3);
			expect(container.querySelectorAll('.headline-dot')).toHaveLength(4);
		});

		it('uses the full decoration count at the md breakpoint and up', async () => {
			Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });

			const { container } = renderSlide();
			await nextTick();

			expect(container.querySelectorAll('.headline-star')).toHaveLength(5);
			expect(container.querySelectorAll('.headline-dot')).toHaveLength(8);
		});

		it('uses the full decoration count exactly at the md breakpoint', async () => {
			// The design system's md breakpoint (734px); isMedium is width >= md.
			Object.defineProperty(window, 'innerWidth', { configurable: true, value: 734 });

			const { container } = renderSlide();
			await nextTick();

			expect(container.querySelectorAll('.headline-star')).toHaveLength(5);
			expect(container.querySelectorAll('.headline-dot')).toHaveLength(8);
		});
	});

	describe('respawn on each twinkle loop', () => {
		const styleSnapshot = el => ({
			top: el.style.top,
			left: el.style.left,
			width: el.style.width,
			height: el.style.height,
			delay: el.style.animationDelay,
		});

		const positional = ({
			top, left, width, height,
		}) => ({
			top, left, width, height,
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		it('moves a star to a new position and size, leaving the other stars unchanged', async () => {
			vi.spyOn(Math, 'random').mockImplementation(Alea(42));

			const { container } = renderSlide();
			await nextTick();

			const stars = container.querySelectorAll('.headline-star');
			const before = [...stars].map(styleSnapshot);

			stars[0].dispatchEvent(new Event('animationiteration'));
			await nextTick();

			const after = [...stars].map(styleSnapshot);

			// The position and size changed...
			expect(positional(after[0])).not.toEqual(positional(before[0]));
			// ...but the delay stays put, since restarting it would jump the animation.
			expect(after[0].delay).toBe(before[0].delay);
			// The other stars are untouched.
			for (let i = 1; i < after.length; i += 1) {
				expect(after[i]).toEqual(before[i]);
			}

			const top = parseFloat(after[0].top);
			const left = parseFloat(after[0].left);
			expect(isInUpperHalfBand(top, left)).toBe(true);
			const width = parseFloat(after[0].width);
			expect(width).toBeGreaterThanOrEqual(4);
			expect(width).toBeLessThanOrEqual(16);
		});

		it('moves a dot to a new position and size, leaving the other dots unchanged', async () => {
			vi.spyOn(Math, 'random').mockImplementation(Alea(7));

			const { container } = renderSlide();
			await nextTick();

			const dots = container.querySelectorAll('.headline-dot');
			const before = [...dots].map(styleSnapshot);

			dots[3].dispatchEvent(new Event('animationiteration'));
			await nextTick();

			const after = [...dots].map(styleSnapshot);

			expect(positional(after[3])).not.toEqual(positional(before[3]));
			expect(after[3].delay).toBe(before[3].delay);
			for (let i = 0; i < after.length; i += 1) {
				if (i !== 3) {
					expect(after[i]).toEqual(before[i]);
				}
			}

			const top = parseFloat(after[3].top);
			const left = parseFloat(after[3].left);
			expect(isInUpperHalfBand(top, left)).toBe(true);
			const width = parseFloat(after[3].width);
			expect(width).toBeGreaterThanOrEqual(3);
			expect(width).toBeLessThanOrEqual(6);
		});
	});

	describe('avoiding the text and the close button', () => {
		const SECTION_WIDTH = 1000;
		const SECTION_HEIGHT = 600;
		// Union of the pill/title/subtext boxes below.
		const TEXT_BLOCK = {
			left: 300, right: 700, top: 100, bottom: 280,
		};
		const PADDING_PX = 12;
		const CLOSE_BUTTON_PX = 72;
		// Rounding the position to 1 decimal place for display can shave a hair off the
		// real margin, so the check gives it a little room rather than testing the exact edge.
		const EPSILON = 0.1;

		const OFFSET_PROPS = ['offsetWidth', 'offsetHeight', 'offsetTop', 'offsetLeft', 'offsetParent'];
		const originalOffsetDescriptors = OFFSET_PROPS.map(
			prop => [prop, Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop)],
		);

		// The true (settled) layout box for each measured element, keyed by how the test can
		// recognize it. This is deliberately independent of any CSS transform an entrance
		// animation may apply, since offsetTop/offsetLeft/offsetWidth/offsetHeight ignore
		// transforms while getBoundingClientRect does not.
		const boxFor = el => {
			if (el?.getAttribute?.('data-testid') === 'goal-in-review-headline') {
				return {
					width: SECTION_WIDTH, height: SECTION_HEIGHT, top: 0, left: 0, insideSection: false,
				};
			}
			if (el?.getAttribute?.('data-testid') === 'goal-in-review-headline-pill') {
				return {
					width: TEXT_BLOCK.right - TEXT_BLOCK.left,
					height: 40,
					top: TEXT_BLOCK.top,
					left: TEXT_BLOCK.left,
					insideSection: true,
				};
			}
			if (el?.classList?.contains('headline-title')) {
				return {
					width: TEXT_BLOCK.right - TEXT_BLOCK.left,
					height: 70,
					top: 150,
					left: TEXT_BLOCK.left,
					insideSection: true,
				};
			}
			if (el?.classList?.contains('headline-subtext')) {
				return {
					width: TEXT_BLOCK.right - TEXT_BLOCK.left,
					height: 50,
					top: 230,
					left: TEXT_BLOCK.left,
					insideSection: true,
				};
			}
			return {
				width: 0, height: 0, top: 0, left: 0, insideSection: false,
			};
		};

		beforeEach(() => {
			Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
				configurable: true,
				get() { return boxFor(this).width; },
			});
			Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
				configurable: true,
				get() { return boxFor(this).height; },
			});
			Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
				configurable: true,
				get() { return boxFor(this).top; },
			});
			Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
				configurable: true,
				get() { return boxFor(this).left; },
			});
			Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
				configurable: true,
				get() {
					return boxFor(this).insideSection
						? this.closest('[data-testid="goal-in-review-headline"]')
						: null;
				},
			});
		});

		afterEach(() => {
			originalOffsetDescriptors.forEach(([prop, descriptor]) => {
				if (descriptor) {
					Object.defineProperty(HTMLElement.prototype, prop, descriptor);
				} else {
					delete HTMLElement.prototype[prop];
				}
			});
		});

		// The text block padded by PADDING_PX on each side, expressed as a percent of the
		// section, with a little room carved out of it for display rounding.
		const isInsideTextExclusion = (top, left) => {
			const leftMin = (((TEXT_BLOCK.left - PADDING_PX) / SECTION_WIDTH) * 100) + EPSILON;
			const leftMax = (((TEXT_BLOCK.right + PADDING_PX) / SECTION_WIDTH) * 100) - EPSILON;
			const topMin = (((TEXT_BLOCK.top - PADDING_PX) / SECTION_HEIGHT) * 100) + EPSILON;
			const topMax = (((TEXT_BLOCK.bottom + PADDING_PX) / SECTION_HEIGHT) * 100) - EPSILON;
			return left >= leftMin && left <= leftMax && top >= topMin && top <= topMax;
		};

		// The close button's top-right corner, as a percent of the section.
		const isInsideCloseButtonCorner = (top, left) => {
			const leftMin = (100 - ((CLOSE_BUTTON_PX / SECTION_WIDTH) * 100)) + EPSILON;
			const topMax = ((CLOSE_BUTTON_PX / SECTION_HEIGHT) * 100) - EPSILON;
			return left >= leftMin && top <= topMax;
		};

		const expectClearOfTextAndCorner = elements => {
			elements.forEach(el => {
				const top = parseFloat(el.style.top);
				const left = parseFloat(el.style.left);
				expect(isInsideTextExclusion(top, left)).toBe(false);
				expect(isInsideCloseButtonCorner(top, left)).toBe(false);
			});
		};

		it('keeps every star and dot clear of the text block and the close button after mount', async () => {
			const { container } = renderSlide();
			await nextTick();

			expectClearOfTextAndCorner(container.querySelectorAll('.headline-star'));
			expectClearOfTextAndCorner(container.querySelectorAll('.headline-dot'));
		});

		it('keeps respawned stars and dots clear of the text block and the close button', async () => {
			const { container } = renderSlide();
			await nextTick();

			const stars = container.querySelectorAll('.headline-star');
			const dots = container.querySelectorAll('.headline-dot');

			stars[0].dispatchEvent(new Event('animationiteration'));
			stars[2].dispatchEvent(new Event('animationiteration'));
			dots[1].dispatchEvent(new Event('animationiteration'));
			dots[5].dispatchEvent(new Event('animationiteration'));
			await nextTick();

			expectClearOfTextAndCorner(container.querySelectorAll('.headline-star'));
			expectClearOfTextAndCorner(container.querySelectorAll('.headline-dot'));
		});

		describe('avoiding the stat card grid on mobile', () => {
			const MOBILE_SECTION_WIDTH = 375;
			const MOBILE_SECTION_HEIGHT = 523;
			// On a narrow mobile viewport the stat card grid starts around 44% down the
			// section, well inside the zone's lower half (top 4-50%).
			const STATS_BOX = {
				top: 233, height: 176, left: 8, width: MOBILE_SECTION_WIDTH - 16,
			};

			const mobileBoxFor = el => {
				if (el?.getAttribute?.('data-testid') === 'goal-in-review-headline') {
					return {
						width: MOBILE_SECTION_WIDTH,
						height: MOBILE_SECTION_HEIGHT,
						top: 0,
						left: 0,
						insideSection: false,
					};
				}
				if (el?.getAttribute?.('data-testid') === 'goal-in-review-headline-stats') {
					return {
						width: STATS_BOX.width,
						height: STATS_BOX.height,
						top: STATS_BOX.top,
						left: STATS_BOX.left,
						insideSection: true,
					};
				}
				return {
					width: 0, height: 0, top: 0, left: 0, insideSection: false,
				};
			};

			beforeEach(() => {
				vi.spyOn(Math, 'random').mockImplementation(Alea(5));
				Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
					configurable: true,
					get() { return mobileBoxFor(this).width; },
				});
				Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
					configurable: true,
					get() { return mobileBoxFor(this).height; },
				});
				Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
					configurable: true,
					get() { return mobileBoxFor(this).top; },
				});
				Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
					configurable: true,
					get() { return mobileBoxFor(this).left; },
				});
				Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
					configurable: true,
					get() {
						return mobileBoxFor(this).insideSection
							? this.closest('[data-testid="goal-in-review-headline"]')
							: null;
					},
				});
			});

			afterEach(() => {
				vi.restoreAllMocks();
			});

			// The stats box padded by PADDING_PX on each side, expressed as a percent of the
			// mobile section, with the same display-rounding allowance as the other checks.
			const isInsideStatsExclusion = (top, left) => {
				const leftMin = (((STATS_BOX.left - PADDING_PX) / MOBILE_SECTION_WIDTH) * 100) + EPSILON;
				const leftMax = (((STATS_BOX.left + STATS_BOX.width + PADDING_PX)
					/ MOBILE_SECTION_WIDTH) * 100) - EPSILON;
				const topMin = (((STATS_BOX.top - PADDING_PX) / MOBILE_SECTION_HEIGHT) * 100) + EPSILON;
				const topMax = (((STATS_BOX.top + STATS_BOX.height + PADDING_PX)
					/ MOBILE_SECTION_HEIGHT) * 100) - EPSILON;
				return left >= leftMin && left <= leftMax && top >= topMin && top <= topMax;
			};

			const expectClearOfStatsCard = elements => {
				elements.forEach(el => {
					const top = parseFloat(el.style.top);
					const left = parseFloat(el.style.left);
					expect(isInsideStatsExclusion(top, left)).toBe(false);
				});
			};

			it('keeps every star and dot clear of the stat card grid after mount', async () => {
				const { container } = renderSlide();
				await nextTick();

				expectClearOfStatsCard(container.querySelectorAll('.headline-star'));
				expectClearOfStatsCard(container.querySelectorAll('.headline-dot'));
			});

			it('keeps respawned stars and dots clear of the stat card grid', async () => {
				const { container } = renderSlide();
				await nextTick();

				const stars = container.querySelectorAll('.headline-star');
				const dots = container.querySelectorAll('.headline-dot');

				stars[0].dispatchEvent(new Event('animationiteration'));
				stars[2].dispatchEvent(new Event('animationiteration'));
				dots[1].dispatchEvent(new Event('animationiteration'));
				dots[5].dispatchEvent(new Event('animationiteration'));
				await nextTick();

				expectClearOfStatsCard(container.querySelectorAll('.headline-star'));
				expectClearOfStatsCard(container.querySelectorAll('.headline-dot'));
			});
		});

		describe('while entrance animations are still mid-transform', () => {
			// Simulates the .kv-fade-up entrance: at mount time the text is still translated
			// down and getBoundingClientRect reports it there, even though the settled layout
			// (what offsetTop/offsetLeft see) never moves.
			const ANIMATION_SHIFT_PX = 30;

			const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

			beforeEach(() => {
				vi.spyOn(Math, 'random').mockImplementation(Alea(1));
				// eslint-disable-next-line func-names
				Element.prototype.getBoundingClientRect = function () {
					if (this.getAttribute?.('data-testid') === 'goal-in-review-headline') {
						return {
							left: 0,
							top: 0,
							right: SECTION_WIDTH,
							bottom: SECTION_HEIGHT,
							width: SECTION_WIDTH,
							height: SECTION_HEIGHT,
						};
					}
					const box = boxFor(this);
					if (box.insideSection) {
						return {
							left: box.left,
							top: box.top + ANIMATION_SHIFT_PX,
							right: box.left + box.width,
							bottom: box.top + box.height + ANIMATION_SHIFT_PX,
							width: box.width,
							height: box.height,
						};
					}
					return {
						left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0,
					};
				};
			});

			afterEach(() => {
				Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
				vi.restoreAllMocks();
			});

			it('keeps decorations clear of the true text box, not the transformed one', async () => {
				const { container } = renderSlide();
				await nextTick();

				expectClearOfTextAndCorner(container.querySelectorAll('.headline-star'));
				expectClearOfTextAndCorner(container.querySelectorAll('.headline-dot'));
			});
		});
	});
});

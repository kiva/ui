import goalInReviewCopy from '#src/util/goalInReviewCopy';

// Avoid pulling the full badge composable (graphql, apollo, etc.) into the test.
vi.mock('#src/composables/useBadgeData', () => ({
	ID_WOMENS_EQUALITY: 'womens-equality',
	ID_SUPPORT_ALL: 'support-all',
}));

// Mirrors the medium-weight <strong> emphasis the copy module wraps values in.
const strong = text => `<strong class="tw-font-medium">${text}</strong>`;

describe('goalInReviewCopy.js', () => {
	describe('getOriginStory', () => {
		it('returns the Jan–Mar variant with the month emphasized and capitalized', () => {
			const { title, content } = goalInReviewCopy.getOriginStory('2025-02-10');
			expect(title).toBe('The spark starters');
			expect(content).toContain(`You began in ${strong('February')}.`);
		});

		it('returns the Apr–Jun variant', () => {
			const { title, content } = goalInReviewCopy.getOriginStory('2025-04-01');
			expect(title).toBe('The bloom chasers');
			expect(content).toContain(`You began in ${strong('April')},`);
		});

		it('returns the Jul–Sep variant', () => {
			const { title, content } = goalInReviewCopy.getOriginStory('2025-09-30');
			expect(title).toBe('The sun chasers');
			expect(content).toContain(`You started in ${strong('September')},`);
		});

		it('returns the Oct–Dec variant', () => {
			const { title, content } = goalInReviewCopy.getOriginStory('2025-12-15');
			expect(title).toBe('The Reflectionist');
			expect(content).toContain(`You started in ${strong('December')},`);
		});

		it('falls back to the first variant with January when the date is missing or invalid', () => {
			expect(goalInReviewCopy.getOriginStory(undefined)).toEqual({
				title: 'The spark starters',
				content: expect.stringContaining(`You began in ${strong('January')}.`),
			});
			expect(goalInReviewCopy.getOriginStory('not-a-date').title).toBe('The spark starters');
		});
	});

	describe('getImpactIdentity', () => {
		it('matches the women’s equality badge id and emphasizes "women entrepreneurs"', () => {
			const { title, content } = goalInReviewCopy.getImpactIdentity('womens-equality');
			expect(title).toBe('Barrier Breaker');
			expect(content).toContain(`support ${strong('women entrepreneurs')},`);
		});

		it('matches the support-all badge id', () => {
			expect(goalInReviewCopy.getImpactIdentity('support-all').title).toBe('Opportunity Spotter');
		});

		it('falls back to the cause advocate for any other category', () => {
			expect(goalInReviewCopy.getImpactIdentity('basic-needs').title).toBe('Cause advocate');
			expect(goalInReviewCopy.getImpactIdentity(undefined).title).toBe('Cause advocate');
		});
	});

	describe('getImpactHabit', () => {
		it('returns the Top X% variant when the percentile meets the threshold', () => {
			const { title } = goalInReviewCopy.getImpactHabit({ lifetimePercentile: 92, transactionSessionCount: 6 });
			expect(title).toBe('Top 92%');
		});

		it('treats the percentile threshold as inclusive', () => {
			expect(goalInReviewCopy.getImpactHabit({ lifetimePercentile: 80 }).title).toBe('Top 80%');
		});

		it('prefers the percentile variant over sessions', () => {
			// A high session count would otherwise be "Kiva champion".
			expect(goalInReviewCopy.getImpactHabit({ lifetimePercentile: 95, transactionSessionCount: 20 }).title)
				.toBe('Top 95%');
		});

		it('falls back to sessions when the percentile is below threshold, null, or absent', () => {
			expect(goalInReviewCopy.getImpactHabit({ lifetimePercentile: 79, transactionSessionCount: 6 }).title)
				.toBe('Kiva champion');
			expect(goalInReviewCopy.getImpactHabit({ lifetimePercentile: null, transactionSessionCount: 6 }).title)
				.toBe('Kiva champion');
			expect(goalInReviewCopy.getImpactHabit({ transactionSessionCount: 6 }).title).toBe('Kiva champion');
		});

		it('returns Kiva champion for 5 or more sessions with the count emphasized', () => {
			const { title, content } = goalInReviewCopy.getImpactHabit({ transactionSessionCount: 6 });
			expect(title).toBe('Kiva champion');
			expect(content).toContain(`You showed up ${strong('6 times')} this year`);
		});

		it('returns Rising Kiva champion for 1–4 sessions', () => {
			const { title, content } = goalInReviewCopy.getImpactHabit({ transactionSessionCount: 4 });
			expect(title).toBe('Rising Kiva champion');
			expect(content).toContain(`You showed up ${strong('4 times')} this year`);
		});

		it('pluralizes correctly for a single session', () => {
			expect(goalInReviewCopy.getImpactHabit({ transactionSessionCount: 1 }).content)
				.toContain(`You showed up ${strong('1 time')} this year`);
		});

		it('defaults to zero sessions when nothing is provided', () => {
			const { title, content } = goalInReviewCopy.getImpactHabit();
			expect(title).toBe('Rising Kiva champion');
			expect(content).toContain(`You showed up ${strong('0 times')} this year`);
		});
	});
});

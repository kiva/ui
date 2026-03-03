import { buildUniversalOrderedSlides } from '#src/util/journeyCardOrderingUtils';

describe('journeyCardOrderingUtils', () => {
	describe('buildUniversalOrderedSlides', () => {
		it('returns goal card first when set or in progress', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: true,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: false,
				/* TODO: Uncomment when implemented
				showFriendReferralCard: false,
				showLendingTeamsCard: false,
				showKivaCard: false,
				*/
			});

			expect(result[0]).toEqual({});
			expect(result.length).toBe(1);
		});

		it('omits goal card when not in progress or set', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [{ badgeKey: 'badge1' }],
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: false,
				/* TODO: Uncomment when implemented
				showFriendReferralCard: false,
				showLendingTeamsCard: false,
				showKivaCard: false,
				*/
			});

			expect(result[0].badgeKey).toBe('badge1');
			expect(result).not.toContainEqual({});
		});

		it('shows all 5 achievement cards (desktop)', () => {
			const achievements = [
				{ badgeKey: 'women', target: 10 },
				{ badgeKey: 'agriculture', target: 20 },
				{ badgeKey: 'education', target: 30 },
				{ badgeKey: 'refugees', target: 40 },
				{ badgeKey: 'climate', target: 50 },
			];

			const result = buildUniversalOrderedSlides({
				achievementSlides: achievements,
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: false,
				/* TODO: Uncomment when implemented
				showFriendReferralCard: false,
				showLendingTeamsCard: false,
				showKivaCard: false,
				*/
			});

			expect(result).toHaveLength(5);
			expect(result[0].badgeKey).toBe('women');
			expect(result[1].badgeKey).toBe('agriculture');
			expect(result[2].badgeKey).toBe('education');
			expect(result[3].badgeKey).toBe('refugees');
			expect(result[4].badgeKey).toBe('climate');
		});

		it('shows only 3 achievement cards via slidesNumber (mobile)', () => {
			const achievements = [
				{ badgeKey: 'women', target: 10 },
				{ badgeKey: 'agriculture', target: 20 },
				{ badgeKey: 'education', target: 30 },
				{ badgeKey: 'refugees', target: 40 },
				{ badgeKey: 'climate', target: 50 },
			];

			const result = buildUniversalOrderedSlides({
				achievementSlides: achievements,
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: false,
				slidesNumber: 3,
			});

			expect(result).toHaveLength(3);
			expect(result[0].badgeKey).toBe('women');
			expect(result[1].badgeKey).toBe('agriculture');
			expect(result[2].badgeKey).toBe('education');
		});

		it('handles empty achievements array', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: true,
				shouldShowEmailMarketingCard: true,
				showLatestLoan: false,
				showSurveyCard: false,
				/* TODO: Uncomment when implemented
				showFriendReferralCard: false,
				showLendingTeamsCard: false,
				showKivaCard: false,
				*/
			});

			expect(result).toEqual([{}, { isEmailUpdates: true }]);
		});
		// Impact activity cards tests (7)
		// Email marketing and latest loan cards tests (3)
		it('shows email marketing card (when user has yet to opt in)', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: true,
				showLatestLoan: false,
				showSurveyCard: false,
			});

			expect(result).toContainEqual({ isEmailUpdates: true });
		});

		it('shows latest loan card (when user declines email marketing)', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: true,
				showSurveyCard: false,
			});

			expect(result).toContainEqual({ isLatestLoan: true });
			expect(result).toHaveLength(1);
		});

		it('shows both email and latest loan cards (when user has yet to opt in and has a recent lent loan)', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: true,
				showLatestLoan: true,
				showSurveyCard: false,
			});

			const emailCards = result.filter(s => s.isEmailUpdates);
			const loanCards = result.filter(s => s.isLatestLoan);
			expect(emailCards).toHaveLength(1);
			expect(loanCards).toHaveLength(1);
		});
		// Survey card tests
		it('includes survey card when showSurveyCard is true', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: true,
				/* TODO: Uncomment when implemented
				showFriendReferralCard: false,
				showLendingTeamsCard: false,
				showKivaCard: false,
				*/
			});

			expect(result).toContainEqual({ isSurveyCard: true });
		});

		/* TODO: Uncomment when implemented

		it('includes referral card when showFriendReferralCard is true', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: false,
				showFriendReferralCard: true,
				showLendingTeamsCard: false,
				showKivaCard: false,
			});

			expect(result).toContainEqual({ isFriendReferralCard: true });
		});

		it('includes lending teams card when showLendingTeamsCard is true', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: false,
				showFriendReferralCard: false,
				showLendingTeamsCard: true,
				showKivaCard: false,
			});

			expect(result).toContainEqual({ isLendingTeamsCard: true });
		});

		it('includes Kiva card when showKivaCard is true', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: false,
				showFriendReferralCard: false,
				showLendingTeamsCard: false,
				showKivaCard: true,
			});

			expect(result).toContainEqual({ isKivaCard: true });
		});
		*/

		// Full sequence tests (2)
		it('respects slidesNumber limit on full mixed sequence', () => {
			const achievements = [
				{ badgeKey: 'education', target: 30 },
				{ badgeKey: 'refugees', target: 40 },
				{ badgeKey: 'climate', target: 50 },
			];

			const result = buildUniversalOrderedSlides({
				achievementSlides: achievements,
				shouldShowGoalCard: true,
				shouldShowEmailMarketingCard: true,
				showLatestLoan: true,
				showSurveyCard: true,
				slidesNumber: 3,
			});

			expect(result).toHaveLength(3);
			expect(result[0]).toEqual({});
			expect(result[1].badgeKey).toBe('education');
			expect(result[2].badgeKey).toBe('refugees');
			// Verify truncation excluded later cards
			expect(result.find(s => s.badgeKey === 'climate')).toBeUndefined();
			expect(result.find(s => s.isEmailUpdates)).toBeUndefined();
			expect(result.find(s => s.isLatestLoan)).toBeUndefined();
		});

		// TODO: Remove placeholder full sequence test when all cards are implemented
		it('builds full sequence in correct order (placeholder test - 8 cards)', () => {
			const achievements = [
				{ badgeKey: 'women', target: 10 },
				{ badgeKey: 'agriculture', target: 20 },
				{ badgeKey: 'education', target: 30 },
				{ badgeKey: 'refugees', target: 40 },
				{ badgeKey: 'climate', target: 50 },
			];

			const result = buildUniversalOrderedSlides({
				achievementSlides: achievements,
				shouldShowGoalCard: true,
				shouldShowEmailMarketingCard: true,
				showLatestLoan: true,
				showSurveyCard: true,
			});

			// Expected order: goal, achievements, email, latest loan, and survey
			expect(result).toHaveLength(9);
			expect(result[0]).toEqual({});
			expect(result[1].badgeKey).toBe('women');
			expect(result[2].badgeKey).toBe('agriculture');
			expect(result[3].badgeKey).toBe('education');
			expect(result[4].badgeKey).toBe('refugees');
			expect(result[5].badgeKey).toBe('climate');
			expect(result[6]).toEqual({ isEmailUpdates: true });
			expect(result[7]).toEqual({ isLatestLoan: true });
			expect(result[8]).toEqual({ isSurveyCard: true });
		});

		/* TODO: Uncomment this final full sequence test when all cards are implemented
		it('builds full sequence in correct order (12 cards)', () => {
			const achievements = [
				{ badgeKey: 'women', target: 10 },
				{ badgeKey: 'agriculture', target: 20 },
				{ badgeKey: 'education', target: 30 },
				{ badgeKey: 'refugees', target: 40 },
				{ badgeKey: 'climate', target: 50 },
			];

			const result = buildUniversalOrderedSlides({
				achievementSlides: achievements,
				shouldShowGoalCard: true,
				shouldShowEmailMarketingCard: true,
				showLatestLoan: true,
				showSurveyCard: true,
				showFriendReferralCard: true,
				showLendingTeamsCard: true,
				showKivaCard: true,
			});

			// Expected order: goal, achievements, email, latest loan, survey, referral, lending teams, kiva card
			expect(result).toHaveLength(12);
			expect(result[0]).toEqual({});
			expect(result[1].badgeKey).toBe('women');
			expect(result[2].badgeKey).toBe('agriculture');
			expect(result[3].badgeKey).toBe('education');
			expect(result[4].badgeKey).toBe('refugees');
			expect(result[5].badgeKey).toBe('climate');
			expect(result[6]).toEqual({ isEmailUpdates: true });
			expect(result[7]).toEqual({ isLatestLoan: true });
			expect(result[8]).toEqual({ isSurveyCard: true });
			expect(result[9]).toEqual({ isFriendReferral: true });
			expect(result[10]).toEqual({ isLendingTeams: true });
			expect(result[11]).toEqual({ isKivaCard: true });
			*/
	});
});

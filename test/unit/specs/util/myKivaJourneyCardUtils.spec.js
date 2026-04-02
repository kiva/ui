import { defaultBadges } from '#src/util/achievementUtils';
import {
	buildAchievementSlides,
	buildUniversalOrderedSlides,
	checkShouldShowEmailMarketing,
	checkShowLatestLoan,
	checkShowSurveyCard,
	filterNonBadgesSlides,
	getTopRowAchievementKeys,
	getTopRowPriorityCards,
	getUrlParamsFromString,
	handlePrimaryCtaClick,
	handleSecondaryCtaClick,
	isLoanAnonymous,
	MYKIVA_INPUT_FORM_KEY,
	PRIORITY_CARD_EMAIL,
	PRIORITY_CARD_GOAL,
	PRIORITY_CARD_LATEST_LOAN,
	PRIORITY_CARD_SURVEY,
	REFER_FRIEND_MODAL_KEY,
	JOURNEY_MODAL_KEY,
} from '#src/util/myKiva/myKivaJourneyCardUtils';
import { getRichTextUiSettingsData } from '#src/util/myKiva/myKivaContentfulUtils';

vi.mock('#src/util/myKiva/myKivaContentfulUtils', () => ({
	getRichTextUiSettingsData: vi.fn(slide => slide?.mockRichTextData || {}),
	getSlidePrimaryCtaText: vi.fn(slide => slide?.mockPrimaryCtaText || 'primary-cta'),
	getSlideSecondaryCtaText: vi.fn(slide => slide?.mockSecondaryCtaText || 'secondary-cta'),
}));

describe('myKivaJourneyCardUtils', () => {
	describe('isLoanAnonymous', () => {
		it('returns true when anonymizationLevel is "full"', () => {
			expect(isLoanAnonymous({ anonymizationLevel: 'full' })).toBe(true);
		});

		it('returns true case-insensitively', () => {
			expect(isLoanAnonymous({ anonymizationLevel: 'Full' })).toBe(true);
			expect(isLoanAnonymous({ anonymizationLevel: 'FULL' })).toBe(true);
		});

		it('returns false for other anonymization levels', () => {
			expect(isLoanAnonymous({ anonymizationLevel: 'partial' })).toBe(false);
			expect(isLoanAnonymous({ anonymizationLevel: 'none' })).toBe(false);
		});

		it('returns false for null or undefined loan', () => {
			expect(isLoanAnonymous(null)).toBe(false);
			expect(isLoanAnonymous(undefined)).toBe(false);
		});

		it('returns false when anonymizationLevel is missing', () => {
			expect(isLoanAnonymous({})).toBe(false);
		});
	});

	describe('checkShouldShowEmailMarketing', () => {
		it('returns true when all conditions are met', () => {
			expect(checkShouldShowEmailMarketing({
				showPostLendingNextStepsCards: true,
				latestLoan: { id: 1 },
				hasMailUpdatesOptOut: true,
				loansCount: 1,
			})).toBe(true);
		});

		it('returns false when showPostLendingNextStepsCards is false', () => {
			expect(checkShouldShowEmailMarketing({
				showPostLendingNextStepsCards: false,
				latestLoan: { id: 1 },
				hasMailUpdatesOptOut: true,
				loansCount: 1,
			})).toBe(false);
		});

		it('returns false when loan is anonymous', () => {
			expect(checkShouldShowEmailMarketing({
				showPostLendingNextStepsCards: true,
				latestLoan: { id: 1, anonymizationLevel: 'full' },
				hasMailUpdatesOptOut: true,
				loansCount: 1,
			})).toBe(false);
		});

		it('returns false when user has explicitly opted in (not opted out)', () => {
			expect(checkShouldShowEmailMarketing({
				showPostLendingNextStepsCards: true,
				latestLoan: { id: 1 },
				hasMailUpdatesOptOut: false,
				loansCount: 1,
			})).toBe(false);
		});

		it('returns true when user has no email preference (null)', () => {
			expect(checkShouldShowEmailMarketing({
				showPostLendingNextStepsCards: true,
				latestLoan: { id: 1 },
				hasMailUpdatesOptOut: null,
				loansCount: 1,
			})).toBe(true);
		});

		it('returns false when no loans and no latest loan', () => {
			expect(checkShouldShowEmailMarketing({
				showPostLendingNextStepsCards: true,
				latestLoan: null,
				hasMailUpdatesOptOut: true,
				loansCount: 0,
			})).toBe(false);
		});

		it('returns true when loansCount is 0 but latestLoan exists', () => {
			expect(checkShouldShowEmailMarketing({
				showPostLendingNextStepsCards: true,
				latestLoan: { id: 1 },
				hasMailUpdatesOptOut: true,
				loansCount: 0,
			})).toBe(true);
		});
	});

	describe('checkShowLatestLoan', () => {
		it('returns true when post-lending is active and loan exists', () => {
			expect(checkShowLatestLoan({
				showPostLendingNextStepsCards: true,
				latestLoan: { id: 1 },
			})).toBe(true);
		});

		it('returns false when showPostLendingNextStepsCards is false', () => {
			expect(checkShowLatestLoan({
				showPostLendingNextStepsCards: false,
				latestLoan: { id: 1 },
			})).toBe(false);
		});

		it('returns false when latestLoan is null', () => {
			expect(checkShowLatestLoan({
				showPostLendingNextStepsCards: true,
				latestLoan: null,
			})).toBe(false);
		});

		it('returns false when loan is anonymous', () => {
			expect(checkShowLatestLoan({
				showPostLendingNextStepsCards: true,
				latestLoan: { id: 1, anonymizationLevel: 'full' },
			})).toBe(false);
		});
	});

	describe('checkShowSurveyCard', () => {
		it('returns true when post-lending is active and form not submitted', () => {
			expect(checkShowSurveyCard({
				showPostLendingNextStepsCards: true,
				userInfo: { userPreferences: { preferences: '{}' } },
			})).toBe(true);
		});

		it('returns false when showPostLendingNextStepsCards is false', () => {
			expect(checkShowSurveyCard({
				showPostLendingNextStepsCards: false,
				userInfo: { userPreferences: { preferences: '{}' } },
			})).toBe(false);
		});

		it('returns false when form has been submitted', () => {
			const prefs = JSON.stringify({
				savedForms: [{ formName: MYKIVA_INPUT_FORM_KEY }],
			});
			expect(checkShowSurveyCard({
				showPostLendingNextStepsCards: true,
				userInfo: { userPreferences: { preferences: prefs } },
			})).toBe(false);
		});

		it('returns true when savedForms exists but does not contain the form', () => {
			const prefs = JSON.stringify({
				savedForms: [{ formName: 'other-form' }],
			});
			expect(checkShowSurveyCard({
				showPostLendingNextStepsCards: true,
				userInfo: { userPreferences: { preferences: prefs } },
			})).toBe(true);
		});

		it('handles missing userPreferences gracefully', () => {
			expect(checkShowSurveyCard({
				showPostLendingNextStepsCards: true,
				userInfo: {},
			})).toBe(true);
		});
	});

	describe('filterNonBadgesSlides', () => {
		it('returns only non-badge slides', () => {
			const slides = [
				{ mockRichTextData: { achievementKey: 'womens-equality' } },
				{ mockRichTextData: { achievementKey: 'invite-friends' } },
				{ mockRichTextData: {} },
			];
			const result = filterNonBadgesSlides(slides);
			expect(result).toHaveLength(2);
		});

		it('returns empty array when all slides are badges', () => {
			const slides = defaultBadges.map(key => ({
				mockRichTextData: { achievementKey: key },
			}));
			const result = filterNonBadgesSlides(slides);
			expect(result).toEqual([]);
		});

		it('returns empty array for null input', () => {
			expect(filterNonBadgesSlides(null)).toEqual([]);
		});

		it('returns empty array for undefined input', () => {
			expect(filterNonBadgesSlides(undefined)).toEqual([]);
		});

		it('returns empty array for empty array', () => {
			expect(filterNonBadgesSlides([])).toEqual([]);
		});
	});

	describe('getTopRowPriorityCards', () => {
		const baseParams = {
			showRegionExperienceInFirstRow: false,
			showPostLendingNextStepsCards: true,
			hideCompletedGoalCard: false,
			shouldShowEmailMarketingCard: false,
			showLatestLoan: false,
			showSurveyCard: false,
		};

		it('returns empty set when region experience is in first row', () => {
			const result = getTopRowPriorityCards({
				...baseParams,
				showRegionExperienceInFirstRow: true,
			});
			expect(result.size).toBe(0);
		});

		it('returns empty set when post-lending cards are not active', () => {
			const result = getTopRowPriorityCards({
				...baseParams,
				showPostLendingNextStepsCards: false,
			});
			expect(result.size).toBe(0);
		});

		it('includes goal when goal card is visible', () => {
			const result = getTopRowPriorityCards({
				...baseParams,
				hideCompletedGoalCard: false,
			});
			expect(result.has(PRIORITY_CARD_GOAL)).toBe(true);
		});

		it('excludes goal when goal card is hidden', () => {
			const result = getTopRowPriorityCards({
				...baseParams,
				hideCompletedGoalCard: true,
			});
			expect(result.has(PRIORITY_CARD_GOAL)).toBe(false);
		});

		it('includes email when email marketing card is visible', () => {
			const result = getTopRowPriorityCards({
				...baseParams,
				shouldShowEmailMarketingCard: true,
			});
			expect(result.has(PRIORITY_CARD_EMAIL)).toBe(true);
			expect(result.has(PRIORITY_CARD_LATEST_LOAN)).toBe(false);
		});

		it('includes latestLoan instead of email when email is not shown', () => {
			const result = getTopRowPriorityCards({
				...baseParams,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: true,
			});
			expect(result.has(PRIORITY_CARD_EMAIL)).toBe(false);
			expect(result.has(PRIORITY_CARD_LATEST_LOAN)).toBe(true);
		});

		it('includes both email and latestLoan when both are visible', () => {
			const result = getTopRowPriorityCards({
				...baseParams,
				shouldShowEmailMarketingCard: true,
				showLatestLoan: true,
			});
			expect(result.has(PRIORITY_CARD_EMAIL)).toBe(true);
			expect(result.has(PRIORITY_CARD_LATEST_LOAN)).toBe(true);
		});

		it('includes survey when goal card is hidden', () => {
			const result = getTopRowPriorityCards({
				...baseParams,
				hideCompletedGoalCard: true,
				showSurveyCard: true,
			});
			expect(result.has(PRIORITY_CARD_SURVEY)).toBe(true);
		});

		it('includes survey when email marketing is not shown', () => {
			const result = getTopRowPriorityCards({
				...baseParams,
				shouldShowEmailMarketingCard: false,
				showSurveyCard: true,
			});
			expect(result.has(PRIORITY_CARD_SURVEY)).toBe(true);
		});

		it('excludes survey when both goal and email are visible', () => {
			const result = getTopRowPriorityCards({
				...baseParams,
				hideCompletedGoalCard: false,
				shouldShowEmailMarketingCard: true,
				showSurveyCard: true,
			});
			expect(result.has(PRIORITY_CARD_SURVEY)).toBe(false);
		});

		it('limits to 3 slots maximum', () => {
			const result = getTopRowPriorityCards({
				...baseParams,
				hideCompletedGoalCard: false,
				shouldShowEmailMarketingCard: true,
				showLatestLoan: true,
				showSurveyCard: true,
			});
			// goal + email + latestLoan = 3; survey is excluded by the slice
			expect(result.size).toBe(3);
			expect(result.has(PRIORITY_CARD_GOAL)).toBe(true);
			expect(result.has(PRIORITY_CARD_EMAIL)).toBe(true);
			expect(result.has(PRIORITY_CARD_LATEST_LOAN)).toBe(true);
			expect(result.has(PRIORITY_CARD_SURVEY)).toBe(false);
		});
	});

	describe('getTopRowAchievementKeys', () => {
		it('returns empty set when region experience is in first row', () => {
			const result = getTopRowAchievementKeys({
				showRegionExperienceInFirstRow: true,
				showPostLendingNextStepsCards: false,
				hideCompletedGoalCard: false,
				topRowPriorityCards: new Set(),
				sortedAchievementSlides: [{ badgeKey: 'a' }],
			});
			expect(result.size).toBe(0);
		});

		it('fills all 3 slots with achievements when no goal and no priority cards (pre-lending superlender)', () => {
			const result = getTopRowAchievementKeys({
				showRegionExperienceInFirstRow: false,
				showPostLendingNextStepsCards: false,
				hideCompletedGoalCard: true,
				topRowPriorityCards: new Set(),
				sortedAchievementSlides: [
					{ badgeKey: 'a' }, { badgeKey: 'b' }, { badgeKey: 'c' }, { badgeKey: 'd' },
				],
			});
			expect(result.size).toBe(3);
			expect(result.has('a')).toBe(true);
			expect(result.has('b')).toBe(true);
			expect(result.has('c')).toBe(true);
			expect(result.has('d')).toBe(false);
		});

		it('reserves 1 slot for goal card in pre-lending mode', () => {
			const result = getTopRowAchievementKeys({
				showRegionExperienceInFirstRow: false,
				showPostLendingNextStepsCards: false,
				hideCompletedGoalCard: false,
				topRowPriorityCards: new Set(),
				sortedAchievementSlides: [
					{ badgeKey: 'a' }, { badgeKey: 'b' }, { badgeKey: 'c' },
				],
			});
			// 3 total - 1 goal = 2 achievement slots
			expect(result.size).toBe(2);
			expect(result.has('a')).toBe(true);
			expect(result.has('b')).toBe(true);
		});

		it('subtracts priority cards from available achievement slots (post-lending)', () => {
			const result = getTopRowAchievementKeys({
				showRegionExperienceInFirstRow: false,
				showPostLendingNextStepsCards: true,
				hideCompletedGoalCard: false,
				topRowPriorityCards: new Set([PRIORITY_CARD_GOAL, PRIORITY_CARD_EMAIL]),
				sortedAchievementSlides: [
					{ badgeKey: 'a' }, { badgeKey: 'b' }, { badgeKey: 'c' },
				],
			});
			// 3 total - 0 goalSlot (post-lending) - 2 priority = 1 achievement slot
			expect(result.size).toBe(1);
			expect(result.has('a')).toBe(true);
		});

		it('returns empty set when priority cards fill all slots', () => {
			const result = getTopRowAchievementKeys({
				showRegionExperienceInFirstRow: false,
				showPostLendingNextStepsCards: true,
				hideCompletedGoalCard: false,
				topRowPriorityCards: new Set([PRIORITY_CARD_GOAL, PRIORITY_CARD_EMAIL, PRIORITY_CARD_LATEST_LOAN]),
				sortedAchievementSlides: [{ badgeKey: 'a' }],
			});
			expect(result.size).toBe(0);
		});

		it('handles empty sortedAchievementSlides', () => {
			const result = getTopRowAchievementKeys({
				showRegionExperienceInFirstRow: false,
				showPostLendingNextStepsCards: false,
				hideCompletedGoalCard: true,
				topRowPriorityCards: new Set(),
				sortedAchievementSlides: [],
			});
			expect(result.size).toBe(0);
		});
	});

	describe('getUrlParamsFromString', () => {
		it('returns undefined when no query params', () => {
			expect(getUrlParamsFromString('/some/path')).toBeUndefined();
		});

		it('extracts query params from URL', () => {
			expect(getUrlParamsFromString('/path?foo=bar')).toBe('foo=bar');
			expect(getUrlParamsFromString('/path?refer-friend=true')).toBe('refer-friend=true');
		});
	});

	describe('handlePrimaryCtaClick', () => {
		it('tracks event and navigates to URL', () => {
			const trackEvent = vi.fn();
			const navigate = vi.fn();
			const slide = {
				mockRichTextData: { primaryCtaUrl: '/lend', achievementKey: 'women' },
				mockPrimaryCtaText: 'Lend now',
			};

			handlePrimaryCtaClick({ slide, trackEvent, navigate });

			expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'primary-cta-Lend now', 'women');
			expect(navigate).toHaveBeenCalledWith('/lend');
		});

		it('opens sharing modal when refer-friend param is true', () => {
			const trackEvent = vi.fn();
			const navigate = vi.fn();
			const openSharingModal = vi.fn();
			const slide = {
				mockRichTextData: {
					primaryCtaUrl: `/invite?${REFER_FRIEND_MODAL_KEY}=true`,
					achievementKey: 'referral',
				},
			};

			handlePrimaryCtaClick({
				slide,
				trackEvent,
				navigate,
				modalHandlers: { openSharingModal },
			});

			expect(openSharingModal).toHaveBeenCalled();
			expect(navigate).not.toHaveBeenCalled();
		});

		it('navigates normally when refer-friend handler not provided', () => {
			const trackEvent = vi.fn();
			const navigate = vi.fn();
			const slide = {
				mockRichTextData: {
					primaryCtaUrl: `/invite?${REFER_FRIEND_MODAL_KEY}=true`,
					achievementKey: 'referral',
				},
			};

			handlePrimaryCtaClick({ slide, trackEvent, navigate });

			expect(navigate).toHaveBeenCalledWith(`/invite?${REFER_FRIEND_MODAL_KEY}=true`);
		});
	});

	describe('handleSecondaryCtaClick', () => {
		it('tracks event and navigates to URL', () => {
			const trackEvent = vi.fn();
			const navigate = vi.fn();
			const slide = {
				mockRichTextData: { secondaryCtaUrl: '/learn-more', achievementKey: 'climate' },
				mockSecondaryCtaText: 'Learn more',
			};

			handleSecondaryCtaClick({ slide, trackEvent, navigate });

			expect(trackEvent).toHaveBeenCalledWith('portfolio', 'click', 'secondary-cta-Learn more', 'climate');
			expect(navigate).toHaveBeenCalledWith('/learn-more');
		});

		it('calls updateJourney when journey param present', () => {
			const trackEvent = vi.fn();
			const navigate = vi.fn();
			const updateJourney = vi.fn();
			const slide = {
				mockRichTextData: {
					secondaryCtaUrl: `/badges?${JOURNEY_MODAL_KEY}=open`,
					achievementKey: 'women',
				},
			};

			handleSecondaryCtaClick({
				slide,
				trackEvent,
				navigate,
				modalHandlers: { updateJourney },
			});

			expect(updateJourney).toHaveBeenCalledWith('women');
			expect(navigate).not.toHaveBeenCalled();
		});

		it('navigates normally when journey handler not provided', () => {
			const trackEvent = vi.fn();
			const navigate = vi.fn();
			const slide = {
				mockRichTextData: {
					secondaryCtaUrl: `/badges?${JOURNEY_MODAL_KEY}=open`,
					achievementKey: 'women',
				},
			};

			handleSecondaryCtaClick({ slide, trackEvent, navigate });

			expect(navigate).toHaveBeenCalledWith(`/badges?${JOURNEY_MODAL_KEY}=open`);
		});
	});

	describe('buildUniversalOrderedSlides', () => {
		it('returns goal card first when set or in progress', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: true,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: false,
				nonBadgesSlides: [],
			});

			expect(result[0]).toEqual({ isGoalCard: true });
			expect(result.length).toBe(1);
		});

		it('omits goal card when not in progress or set', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [{ badgeKey: 'badge1' }],
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: false,
				nonBadgesSlides: [],
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
				nonBadgesSlides: [],
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
				nonBadgesSlides: [],
			});

			expect(result).toEqual([{ isGoalCard: true }, { isEmailUpdates: true }]);
		});

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

		it('includes survey card when showSurveyCard is true', () => {
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: true,
				nonBadgesSlides: [],
			});

			expect(result).toContainEqual({ isSurveyCard: true });
		});

		it('includes three non-badges slides', () => {
			const nonBadges = [
				{ title: 'Invite a friend to Kiva', ctaText: 'Invite a friend' },
				{ title: 'Lend together', ctaText: 'Explore lending teams' },
				{ title: 'Send a Kiva Card to give a gift that keeps on giving', ctaText: 'Send a kiva card' }
			];
			const result = buildUniversalOrderedSlides({
				achievementSlides: [],
				shouldShowGoalCard: false,
				shouldShowEmailMarketingCard: false,
				showLatestLoan: false,
				showSurveyCard: false,
				nonBadgesSlides: nonBadges,
			});

			expect(result).toHaveLength(3);
			expect(result[0]).toEqual({ title: 'Invite a friend to Kiva', ctaText: 'Invite a friend' });
			expect(result[1]).toEqual({ title: 'Lend together', ctaText: 'Explore lending teams' });
			// eslint-disable-next-line max-len
			expect(result[2]).toEqual({ title: 'Send a Kiva Card to give a gift that keeps on giving', ctaText: 'Send a kiva card' });
		});

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
				slidesNumber: 3,
			});

			expect(result).toHaveLength(3);
			expect(result[0]).toEqual({ isGoalCard: true });
			expect(result[1].badgeKey).toBe('education');
			expect(result[2].badgeKey).toBe('refugees');
			expect(result.find(s => s.badgeKey === 'climate')).toBeUndefined();
			expect(result.find(s => s.isEmailUpdates)).toBeUndefined();
			expect(result.find(s => s.isLatestLoan)).toBeUndefined();
		});

		it('builds full sequence in correct order', () => {
			const achievements = [
				{ badgeKey: 'women', target: 10 },
				{ badgeKey: 'agriculture', target: 20 },
				{ badgeKey: 'education', target: 30 },
				{ badgeKey: 'refugees', target: 40 },
				{ badgeKey: 'climate', target: 50 },
			];

			const nonBadges = [
				{ title: 'Invite a friend to Kiva', ctaText: 'Invite a friend' },
				{ title: 'Lend together', ctaText: 'Explore lending teams' },
				{ title: 'Send a Kiva Card to give a gift that keeps on giving', ctaText: 'Send a kiva card' }
			];

			const result = buildUniversalOrderedSlides({
				achievementSlides: achievements,
				shouldShowGoalCard: true,
				shouldShowEmailMarketingCard: true,
				showLatestLoan: true,
				showSurveyCard: true,
				nonBadgesSlides: nonBadges,
			});

			// Expected order: goal, achievements, email, latest loan, survey, non-badges
			expect(result).toHaveLength(12);
			expect(result[0]).toEqual({ isGoalCard: true });
			expect(result[1].badgeKey).toBe('women');
			expect(result[2].badgeKey).toBe('agriculture');
			expect(result[3].badgeKey).toBe('education');
			expect(result[4].badgeKey).toBe('refugees');
			expect(result[5].badgeKey).toBe('climate');
			expect(result[6]).toEqual({ isEmailUpdates: true });
			expect(result[7]).toEqual({ isLatestLoan: true });
			expect(result[8]).toEqual({ isSurveyCard: true });
			expect(result[9]).toEqual({ title: 'Invite a friend to Kiva', ctaText: 'Invite a friend' });
			expect(result[10]).toEqual({ title: 'Lend together', ctaText: 'Explore lending teams' });
			// eslint-disable-next-line max-len
			expect(result[11]).toEqual({ title: 'Send a Kiva Card to give a gift that keeps on giving', ctaText: 'Send a kiva card' });
		});
	});

	describe('buildAchievementSlides', () => {
		const buildSlide = (achievementKey, extraData = {}) => ({
			fields: {
				richText: {
					content: [
						{
							data: {
								target: {
									sys: { contentType: { sys: { id: 'uiSetting' } } },
									fields: { dataObject: { achievementKey, ...extraData } },
								},
							},
						},
					],
				},
			},
		});

		const mockSlides = defaultBadges.map(key => buildSlide(key));
		const mockBadgesData = defaultBadges.map(key => ({
			id: key,
			achievementData: { totalProgressToAchievement: 2 },
			contentfulData: [{ level: 1, imageUrl: `http://example.com/${key}.png` }],
		}));

		const isTieredAchievementComplete = () => false;
		const getActiveTierData = () => ({ target: 5, level: 1 });

		beforeEach(() => {
			vi.mocked(getRichTextUiSettingsData).mockImplementation(
				slide => slide?.fields?.richText?.content?.[0]?.data?.target?.fields?.dataObject || {}
			);
		});

		it('returns slides for all matching badges', () => {
			const result = buildAchievementSlides({
				badgesData: mockBadgesData,
				slides: mockSlides,
				isTieredAchievementComplete,
				getActiveTierData,
			});
			expect(result.length).toBe(defaultBadges.length);
		});

		it('each slide contains target, totalProgressToAchievement, badgeImgUrl, badgeKey', () => {
			const result = buildAchievementSlides({
				badgesData: mockBadgesData,
				slides: mockSlides,
				isTieredAchievementComplete,
				getActiveTierData,
			});
			result.forEach(slide => {
				expect(slide.target).toBe(5);
				expect(slide.totalProgressToAchievement).toBe(2);
				expect(slide.badgeImgUrl).toBeDefined();
				expect(slide.badgeKey).toBeDefined();
			});
		});

		it('excludes completed achievements', () => {
			const result = buildAchievementSlides({
				badgesData: mockBadgesData,
				slides: mockSlides,
				isTieredAchievementComplete: () => true,
				getActiveTierData,
			});
			expect(result.length).toBe(0);
		});

		it('excludes badges with no tier target', () => {
			const result = buildAchievementSlides({
				badgesData: mockBadgesData,
				slides: mockSlides,
				isTieredAchievementComplete,
				getActiveTierData: () => ({ target: null, level: 1 }),
			});
			expect(result.length).toBe(0);
		});

		it('includes milestoneDiff when includeMilestoneDiff is true', () => {
			const result = buildAchievementSlides({
				badgesData: mockBadgesData,
				slides: mockSlides,
				includeMilestoneDiff: true,
				isTieredAchievementComplete,
				getActiveTierData,
			});
			result.forEach(slide => {
				expect(slide.milestoneDiff).toBe(3); // 5 - 2
			});
		});

		it('does not include milestoneDiff by default', () => {
			const result = buildAchievementSlides({
				badgesData: mockBadgesData,
				slides: mockSlides,
				isTieredAchievementComplete,
				getActiveTierData,
			});
			result.forEach(slide => {
				expect(slide.milestoneDiff).toBeUndefined();
			});
		});

		it('sorts by milestoneDiff when sortByMilestoneDiff is true', () => {
			const customBadgesData = [
				{
					id: 'womens-equality',
					achievementData: { totalProgressToAchievement: 1 },
					contentfulData: [{ level: 1, imageUrl: 'url1' }],
				},
				{
					id: 'climate-action',
					achievementData: { totalProgressToAchievement: 4 },
					contentfulData: [{ level: 1, imageUrl: 'url2' }],
				},
				{
					id: 'basic-needs',
					achievementData: { totalProgressToAchievement: 3 },
					contentfulData: [{ level: 1, imageUrl: 'url3' }],
				},
			];
			const customSlides = ['womens-equality', 'climate-action', 'basic-needs']
				.map(key => buildSlide(key));

			const result = buildAchievementSlides({
				badgesData: customBadgesData,
				slides: customSlides,
				includeMilestoneDiff: true,
				sortByMilestoneDiff: true,
				isTieredAchievementComplete,
				getActiveTierData,
			});

			// milestoneDiff: womens-equality=4, basic-needs=2, climate-action=1
			expect(result[0].badgeKey).toBe('climate-action');
			expect(result[1].badgeKey).toBe('basic-needs');
			expect(result[2].badgeKey).toBe('womens-equality');
		});

		it('returns empty array when badgesData is empty', () => {
			const result = buildAchievementSlides({
				badgesData: [],
				slides: mockSlides,
				isTieredAchievementComplete,
				getActiveTierData,
			});
			expect(result).toEqual([]);
		});

		it('returns empty array when slides is empty', () => {
			const result = buildAchievementSlides({
				badgesData: mockBadgesData,
				slides: [],
				isTieredAchievementComplete,
				getActiveTierData,
			});
			expect(result).toEqual([]);
		});
	});
});

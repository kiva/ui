import { defaultBadges } from '#src/util/achievementUtils';
import {
	buildAchievementSlides,
	buildUniversalOrderedSlides,
	getUrlParamsFromString,
	handlePrimaryCtaClick,
	handleSecondaryCtaClick,
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

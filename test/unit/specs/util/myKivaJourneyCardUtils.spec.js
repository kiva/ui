import { defaultBadges } from '#src/util/achievementUtils';
import {
	buildAchievementSlides,
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

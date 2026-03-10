import {
	getRichTextContent,
	getRichTextUiSettingsData,
	getSlideTitle,
	getSlideSubTitle,
	getSlidePrimaryCtaText,
	getSlidePrimaryCtaVariant,
	getSlideSecondaryCtaText,
	isSlideTitleFontSans,
	getSlideTitleColor,
	getSlideMediaImgUrl,
	getSlideBackgroundImg,
} from '#src/util/myKiva/myKivaContentfulUtils';

const buildSlide = (dataObject = {}, extraContent = []) => ({
	fields: {
		richText: {
			content: [
				{
					data: {
						target: {
							sys: { contentType: { sys: { id: 'uiSetting' } } },
							fields: { dataObject },
						},
					},
				},
				...extraContent,
			],
		},
	},
});

describe('myKivaContentfulUtils.js', () => {
	describe('getRichTextContent', () => {
		it('returns content array from slide', () => {
			const slide = { fields: { richText: { content: [{ nodeType: 'paragraph' }] } } };
			expect(getRichTextContent(slide)).toEqual([{ nodeType: 'paragraph' }]);
		});

		it('returns empty array for null/undefined slide', () => {
			expect(getRichTextContent(null)).toEqual([]);
			expect(getRichTextContent(undefined)).toEqual([]);
			expect(getRichTextContent({})).toEqual([]);
		});

		it('returns empty array when richText is missing', () => {
			expect(getRichTextContent({ fields: {} })).toEqual([]);
		});
	});

	describe('getRichTextUiSettingsData', () => {
		it('extracts dataObject from uiSetting', () => {
			const slide = buildSlide({ title: 'Test Title', primaryCtaText: 'Lend now' });
			const result = getRichTextUiSettingsData(slide);
			expect(result.title).toBe('Test Title');
			expect(result.primaryCtaText).toBe('Lend now');
		});

		it('returns empty object when no uiSetting is present', () => {
			const slide = { fields: { richText: { content: [{ data: {} }] } } };
			expect(getRichTextUiSettingsData(slide)).toEqual({});
		});

		it('returns empty object for null slide', () => {
			expect(getRichTextUiSettingsData(null)).toEqual({});
		});
	});

	describe('getSlideTitle', () => {
		it('returns progress title when totalProgressToAchievement is set', () => {
			const slide = { totalProgressToAchievement: 2, target: 5 };
			expect(getSlideTitle(slide)).toBe('Your progress: 2/5 loans');
		});

		it('returns title from uiSettings when no progress', () => {
			const slide = buildSlide({ title: 'Climate Action' });
			expect(getSlideTitle(slide)).toBe('Climate Action');
		});

		it('returns empty string when no title and no progress', () => {
			const slide = buildSlide({});
			expect(getSlideTitle(slide)).toBe('');
		});
	});

	describe('getSlideSubTitle', () => {
		it('returns contentText for non-badge slides', () => {
			const slide = buildSlide({ contentText: 'Some content text' });
			expect(getSlideSubTitle(slide, true)).toBe('Some content text');
		});

		it('returns "Keep lending" message when slide has progress', () => {
			const slide = { totalProgressToAchievement: 3 };
			expect(getSlideSubTitle(slide, false)).toBe('Keep lending to reach your next achievement');
		});

		it('returns "Get started" message when no progress', () => {
			const slide = buildSlide({});
			expect(getSlideSubTitle(slide, false)).toBe('Get started to reach your first achievement');
		});
	});

	describe('getSlidePrimaryCtaText', () => {
		it('returns primaryCtaText from uiSettings', () => {
			const slide = buildSlide({ primaryCtaText: 'Lend now' });
			expect(getSlidePrimaryCtaText(slide)).toBe('Lend now');
		});

		it('returns empty string when not set', () => {
			const slide = buildSlide({});
			expect(getSlidePrimaryCtaText(slide)).toBe('');
		});
	});

	describe('getSlidePrimaryCtaVariant', () => {
		it('returns variant from uiSettings', () => {
			const slide = buildSlide({ primaryCtaVariant: 'primary' });
			expect(getSlidePrimaryCtaVariant(slide)).toBe('primary');
		});

		it('defaults to secondary', () => {
			const slide = buildSlide({});
			expect(getSlidePrimaryCtaVariant(slide)).toBe('secondary');
		});
	});

	describe('getSlideSecondaryCtaText', () => {
		it('returns secondaryCtaText from uiSettings', () => {
			const slide = buildSlide({ secondaryCtaText: 'Learn more' });
			expect(getSlideSecondaryCtaText(slide)).toBe('Learn more');
		});

		it('returns empty string when not set', () => {
			const slide = buildSlide({});
			expect(getSlideSecondaryCtaText(slide)).toBe('');
		});
	});

	describe('isSlideTitleFontSans', () => {
		it('returns true when titleSans is "true"', () => {
			const slide = buildSlide({ titleSans: 'true' });
			expect(isSlideTitleFontSans(slide)).toBe(true);
		});

		it('returns false when titleSans is not "true"', () => {
			const slide = buildSlide({ titleSans: 'false' });
			expect(isSlideTitleFontSans(slide)).toBe(false);
		});

		it('returns false when titleSans is not set', () => {
			const slide = buildSlide({});
			expect(isSlideTitleFontSans(slide)).toBe(false);
		});
	});

	describe('getSlideTitleColor', () => {
		it('returns titleColor from uiSettings', () => {
			const slide = buildSlide({ titleColor: 'tw-text-primary' });
			expect(getSlideTitleColor(slide, false)).toBe('tw-text-primary');
		});

		it('returns tw-text-action for non-badge slides without titleColor', () => {
			const slide = buildSlide({});
			expect(getSlideTitleColor(slide, true)).toBe('tw-text-action');
		});

		it('returns undefined for badge slides without titleColor', () => {
			const slide = buildSlide({});
			expect(getSlideTitleColor(slide, false)).toBeUndefined();
		});
	});

	describe('getSlideMediaImgUrl', () => {
		it('returns optimized URL from media data', () => {
			const media = {
				data: {
					target: {
						fields: {
							contentLight: [{
								fields: {
									file: { url: '//images.ctfassets.net/test/image.jpg' },
								},
							}],
						},
					},
				},
			};
			const result = getSlideMediaImgUrl(media);
			expect(result).toContain('images.ctfassets.net/test/image.jpg');
		});

		it('returns empty string for null media', () => {
			expect(getSlideMediaImgUrl(null)).toBe('');
		});
	});

	describe('getSlideBackgroundImg', () => {
		it('returns embedded-asset-block URL for badge slides', () => {
			const slide = buildSlide({}, [{
				nodeType: 'embedded-asset-block',
				data: {
					target: {
						fields: {
							file: { url: '//images.ctfassets.net/badge-bg.jpg' },
						},
					},
				},
			}]);
			const result = getSlideBackgroundImg(slide, false, false);
			expect(result).toContain('badge-bg.jpg');
		});

		it('returns empty string when no background image found', () => {
			const slide = buildSlide({});
			const result = getSlideBackgroundImg(slide, false, false);
			expect(result).toBe('');
		});

		it('returns desktop media URL for non-badge slides on desktop', () => {
			const slide = buildSlide({}, [
				{
					data: {
						target: {
							sys: { contentType: { sys: { id: 'media' } } },
							fields: {
								key: 'slide-mobile',
								contentLight: [{
									fields: { file: { url: '//images.ctfassets.net/mobile.jpg' } },
								}],
							},
						},
					},
				},
				{
					data: {
						target: {
							sys: { contentType: { sys: { id: 'media' } } },
							fields: {
								key: 'slide-desktop',
								contentLight: [{
									fields: { file: { url: '//images.ctfassets.net/desktop.jpg' } },
								}],
							},
						},
					},
				},
			]);
			const result = getSlideBackgroundImg(slide, true, false);
			expect(result).toContain('desktop.jpg');
		});

		it('returns mobile media URL for non-badge slides on mobile', () => {
			const slide = buildSlide({}, [
				{
					data: {
						target: {
							sys: { contentType: { sys: { id: 'media' } } },
							fields: {
								key: 'slide-mobile',
								contentLight: [{
									fields: { file: { url: '//images.ctfassets.net/mobile.jpg' } },
								}],
							},
						},
					},
				},
				{
					data: {
						target: {
							sys: { contentType: { sys: { id: 'media' } } },
							fields: {
								key: 'slide-desktop',
								contentLight: [{
									fields: { file: { url: '//images.ctfassets.net/desktop.jpg' } },
								}],
							},
						},
					},
				},
			]);
			const result = getSlideBackgroundImg(slide, true, true);
			expect(result).toContain('mobile.jpg');
		});
	});
});

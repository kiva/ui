import {
	buildDynamicString,
	formatGenericContentBlock,
	formatResponsiveImageSet,
	formatMediaAssetArray,
	formatUiSetting,
	processPageContent,
	processPageContentFlat
} from '@/util/contentfulUtils';

import inactiveUiSetting from '../../fixtures/UiSettingTypeInactiveRaw.json';
import ccPageRaw from '../../fixtures/CorporateCampaignContentfulPageRaw.json';
import adPageRawNoSettings from '../../fixtures/AutoDepositPageRawNoSettings.json';

import uiSettingRaw from '../../fixtures/UiSettingRaw.json';
import genericContentBlockRaw from '../../fixtures/GenericContentBlockRaw.json';
import responsiveImageSetRaw from '../../fixtures/ResponsiveImageSetRaw.json';
import responsiveImageSetResult from '../../fixtures/ResponsiveImageSetResult.json';

describe('contentfulUtils.js', () => {
	describe('buildDynamicString', () => {
		it('returns the source string with instances of split key replaced with the given values', () => {
			expect(buildDynamicString(
				'There are {value} things',
				'{value}',
				[5]
			)).toBe('There are 5 things');
			expect(buildDynamicString(
				'There are {value} things. A whole {value}!',
				'{value}',
				[5, '89%']
			)).toBe('There are 5 things. A whole 89%!');
		});

		it('returns the source string if no split key is present', () => {
			expect(buildDynamicString(
				'There is no split key',
				'{value}',
				[5]
			)).toBe('There is no split key');
		});
	});

	describe('formatUiSetting', () => {
		test('should return a Ui Setting specific object', () => {
			const expectedObject = {
				key: 'campaign-test-setting',
				active: true,
				startDate: '2020-09-16T00:00-07:00',
				endDate: '2020-10-21T00:00-07:00',
				contents: [{}],
				dataObject: { 'campaign-data': 'data value field' },
			};
			expect(formatUiSetting(uiSettingRaw)).toMatchObject(expectedObject);
		});
	});

	describe('formatMediaAssetArray', () => {
		test('should return an array of media assets', () => {
			expect(formatMediaAssetArray(responsiveImageSetRaw.fields.images)).toMatchObject(expect.any(Array));
		});
	});

	describe('formatResponsiveImageSet', () => {
		test('should return a Responsive Image Set specific object', () => {
			const expectedObject = {
				name: 'COVID fund Homepage Promo Images',
				description: 'Lend a hand from afar and join the global COVID-19 response. Take action',
				images: expect.any(Array)
			};

			expect(formatResponsiveImageSet(responsiveImageSetRaw)).toMatchObject(expectedObject);
		});

		test('should contain properly formatted Responsive Image Set entries', () => {
			expect(formatResponsiveImageSet(responsiveImageSetRaw)).toMatchObject(responsiveImageSetResult);
		});
	});

	describe('formatGenericContentBlock', () => {
		test('should return a Generic Content Block specific object', () => {
			const expectedObject = {
				key: 'header-area',
				name: 'Test Campaign Title GCB',
				bodyCopy: expect.any(Object),
				headline: expect.any(String),
				subHeadline: expect.any(String),
				primaryCtaLink: expect.any(String),
				primaryCtaKvTrackEvent: expect.any(Array),
				primaryCtaText: expect.any(String)
			};
			expect(formatGenericContentBlock(genericContentBlockRaw)).toMatchObject(expectedObject);
		});
	});

	describe('processPageContent', () => {
		test('should return an error object if content is not a page', () => {
			expect(processPageContent(inactiveUiSetting)).toEqual({ error: 'Non-Page Type Contentful Response' });
		});

		const pageLevelData = {
			page: {
				key: 'promo-campaign-test',
				path: '/cc/promo-campaign-test',
				pageType: 'corporate-campaign',
				pageTitle: 'Test Page Title',
			}
		};

		test('should return page level data', () => {
			expect(processPageContent(ccPageRaw)).toMatchObject(pageLevelData);
		});

		const pageLevelAndLayoutData = {
			page: {
				key: 'promo-campaign-test',
				path: '/cc/promo-campaign-test',
				pageType: 'corporate-campaign',
				pageLayout: {
					name: 'Promo Campaign Test',
					pageBackgroundColor: '',
					headerTheme: 'lightHeader',
					contentGroups: [{}],
					footerTheme: undefined,
					pageTitle: 'Test Page Layout Title',
				},
				settings: [{}]
			}
		};

		test('should return page level + page layout, content groups and content data', () => {
			expect(processPageContent(ccPageRaw)).toMatchObject(pageLevelAndLayoutData);
		});

		const pageLevelLayoutAndContentGroups = {
			page: {
				key: 'promo-campaign-test',
				path: '/cc/promo-campaign-test',
				pageType: 'corporate-campaign',
				pageLayout: {
					name: 'Promo Campaign Test',
					pageBackgroundColor: '',
					headerTheme: 'lightHeader',
					contentGroups: [{
						key: 'promo-campaign-test-cg',
						name: 'Promo Campaign Test Content Groups',
						title: 'Promo Campaign Test Content Groups',
						contents: [{
							key: 'header-area',
							name: 'Test Campaign Title',
							bodyCopy: {
								content: [{
									content: [{}],
									data: {},
									nodeType: 'paragraph',
								}],
								data: {},
								nodeType: 'document',
							},
						},
						{
							name: 'COVID fund Homepage Promo Images',
							description: 'Lend a hand from afar and join the global COVID-19 response. Take action',
							images: expect.any(Array)
						}]
					}],
					footerTheme: undefined,
					pageTitle: 'Test Page Layout Title',
				},
				pageTitle: 'Test Page Title',
			}
		};

		test('should return page, layout, and content group data', () => {
			expect(processPageContent(ccPageRaw)).toMatchObject(pageLevelLayoutAndContentGroups);
		});
	});

	describe('processPageContentFlattened', () => {
		test('should return an error object if content is not a page', () => {
			expect(processPageContentFlat(inactiveUiSetting)).toEqual({ error: 'Non-Page Type Contentful Response' });
		});

		const pageLevelData = {
			page: {
				key: 'promo-campaign-test',
				path: '/cc/promo-campaign-test',
				pageType: 'corporate-campaign',
				pageTitle: 'Test Page Title',
			}
		};

		test('should return page level data', () => {
			expect(processPageContentFlat(ccPageRaw)).toMatchObject(pageLevelData);
		});

		const pageLevelAndLayoutData = {
			page: {
				key: 'promo-campaign-test',
				path: '/cc/promo-campaign-test',
				pageType: 'corporate-campaign',
				pageLayout: {
					name: 'Promo Campaign Test',
					headerTheme: 'lightHeader',
					pageTitle: 'Test Page Layout Title',
				},
				settings: expect.any(Array),
				contentGroups: expect.any(Object),
				pageTitle: 'Test Page Title',
			}
		};

		test('should return flattened page level + page layout, content groups and content data', () => {
			expect(processPageContentFlat(ccPageRaw)).toMatchObject(pageLevelAndLayoutData);
		});

		const pageLevelLayoutAndContentGroups = {
			page: {
				key: 'promo-campaign-test',
				path: '/cc/promo-campaign-test',
				pageType: 'corporate-campaign',
				pageLayout: {
					name: 'Promo Campaign Test',
					headerTheme: 'lightHeader',
					pageTitle: 'Test Page Layout Title',
				},
				settings: expect.any(Array),
				contentGroups: {
					mlCampaignHero: {
						key: 'promo-campaign-test-cg',
						name: 'Promo Campaign Test Content Groups',
						title: 'Promo Campaign Test Content Groups',
						contents: [{
							key: 'header-area',
							name: 'Test Campaign Title',
							bodyCopy: expect.any(Object)
						},
						{
							name: 'COVID fund Homepage Promo Images',
							description: 'Lend a hand from afar and join the global COVID-19 response. Take action',
							images: expect.any(Array)
						}],
						type: 'mlCampaignHero'
					}
				},
				pageTitle: 'Test Page Title',
			}
		};

		test('should return flattened page, layout, and content group data', () => {
			expect(processPageContentFlat(ccPageRaw)).toMatchObject(pageLevelLayoutAndContentGroups);
		});
	});

	describe('processPageContentFlattened with non specific data', () => {
		test('should return an error object if content is not a page', () => {
			expect(processPageContentFlat(inactiveUiSetting)).toEqual({ error: 'Non-Page Type Contentful Response' });
		});

		const pageLevelData = {
			page: {
				key: expect.any(String),
				path: expect.any(String),
				pageType: expect.any(String),
				pageTitle: expect.any(String)
			}
		};

		test('should return page level data', () => {
			expect(processPageContentFlat(ccPageRaw)).toMatchObject(pageLevelData);
		});

		const pageLevelAndLayoutData = {
			page: {
				key: expect.any(String),
				path: expect.any(String),
				pageType: expect.any(String),
				pageLayout: expect.objectContaining({
					name: expect.any(String),
					headerTheme: expect.any(String),
					pageTitle: expect.any(String)
				}),
				settings: expect.any(Array),
				contentGroups: expect.any(Object),
				pageTitle: expect.any(String)
			}
		};

		test('should return flattened page level + page layout, content groups and content data', () => {
			expect(processPageContentFlat(ccPageRaw)).toMatchObject(pageLevelAndLayoutData);
		});

		const pageLevelLayoutAndContentGroups = {
			page: {
				key: expect.any(String),
				path: expect.any(String),
				pageType: expect.any(String),
				pageLayout: expect.objectContaining({
					name: expect.any(String),
					headerTheme: expect.any(String),
					pageTitle: expect.any(String)
				}),
				settings: expect.any(Array),
				contentGroups: expect.objectContaining({
					mlCampaignHero: expect.objectContaining({
						key: expect.any(String),
						name: expect.any(String),
						contents: [{
							key: expect.any(String),
							name: expect.any(String),
							bodyCopy: expect.any(Object),
							contentType: expect.any(String)
						},
						{
							name: expect.any(String),
							description: expect.any(String),
							images: expect.any(Array),
							contentType: expect.any(String)
						}],
						type: expect.any(String)
					})
				}),
				pageTitle: expect.any(String)
			}
		};

		test('should return flattened page, layout, and content group data', () => {
			expect(processPageContentFlat(ccPageRaw)).toMatchObject(pageLevelLayoutAndContentGroups);
		});
	});

	/**
	*	This test group tests adPageRawNoSettings which includes:
	*	- No page type
	*	- An empty settings property
	*	- Rich text fields
	*/

	describe('processPageContentFlattened with non specific data for adPageRawNoSettings', () => {
		test('should return an error object if content is not a page', () => {
			expect(processPageContentFlat(inactiveUiSetting)).toEqual({ error: 'Non-Page Type Contentful Response' });
		});

		const pageLevelData = {
			page: {
				key: expect.any(String),
				path: expect.any(String),
				pageType: undefined,
				pageTitle: undefined
			}
		};

		test('should return page level data', () => {
			expect(processPageContentFlat(adPageRawNoSettings)).toMatchObject(pageLevelData);
		});

		const pageLevelAndLayoutData = {
			page: {
				key: expect.any(String),
				path: expect.any(String),
				pageType: undefined,
				pageLayout: expect.objectContaining({
					name: expect.any(String),
					headerTheme: undefined,
					footerTheme: undefined,
					pageTitle: undefined
				}),
				settings: [],
				contentGroups: expect.any(Object),
				pageTitle: undefined
			}
		};

		test('should return flattened page level + page layout, content groups and content data', () => {
			expect(processPageContentFlat(adPageRawNoSettings)).toMatchObject(pageLevelAndLayoutData);
		});

		const pageLevelLayoutAndContentGroups = {
			page: {
				key: expect.any(String),
				path: expect.any(String),
				pageType: undefined,
				pageLayout: expect.objectContaining({
					name: expect.any(String),
					headerTheme: undefined,
					footerTheme: undefined,
					pageTitle: undefined
				}),
				settings: [],
				contentGroups: expect.objectContaining({
					autoDepositCta: expect.objectContaining({
						key: expect.any(String),
						name: expect.any(String),
						contents: [
							{
								key: expect.any(String),
								name: expect.any(String),
								bodyCopy: expect.any(Object),
								headline: 'Set up an Auto Deposit',
								contentType: expect.any(String)
							}
						],
					}),
					autoDepositFaqs: expect.objectContaining({
						key: expect.any(String),
						name: expect.any(String),
						contents: [{
							key: expect.any(String),
							name: expect.any(String),
							richText: expect.any(Object),
							contentType: expect.any(String)
						}, {
							key: expect.any(String),
							name: expect.any(String),
							richText: expect.any(Object),
							contentType: expect.any(String)
						}, {
							key: expect.any(String),
							name: expect.any(String),
							richText: expect.any(Object),
							contentType: expect.any(String)
						}, {
							key: expect.any(String),
							name: expect.any(String),
							richText: expect.any(Object),
							contentType: expect.any(String)
						}],
					}),
					autoDepositWhatToExpect: expect.objectContaining({
						key: expect.any(String),
						name: expect.any(String),
						contents: [{
							key: expect.any(String),
							name: expect.any(String),
							richText: expect.any(Object),
							contentType: expect.any(String)
						}, {
							key: expect.any(String),
							name: expect.any(String),
							richText: expect.any(Object),
							contentType: expect.any(String)
						}, {
							key: expect.any(String),
							name: expect.any(String),
							richText: expect.any(Object),
							contentType: expect.any(String)
						}],
					})
				}),
				pageTitle: undefined
			}
		};

		test('should return flattened page, layout, and content group data', () => {
			expect(processPageContentFlat(adPageRawNoSettings)).toMatchObject(pageLevelLayoutAndContentGroups);
		});
	});
});

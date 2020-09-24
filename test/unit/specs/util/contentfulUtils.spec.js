import {
	formatGenericContentBlock,
	formatResponsiveImageSet,
	formatMediaAssetArray,
	formatUiSetting,
	processPageContent,
	processPageContentFlat
} from '@/util/contentfulUtils';

import inactiveUiSetting from '../../fixtures/UiSettingTypeInactiveRaw.json';
import ccPageRaw from '../../fixtures/CorporateCampaignContentfulPageRaw.json';
import uiSettingRaw from '../../fixtures/UiSettingRaw.json';
import genericContentBlockRaw from '../../fixtures/GenericContentBlockRaw.json';
import responsiveImageSetRaw from '../../fixtures/ResponsiveImageSetRaw.json';
import responsiveImageSetResult from '../../fixtures/ResponsiveImageSetResult.json';

describe('contentfulUtils.js', () => {
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
			console.log(responsiveImageSetRaw.fields.images);
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
					contentGroups: [{}]
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
					contentGroups: [{
						key: 'promo-campaign-test-cg',
						name: 'Promo Campaign Test Content Groups',
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
					}]
				}
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
					name: 'Promo Campaign Test'
				},
				settings: expect.any(Array),
				contentGroups: expect.any(Object)
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
				},
				settings: expect.any(Array),
				contentGroups: {
					promoCampaignTestCg: {
						key: 'promo-campaign-test-cg',
						name: 'Promo Campaign Test Content Groups',
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
					}
				}
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
					name: expect.any(String)
				}),
				settings: expect.any(Array),
				contentGroups: expect.any(Object)
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
					name: expect.any(String)
				}),
				settings: expect.any(Array),
				contentGroups: expect.objectContaining({
					promoCampaignTestCg: expect.objectContaining({
						key: expect.any(String),
						name: expect.any(String),
						contents: [{
							key: expect.any(String),
							name: expect.any(String),
							bodyCopy: expect.any(Object)
						},
						{
							name: expect.any(String),
							description: expect.any(String),
							images: expect.any(Array)
						}],
					})
				})
			}
		};

		test('should return flattened page, layout, and content group data', () => {
			expect(processPageContentFlat(ccPageRaw)).toMatchObject(pageLevelLayoutAndContentGroups);
		});
	});
});

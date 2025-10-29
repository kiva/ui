/* eslint-disable max-len */
import {
	buildDynamicString,
	formatButton,
	formatBackground,
	formatCarousel,
	formatStoryCard,
	formatGlobalPromoBanner,
	formatContentGroupsFlat,
	formatContentType,
	formatGenericContentBlock,
	formatMediaAssetArray,
	formatResponsiveImageSet,
	formatUiSetting,
	processPageContent,
	processPageContentFlat,
	responsiveImageSetSourceSets
} from '../../../../src/util/contentfulUtils';

import inactiveUiSetting from '../../fixtures/UiSettingTypeInactiveRaw.json';
import ccPageRaw from '../../fixtures/CorporateCampaignContentfulPageRaw.json';
import adPageRawNoSettings from '../../fixtures/AutoDepositPageRawNoSettings.json';

import uiSettingRaw from '../../fixtures/UiSettingRaw.json';
import genericContentBlockRaw from '../../fixtures/GenericContentBlockRaw.json';
import responsiveImageSetRaw from '../../fixtures/ResponsiveImageSetRaw.json';
import responsiveImageSetResult from '../../fixtures/ResponsiveImageSetResult.json';
import imageSourceSetResult from '../../fixtures/ImageSourceSetResult';
import imageSourceSetResultStandardSizing from '../../fixtures/ImageSourceSetResultStandardSizing';

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

		it('returns empty string when sourceString is not a string', () => {
			expect(buildDynamicString(null, '{value}', [5])).toBe('');
			expect(buildDynamicString(undefined, '{value}', [5])).toBe('');
			expect(buildDynamicString(123, '{value}', [5])).toBe('');
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

		test('should return empty array for null or undefined input', () => {
			expect(formatMediaAssetArray(null)).toEqual([]);
			expect(formatMediaAssetArray(undefined)).toEqual([]);
			expect(formatMediaAssetArray([])).toEqual([]);
		});
	});

	describe('formatResponsiveImageSet', () => {
		const formattedResponsiveImageSet = formatResponsiveImageSet(responsiveImageSetRaw);
		test('should return a Responsive Image Set specific object', () => {
			const expectedObject = {
				name: 'Sample Responsive Image Set',
				description: 'This is the description of the responsive image set',
				images: expect.any(Array),
				responsiveSizing: expect.any(Object)
			};

			expect(formattedResponsiveImageSet).toMatchObject(expectedObject);
		});

		test('should contain properly formatted Responsive Image Set entries', () => {
			expect(formattedResponsiveImageSet).toMatchObject({
				description: 'This is the description of the responsive image set',
				images: [
					{
						description: 'Description for Homepage Image lg',
						file: {
							contentType: 'image/jpeg',
							details: {
								image: {
									height: 500,
									width: 1362
								},
								size: 87066
							},
							fileName: 'homepage_image_lg.jpg',
							url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_lg.jpg'
						},
						title: 'homepage image lg'
					},
				],
				name: 'Sample Responsive Image Set',
				responsiveSizing: {
					sm: {
						width: 550
					},
					md: {
						width: 450
					},
					lg: {
						width: 350
					},
					xl: {
						width: 550
					},
				}
			});
		});
	});

	describe('responsiveImageSetSourceSets', () => {
		test('should return a properly formatted array of responsive images to be used as a source set', () => {
			const basicImageSetResult = responsiveImageSetResult;
			const sourceSets = responsiveImageSetSourceSets(basicImageSetResult);
			expect(sourceSets).toEqual(imageSourceSetResult);
		});

		test('should filter out `std` images', () => {
			const setWithStdImages = {
				description: responsiveImageSetResult.description,
				responsiveSizing: responsiveImageSetResult.responsiveSizing,
				name: responsiveImageSetResult.name,
				images: [...responsiveImageSetResult.images, {
					description: 'Description for Homepage Image lg std',
					file: {
						contentType: 'image/jpeg',
						details: {
							image: {
								height: 500,
								width: 1362
							},
							size: 87066
						},
						fileName: 'homepage_image_lg_std.jpg',
						url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_lg_std.jpg'
					},
					title: 'homepage image lg std'
				}]
			};
			const sourceSets = responsiveImageSetSourceSets(setWithStdImages);
			expect(sourceSets).toEqual(imageSourceSetResult);
		});

		test('should not require responsive sizing and should use default sizing when missing', () => {
			const setWithStdImages = {
				description: responsiveImageSetResult.description,
				responsiveSizing: {},
				name: responsiveImageSetResult.name,
				images: responsiveImageSetResult.images
			};
			const sourceSets = responsiveImageSetSourceSets(setWithStdImages);
			expect(sourceSets).toEqual(imageSourceSetResultStandardSizing);
		});

		test('should handle missing image sizes', () => {
			const setWithOnlySmallAndLarge = {
				description: responsiveImageSetResult.description,
				responsiveSizing: responsiveImageSetResult.responsiveSizing,
				name: responsiveImageSetResult.name,
				images: [
					{
						description: 'Description for Homepage Image sm',
						file: {
							contentType: 'image/jpeg',
							details: {
								image: {
									height: 500,
									width: 1362
								},
								size: 87066
							},
							fileName: 'homepage_image_sm.jpg',
							url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_sm.jpg'
						},
						title: 'homepage image'
					},
					{
						description: 'Description for Homepage Image lg',
						file: {
							contentType: 'image/jpeg',
							details: {
								image: {
									height: 500,
									width: 1362
								},
								size: 87066
							},
							fileName: 'homepage_image_lg.jpg',
							url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_lg.jpg'
						},
						title: 'homepage image lg'
					}
				]
			};
			const sourceSets = responsiveImageSetSourceSets(setWithOnlySmallAndLarge);
			const setResult = [
				{
					height: 128,
					media: 'min-width: 1024px',
					sortOrder: 2,
					url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_lg.jpg',
					width: 350,
				},
				{
					height: 202,
					media: 'min-width: 0',
					sortOrder: 4,
					url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_sm.jpg',
					width: 550,
				},
			];
			expect(sourceSets).toEqual(setResult);
		});

		test('should only return 1 item if size is declared multiple times', () => {
			const setWithMultipleSize = {
				description: responsiveImageSetResult.description,
				responsiveSizing: {},
				name: responsiveImageSetResult.name,
				images: [
					{
						description: 'Description for Homepage Image lg1',
						file: {
							contentType: 'image/jpeg',
							details: {
								image: {
									height: 500,
									width: 1362
								},
								size: 87066
							},
							fileName: 'homepage_image_sm.jpg',
							url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_lg1.jpg'
						},
						title: 'homepage image lg'
					},
					{
						description: 'Description for Homepage Image lg2',
						file: {
							contentType: 'image/jpeg',
							details: {
								image: {
									height: 500,
									width: 1362
								},
								size: 87066
							},
							fileName: 'homepage_image_sm.jpg',
							url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_lg2.jpg'
						},
						title: 'homepage image lg'
					},
					{
						description: 'Description for Homepage Image lg3',
						file: {
							contentType: 'image/jpeg',
							details: {
								image: {
									height: 500,
									width: 1362
								},
								size: 87066
							},
							fileName: 'homepage_image_lg3.jpg',
							url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_lg3.jpg'
						},
						title: 'homepage image lg'
					},
				]
			};
			const sourceSets = responsiveImageSetSourceSets(setWithMultipleSize);
			const setResult = [
				{
					height: 529,
					media: 'min-width: 1024px',
					sortOrder: 2,
					url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_lg1.jpg',
					width: 1440,
				},
			];
			expect(sourceSets).toEqual(setResult);
		});

		test('should handle missing some responsive sizes', () => {
			const setWithSomeMissingResponsiveSizes = {
				description: responsiveImageSetResult.description,
				responsiveSizing: {
					sm: {
						width: 550
					},
					lg: {
						width: 350
					},
				},
				name: responsiveImageSetResult.name,
				images: [
					{
						description: 'Description for Homepage Image sm',
						file: {
							contentType: 'image/jpeg',
							details: {
								image: {
									height: 500,
									width: 1362
								},
								size: 87066
							},
							fileName: 'homepage_image_sm.jpg',
							url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_sm.jpg'
						},
						title: 'homepage image'
					},
					{
						description: 'Description for Homepage Image md',
						file: {
							contentType: 'image/jpeg',
							details: {
								image: {
									height: 500,
									width: 1362
								},
								size: 87066
							},
							fileName: 'homepage_image_md.jpg',
							url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_md.jpg'
						},
						title: 'homepage Image md'
					},
					{
						description: 'Description for Homepage Image lg',
						file: {
							contentType: 'image/jpeg',
							details: {
								image: {
									height: 500,
									width: 1362
								},
								size: 87066
							},
							fileName: 'homepage_image_lg.jpg',
							url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_lg.jpg'
						},
						title: 'homepage image lg'
					}
				]
			};
			const sourceSets = responsiveImageSetSourceSets(setWithSomeMissingResponsiveSizes);
			const setResult = [
				{
					height: 128,
					media: 'min-width: 1024px',
					sortOrder: 2,
					url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_lg.jpg',
					width: 350,
				},
				{
					height: 376,
					media: 'min-width: 734px',
					sortOrder: 3,
					url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_md.jpg',
					width: 1024,
				},
				{
					height: 202,
					media: 'min-width: 0',
					sortOrder: 4,
					url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_sm.jpg',
					width: 550,
				},
			];
			expect(sourceSets).toEqual(setResult);
		});

		test('should default an image missing size signifier in title as small', () => {
			const setWithMissingSmall = {
				description: responsiveImageSetResult.description,
				responsiveSizing: responsiveImageSetResult.responsiveSizing,
				name: responsiveImageSetResult.name,
				images: [
					{
						description: 'Description for Homepage Image',
						file: {
							contentType: 'image/jpeg',
							details: {
								image: {
									height: 500,
									width: 1362
								},
								size: 87066
							},
							fileName: 'homepage_image.jpg',
							url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image.jpg'
						},
						title: 'homepage image'
					},
					{
						description: 'Description for Homepage Image md',
						file: {
							contentType: 'image/jpeg',
							details: {
								image: {
									height: 500,
									width: 1362
								},
								size: 87066
							},
							fileName: 'homepage_image_md.jpg',
							url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_md.jpg'
						},
						title: 'homepage Image md'
					}
				]
			};
			const sourceSets = responsiveImageSetSourceSets(setWithMissingSmall);
			const setResult = [
				{
					height: 165,
					media: 'min-width: 734px',
					sortOrder: 3,
					url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image_md.jpg',
					width: 450,
				},
				{
					height: 202,
					media: 'min-width: 0',
					sortOrder: 4,
					url: '//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/homepage_image.jpg',
					width: 550,
				},
			];
			expect(sourceSets).toEqual(setResult);
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
					pageBackgroundColor: undefined,
					contentGroups: [{}],
					pageTitle: 'Test Page Layout Title',
					pageDescription: 'Test Page Layout Description'
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
					pageBackgroundColor: undefined,
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
					pageTitle: 'Test Page Layout Title',
					pageDescription: 'Test Page Layout Description'
				},
				pageTitle: 'Test Page Title',
				pageDescription: 'Test Page Description',
				canonicalUrl: 'https://test-canonical.kiva.org/contentful'
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
					pageTitle: 'Test Page Layout Title',
					pageDescription: 'Test Page Layout Description'
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
					pageTitle: 'Test Page Layout Title',
					pageDescription: 'Test Page Layout Description',
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
				pageDescription: 'Test Page Description',
				canonicalUrl: 'https://test-canonical.kiva.org/contentful'
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

	describe('formatButton', () => {
		it('should format button with all fields', () => {
			const buttonData = {
				fields: {
					description: 'Click me',
					label: 'Submit',
					style: 'primary',
					subHeadline: 'Take action',
					webLink: 'https://example.com',
					deepLink: 'app://example',
					analyticsClickEvent: 'button_click',
					webClickEventName: 'web_click',
					filter: { type: 'gender', value: 'female' }
				}
			};

			const result = formatButton(buttonData);

			// Line 115: formatButton function
			expect(result).toEqual({
				description: 'Click me',
				label: 'Submit',
				style: 'primary',
				subHeadline: 'Take action',
				webLink: 'https://example.com',
				deepLink: 'app://example',
				analyticsClickEvent: 'button_click',
				webClickEventName: 'web_click',
				filter: { type: 'gender', value: 'female' }
			});
		});

		it('should handle missing fields', () => {
			const buttonData = { fields: {} };

			const result = formatButton(buttonData);

			expect(result.label).toBeUndefined();
			expect(result.webLink).toBeUndefined();
		});
	});

	describe('formatBackground', () => {
		it('should format background with all fields', () => {
			const backgroundData = {
				fields: {
					key: 'bg-key',
					name: 'Hero Background',
					backgroundColor: '#ffffff',
					backgroundMedia: {
						fields: {
							url: 'https://example.com/image.jpg',
							title: 'Background Image'
						}
					}
				}
			};

			const result = formatBackground(backgroundData);

			// Line 190: formatBackground function
			expect(result).toEqual({
				key: 'bg-key',
				name: 'Hero Background',
				backgroundColor: '#ffffff',
				backgroundMedia: {
					url: 'https://example.com/image.jpg',
					title: 'Background Image'
				}
			});
		});

		it('should handle missing backgroundMedia', () => {
			const backgroundData = {
				fields: {
					key: 'bg-key',
					name: 'Simple Background'
				}
			};

			const result = formatBackground(backgroundData);

			expect(result.backgroundMedia).toBeUndefined();
		});
	});

	describe('formatCarousel', () => {
		it('should format carousel with slides', () => {
			const carouselData = {
				fields: {
					key: 'carousel-1',
					slides: [
						{
							sys: { contentType: { sys: { id: 'genericContentBlock' } } },
							fields: { key: 'slide-1', name: 'Slide 1' }
						}
					],
					slidesToShow: 3
				}
			};

			const result = formatCarousel(carouselData);

			// Line 206: formatCarousel function
			expect(result.key).toBe('carousel-1');
			expect(result.slidesToShow).toBe(3);
			expect(result.slides).toBeDefined();
		});

		it('should handle empty slides', () => {
			const carouselData = {
				fields: {
					key: 'carousel-empty',
					slides: []
				}
			};

			const result = formatCarousel(carouselData);

			expect(result.slides).toBeDefined();
		});
	});

	describe('formatStoryCard', () => {
		it('should format story card with all fields', () => {
			const storyCardData = {
				fields: {
					backgroundMedia: {
						fields: { url: 'https://example.com/bg.jpg', title: 'Background' }
					},
					cardTitle: 'Our Impact',
					cardContent: 'Making a difference...',
					footer: 'Learn more',
					key: 'story-1',
					theme: 'light',
					alignment: 'left',
					link: 'https://example.com',
					analyticsClickEvent: 'story_click'
				}
			};

			const result = formatStoryCard(storyCardData);

			// Line 226: formatStoryCard function
			expect(result).toEqual({
				backgroundMedia: { url: 'https://example.com/bg.jpg', title: 'Background' },
				cardTitle: 'Our Impact',
				cardContent: 'Making a difference...',
				footer: 'Learn more',
				key: 'story-1',
				theme: 'light',
				alignment: 'left',
				link: 'https://example.com',
				analyticsClickEvent: 'story_click'
			});
		});

		it('should default alignment to center when not provided', () => {
			const storyCardData = {
				fields: {
					key: 'story-no-alignment',
					cardTitle: 'Legacy Story'
				}
			};

			const result = formatStoryCard(storyCardData);

			// Line 226: alignment ?? 'center' - default value
			expect(result.alignment).toBe('center');
		});
	});

	describe('formatGlobalPromoBanner', () => {
		it('should format global promo banner', () => {
			const bannerData = {
				fields: {
					bannerName: 'Holiday Banner',
					richText: { content: [] },
					startDate: '2024-12-01',
					endDate: '2024-12-31',
					active: true,
					iconKey: 'gift',
					hiddenUrls: ['/excluded']
				}
			};

			const result = formatGlobalPromoBanner(bannerData);

			// Line 246: formatGlobalPromoBanner function
			expect(result.bannerName).toBe('Holiday Banner');
			expect(result.startDate).toBe('2024-12-01');
			expect(result.endDate).toBe('2024-12-31');
			expect(result.active).toBe(true);
			expect(result.iconKey).toBe('gift');
		});
	});

	describe('formatContentType', () => {
		it('should format richTextContent type', () => {
			const richTextData = {
				fields: {
					key: 'rich-text-key',
					richText: { content: [] }
				}
			};

			const result = formatContentType(richTextData, 'richTextContent');

			// Line 380: richTextContent case
			expect(result.contentType).toBe('richTextContent');
			expect(result.key).toBe('rich-text-key');
		});

		it('should format background type', () => {
			const backgroundData = {
				fields: {
					key: 'background-key',
					backgroundColor: '#FFFFFF'
				}
			};

			const result = formatContentType(backgroundData, 'background');

			// Line 385: background case
			expect(result.contentType).toBe('background');
			expect(result.backgroundColor).toBe('#FFFFFF');
		});

		it('should format button type', () => {
			const buttonData = {
				fields: {
					label: 'Click Me',
					webLink: 'https://example.com'
				}
			};

			const result = formatContentType(buttonData, 'button');

			// Line 390: button case
			expect(result.contentType).toBe('button');
			expect(result.label).toBe('Click Me');
			expect(result.webLink).toBe('https://example.com');
		});

		it('should format storyCard type', () => {
			const storyCardData = {
				fields: {
					key: 'story-key',
					cardTitle: 'My Story'
				}
			};

			const result = formatContentType(storyCardData, 'storyCard');

			// Line 395: storyCard case
			expect(result.contentType).toBe('storyCard');
			expect(result.cardTitle).toBe('My Story');
		});

		it('should format carousel type', () => {
			const carouselData = {
				fields: {
					key: 'carousel-key',
					slides: [],
					slidesToShow: 3
				}
			};

			const result = formatContentType(carouselData, 'carousel');

			// Line 400: carousel case (returning formatCarousel result with contentType)
			expect(result.contentType).toBe('carousel');
			expect(result.key).toBe('carousel-key');
			expect(result.slidesToShow).toBe(3);
		});

		it('should return error for unrecognized content type', () => {
			const unknownData = {
				fields: { key: 'unknown' }
			};

			const result = formatContentType(unknownData, 'unknownType');

			// Line 405: default case
			expect(result.error).toBe('Unrecognized Content Type');
		});
	});

	describe('formatContentGroupsFlat', () => {
		it('should process content groups and flatten them', () => {
			const contentGroups = [
				{
					sys: { contentType: { sys: { id: 'contentGroup' } } },
					fields: {
						key: 'group-1',
						name: 'Main Content',
						type: 'featured',
						title: 'Featured Items',
						contents: []
					}
				}
			];

			const result = formatContentGroupsFlat(contentGroups);

			// Line 315: formatContentGroupsFlat function
			expect(result).toBeDefined();
			expect(result.featured).toBeDefined();
			expect(result.featured.key).toBe('group-1');
			expect(result.featured.name).toBe('Main Content');
		});

		it('should handle non-content-group entries with error', () => {
			const invalidEntries = [
				{
					sys: { contentType: { sys: { id: 'genericContentBlock' } } },
					fields: { key: 'invalid' }
				}
			];

			const result = formatContentGroupsFlat(invalidEntries);

			// Line 315: cleanedContentGroups.push with error
			// When entry is not a content group, it pushes error to cleanedContentGroups
			// but doesn't add to contentGroupsFlat, so result should be empty
			expect(result).toBeDefined();
			expect(Object.keys(result).length).toBe(0);
		});

		it('should handle content group with media', () => {
			const contentGroupsWithMedia = [
				{
					sys: { contentType: { sys: { id: 'contentGroup' } } },
					fields: {
						key: 'group-with-media',
						name: 'Media Group',
						media: [
							{
								fields: {
									title: 'Test Image',
									file: {
										url: '//example.com/image.jpg',
										contentType: 'image/jpeg'
									}
								}
							}
						],
						contents: []
					}
				}
			];

			const result = formatContentGroupsFlat(contentGroupsWithMedia);

			expect(result.groupWithMedia).toBeDefined();
			expect(result.groupWithMedia.media).toBeDefined();
			expect(result.groupWithMedia.media.length).toBeGreaterThan(0);
		});
	});
});

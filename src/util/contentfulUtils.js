import { camelCase } from 'change-case';
import kvTokensPrimitives from '@kiva/kv-tokens/primitives.json';

/**
 * Takes formatted responsiveImageSet and returns an array of image objects which
 * can be inserted into KvContentfulImg component as source sets
 *
 * @param {object} ResponsiveImage contentful object - output of: formatResponsiveImageSet
 * @returns {array}
 */
export function responsiveImageSetSourceSets(contentfulResponsiveImageObject) {
	const responsiveSizing = contentfulResponsiveImageObject.responsiveSizing || {};
	let formattedArray = contentfulResponsiveImageObject.images.flatMap(entry => {
		/**
         * This filters out images that have 'std' for support of legacy ResponsiveImageSets
         * that had both std and retina images. When all ResponsiveImageSets only have the
         * retina version of images on contentful, this if can be removed
         */

		if (entry.title.indexOf('std') !== -1) {
			return [];
		}

		// kvTokensPrimitives.breakpoints:
		// "breakpoints": {
		// 	"md": 734,
		// 	"lg": 1024,
		// 	"xl": 1440
		// },

		let mediaSize;
		let width;
		let sortOrder;

		const returnWidth = size => {
			let maxWidthAtBreakpoint;
			switch (size) {
				case ('md'):
					maxWidthAtBreakpoint = kvTokensPrimitives?.breakpoints?.lg || 1024;
					break;
				case ('lg'):
					maxWidthAtBreakpoint = kvTokensPrimitives?.breakpoints?.xl || 1440;
					break;
				case ('xl'):
					// max width at this breakpoint is as large as possible
					// lets return image width
					maxWidthAtBreakpoint = entry.file?.details?.image?.width;
					break;
				default:
					// small  or default
					maxWidthAtBreakpoint = kvTokensPrimitives?.breakpoints?.md || 734;
					break;
			}
			// return size or default
			return responsiveSizing?.[size]?.width || maxWidthAtBreakpoint;
		};

		switch (true) {
			case (entry.title.indexOf('md') !== -1):
				mediaSize = 'min-width: 734px';
				width = returnWidth('md');
				sortOrder = 3;
				break;
			case (entry.title.indexOf('lg') !== -1):
				mediaSize = 'min-width: 1024px';
				width = returnWidth('lg');
				sortOrder = 2;
				break;
			case (entry.title.indexOf('xl') !== -1):
				mediaSize = 'min-width: 1440px';
				width = returnWidth('xl');
				sortOrder = 1;
				break;
			default:
				// small (entry.title.indexOf('sm') !== -1 ) or default
				mediaSize = 'min-width: 0';
				width = returnWidth('sm');
				sortOrder = 4;
				break;
		}
		const aspectRatio = (entry.file?.details?.image?.height ?? 0) / (entry.file?.details?.image?.width ?? 1);// eslint-disable-line max-len
		const height = aspectRatio ? Math.round(width * aspectRatio) : null;

		return [{
			width,
			height,
			media: mediaSize,
			url: entry.file?.url ?? '',
			sortOrder,
		}];
	});
	// Remove duplicate by sortOrder property
	formattedArray = formattedArray.reduce((unique, o) => {
		if (!unique.some(obj => obj.sortOrder === o.sortOrder)) {
			unique.push(o);
		}
		return unique;
	}, []);

	// Sort by sortOrder property
	formattedArray.sort((a, b) => {
		return (a.sortOrder > b.sortOrder) ? 1 : -1;
	});
	return formattedArray;
}

/**
 * Format Button (contentful type id: button)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function formatButton(contentfulContent) {
	return {
		description: contentfulContent.fields?.description,
		label: contentfulContent.fields?.label,
		style: contentfulContent.fields?.style,
		subHeadline: contentfulContent.fields?.subHeadline,
		webLink: contentfulContent.fields?.webLink,
		deepLink: contentfulContent.fields?.deepLink,
		analyticsClickEvent: contentfulContent.fields?.analyticsClickEvent,
		webClickEventName: contentfulContent.fields?.webClickEventName,
		filter: contentfulContent.fields?.filter,
	};
}

/**
 * Format Generic Content Block (contentful type id: genericContentBlock)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function formatGenericContentBlock(contentfulContent) {
	return {
		key: contentfulContent.fields?.key,
		name: contentfulContent.fields?.name,
		bodyCopy: contentfulContent.fields?.bodyCopy,
		headline: contentfulContent.fields?.headline,
		subHeadline: contentfulContent.fields?.subHeadline,
		primaryCtaLink: contentfulContent.fields?.primaryCtaLink,
		primaryCtaKvTrackEvent: contentfulContent.fields?.primaryCtaKvTrackEvent,
		primaryCtaText: contentfulContent.fields?.primaryCtaText,
	};
}

/**
 * Format Generic Content Block (contentful type id: richTextContent)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function formatRichTextContent(contentfulContent) {
	return {
		key: contentfulContent.fields?.key,
		name: contentfulContent.fields?.name,
		richText: contentfulContent.fields?.richText,
	};
}

/**
 * Format Ui Setting (contentful type id: uiSetting)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function formatUiSetting(contentfulContent) {
	return {
		key: contentfulContent.fields?.key,
		active: contentfulContent.fields?.active,
		startDate: contentfulContent.fields?.startDate,
		endDate: contentfulContent.fields?.endDate,
		// eslint-disable-next-line no-use-before-define
		contents: formatContentTypes(contentfulContent.fields?.content),
		dataObject: contentfulContent.fields?.dataObject,
	};
}

/**
 * Format Background (contentful type id: background)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function formatBackground(contentfulContent) {
	return {
		key: contentfulContent.fields?.key,
		name: contentfulContent.fields?.name,
		backgroundColor: contentfulContent.fields?.backgroundColor,
		backgroundMedia: contentfulContent.fields?.backgroundMedia?.fields,
	};
}

/**
 * Format Carousel (contentful type id: carousel)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function formatCarousel(contentfulContent) {
	return {
		key: contentfulContent.fields?.key,
		// eslint-disable-next-line no-use-before-define
		slides: formatContentTypes(contentfulContent.fields?.slides),
		slidesToShow: contentfulContent.fields?.slidesToShow,

	};
}

/**
 * Format StoryCard (contentful type id: storyCard)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * Default alignment value is center. This is enforced in the contentful UI,
 * but legacy story cards before the alignment field was added may have a null value
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function formatStoryCard(contentfulContent) {
	return {
		backgroundMedia: contentfulContent.fields?.backgroundMedia?.fields,
		cardTitle: contentfulContent.fields?.cardTitle,
		cardContent: contentfulContent.fields?.cardContent,
		footer: contentfulContent.fields?.footer,
		key: contentfulContent.fields?.key,
		theme: contentfulContent.fields?.theme,
		alignment: contentfulContent.fields?.alignment ?? 'center',
		link: contentfulContent.fields?.link,
		analyticsClickEvent: contentfulContent.fields?.analyticsClickEvent
	};
}

/**
 * Format Ui Setting (contentful type id: globalPromoBanner)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function formatGlobalPromoBanner(contentfulContent) {
	return {
		bannerName: contentfulContent.fields?.bannerName,
		richText: contentfulContent.fields?.richText,
		startDate: contentfulContent.fields?.startDate,
		endDate: contentfulContent.fields?.endDate,
		active: contentfulContent.fields?.active,
		iconKey: contentfulContent.fields?.iconKey,
		hiddenUrls: contentfulContent.fields?.hiddenUrls,
	};
}

/**
 * Format Media Asset (contentful Native type id: Asset)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * @param {array} mediaArray data
 * @returns {object}
 */
export function formatMediaAssetArray(mediaArray) {
	if (!mediaArray || !mediaArray.length) return [];

	const mediaAssets = [];

	mediaArray.forEach(media => {
		const mediaEntry = {
			title: media.fields?.title,
			description: media.fields?.description,
			file: media.fields?.file,
		};
		mediaAssets.push(mediaEntry);
	});
	return mediaAssets;
}

/**
 * Format ResponsiveImageSet (contentful type id: responsiveImageSet)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function formatResponsiveImageSet(contentfulContent) {
	const imageSet = {
		name: contentfulContent.fields?.name,
		description: contentfulContent.fields?.description,
		images: [],
		responsiveSizing: contentfulContent.fields?.responsiveSizing
	};
	const rawImages = contentfulContent.fields?.images;
	imageSet.images = formatMediaAssetArray(rawImages);

	return imageSet;
}

/**
 * Format ContentGroup (contentful type id: contentGroup)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function formatContentGroupsFlat(contentfulContent) {
	const contentGroupsFlat = {};
	const cleanedContentGroups = [];

	contentfulContent.forEach((entry, index) => {
		const isContentGroup = entry.sys?.contentType?.sys?.id === 'contentGroup';
		if (!isContentGroup) {
			cleanedContentGroups.push({
				error: 'Entry is not a Content Group'
			});
		} else {
			const contentGroupFields = {
				key: entry.fields?.key,
				name: entry.fields?.name,
				type: entry.fields?.type ?? null,
				title: entry.fields?.title ?? null,
				// eslint-disable-next-line no-use-before-define
				contents: formatContentTypes(entry.fields?.contents)
			};
			if (entry.fields?.media?.length) {
				contentGroupFields.media = formatMediaAssetArray(entry.fields?.media);
			}
			cleanedContentGroups.push(contentGroupFields);

			const cgType = entry.fields?.type ? camelCase(entry.fields?.type) : null;
			contentGroupsFlat[
				cgType
                || camelCase(entry.fields?.key)
                || `cg${index}`
			] = contentGroupFields;
		}
	});

	return contentGroupsFlat;
}

/**
 * Takes raw contentful content level object along with it's type, then calls it's helper method returning the content
 *
 * @param {object} contentfulContent data
 * @param {string} contentType data
 * @returns {object}
 */
export function formatContentType(contentfulContent, contentType) {
	// console.log(JSON.stringify(contentfulContent), contentType);
	switch (contentType) {
		case 'genericContentBlock':
			return {
				...formatGenericContentBlock(contentfulContent),
				contentType
			};
		case 'uiSetting':
			return {
				...formatUiSetting(contentfulContent),
				contentType
			};
		case 'globalPromoBanner':
			return {
				...formatGlobalPromoBanner(contentfulContent),
				contentType
			};
		case 'responsiveImageSet':
			return {
				...formatResponsiveImageSet(contentfulContent),
				contentType
			};
		case 'richTextContent':
			return {
				...formatRichTextContent(contentfulContent),
				contentType
			};
		case 'background':
			return {
				...formatBackground(contentfulContent),
				contentType
			};
		case 'button':
			return {
				...formatButton(contentfulContent),
				contentType
			};
		case 'storyCard':
			return {
				...formatStoryCard(contentfulContent),
				contentType
			};
		case 'carousel':
			return {
				...formatCarousel(contentfulContent),
				contentType
			};
		default:
			return { error: 'Unrecognized Content Type' };
	}
}

/**
 * Takes raw contentful content level objects and returns an array keys mapped for each content type.
 *
 * @param {array} contentfulContent data
 * @returns {array}
 */
export function formatContentTypes(contentfulContent) {
	const contents = contentfulContent?.length ? contentfulContent : [];
	const formattedContent = [];

	contents.forEach(item => {
		const contentType = item.sys?.contentType?.sys?.id;
		formattedContent.push(formatContentType(item, contentType));
	});

	return formattedContent;
}

/**
 * Takes raw contentful content page entry, and returns an object with keys mapped to page structured content types.
 *
 * @param {object} entryItem data
 * @returns {object}
 */
export function processPageContent(entryItem) {
	const contentfulContentObject = {};
	// verify we have a content type page object
	const isPage = entryItem.sys?.contentType?.sys?.id === 'page';
	if (!isPage) return { error: 'Non-Page Type Contentful Response' };

	// extract top level items in the Page, initialize pageLayout and settings
	contentfulContentObject.page = {
		key: entryItem.fields?.key,
		path: entryItem.fields?.path,
		pageTitle: entryItem.fields?.pageTitle,
		pageType: entryItem.fields?.pageType,
		pageLayout: {
			name: entryItem.fields?.pageLayout?.fields?.name,
			pageTitle: entryItem.fields?.pageLayout?.fields?.pageTitle,
			pageBackgroundColor: entryItem.fields?.pageLayout?.fields?.pageBackgroundColor,
		},
		settings: entryItem.fields?.settings
			? formatContentTypes(entryItem.fields?.settings) : []
	};

	// extract content groups for parsing
	const contentGroups = entryItem.fields?.pageLayout?.fields?.contentGroups ?? [];
	const cleanedContentGroups = [];

	if (contentGroups.length <= 0) {
		contentfulContentObject.page.pageLayout.contentGroups = {
			error: 'Non-Page Type Contentful Response'
		};
	} else {
		contentGroups.forEach(item => {
			const contentGroupFields = {
				key: item.fields?.key,
				name: item.fields?.name,
				type: item.fields?.type ?? null,
				title: item.fields?.title ?? null,
				contents: formatContentTypes(item.fields?.contents),
				media: formatMediaAssetArray(item.fields?.media),
			};
			cleanedContentGroups.push(contentGroupFields);
		});

		contentfulContentObject.page.pageLayout.contentGroups = cleanedContentGroups;
	}

	return contentfulContentObject;
}

/**
 * Takes raw contentful content page entry, and returns an object with keys mapped to page structured content types.
 *
 * @param {object} entryItem data
 * @returns {object}
 */
export function processPageContentFlat(entryItem) {
	const contentfulContentObject = {};
	// verify we have a content type page object
	const isPage = entryItem.sys?.contentType?.sys?.id === 'page';
	if (!isPage) return { error: 'Non-Page Type Contentful Response' };

	// extract top level items in the Page, initialize pageLayout and settings
	contentfulContentObject.page = {
		key: entryItem.fields?.key,
		path: entryItem.fields?.path,
		pageTitle: entryItem.fields?.pageTitle,
		pageType: entryItem.fields?.pageType,
		pageLayout: {
			name: entryItem.fields?.pageLayout?.fields?.name,
			pageTitle: entryItem.fields?.pageLayout?.fields?.pageTitle,
		},
		settings: entryItem.fields?.settings
			? formatContentTypes(entryItem.fields?.settings) : []
	};

	// extract content groups for parsing
	const contentGroups = entryItem.fields?.pageLayout?.fields?.contentGroups ?? [];

	if (contentGroups.length <= 0) {
		contentfulContentObject.page.pageLayout.contentGroups = {
			error: 'Missing Content Groups in Contentful Response'
		};
	} else {
		contentfulContentObject.page.contentGroups = formatContentGroupsFlat(contentGroups);
	}

	return contentfulContentObject;
}

/**
 *  Takes the following (sourceString, splitKey, [dynamicValues])
 *
 * - sourceString = String of text to be .split at the location of the splitKey
 * - splitKey = is the value to look for in the string to preform the .split
 * - [dynamicValues] are the values you want to concat to the string at location of the splitKey
 *
 */
export function buildDynamicString(sourceString = '', splitKey = '', dynamicValues = []) {
	if (typeof sourceString !== 'string') {
		return '';
	}
	// if the split key is not found in the source string, return the source string
	if (sourceString.indexOf(splitKey) === -1) {
		return sourceString;
	}

	let finalString = '';
	// split the source string where it finds the splitKey
	const stringSplit = sourceString.split(splitKey);
	// forEach with index of the sourceString
	stringSplit.forEach((item, index) => {
		finalString = finalString.concat(item);
		// if there's a dyanmic value at the current index, proceed adding it
		// to the finalString
		if (dynamicValues[index]) {
			finalString = finalString.concat(dynamicValues[index]);
		}
	});
	return finalString;
}

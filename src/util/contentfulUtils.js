import _get from 'lodash/get';
import { camelCase } from 'change-case';

function determineResponsiveSizeFromFileName(filename) {
	// retina
	let density = '';
	let size = '';
	if (filename.match(/retina/g)) {
		density = ' retina';
	}
	// std
	if (filename.match(/std/g)) {
		density = '';
	}
	// sizes
	if (filename.match(/sm/g)) {
		size = 'small';
	}
	if (filename.match(/med/g)) {
		size = 'medium';
	}
	if (filename.match(/lg/g)) {
		size = 'large';
	}
	if (filename.match(/xl/g) || filename.match(/xga/g)) {
		size = 'xga';
	}
	if (filename.match(/xxl/g) || filename.match(/wxga/g)) {
		size = 'wxga';
	}

	return `${size}${density}`;
}

/**
 * Takes raw contentful responsive image set object, and returns
 * an array with image urls mapped to their respective sizes
 *
 * @param {object} contentful Responsive Image Set Object
 * @returns {array}
 */
export function createArrayOfResponsiveImageSet(contentfulResponsiveImageSet) {
	// param must be an object, which contains prop images
	if (!contentfulResponsiveImageSet || !contentfulResponsiveImageSet.images) return [];

	// copy responsive image set param
	const contentfulResponsiveImageSetCopy = JSON.parse(JSON.stringify(contentfulResponsiveImageSet));
	contentfulResponsiveImageSetCopy.images.forEach(imageObj => {
		// eslint-disable-next-line no-param-reassign
		imageObj.responsiveSize = determineResponsiveSizeFromFileName(imageObj.file.fileName);
	});
	// convert to array and reduce
	const responsiveImageArray = contentfulResponsiveImageSetCopy.images.reduce((newArray, curVal) => {
		newArray.push([curVal.responsiveSize, curVal.file.url]);
		return newArray;
	}, []);
	return responsiveImageArray;
}

/**
 * TODO remove this once content field is fully deprecated from contentful
 * Takes raw contentful content field, and returns an object with keys mapped to the content type.
 * For the special contentful content field responsiveImageSet returns an array of objects.
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function processContent(contentfulContent) {
	const contentfulContentObject = {};
	contentfulContent.forEach(item => {
		const itemKey = _get(item, 'sys.contentType.sys.id');
		if (itemKey === 'responsiveImageSet') {
			if (!contentfulContentObject.responsiveImageSet) {
				contentfulContentObject.responsiveImageSet = [];
			}
			// Contentful Objects are non extensible so we have to perform a copy here of the fields object
			contentfulContentObject.responsiveImageSet.push(JSON.parse(JSON.stringify(item.fields)));
		} else {
			contentfulContentObject[itemKey] = JSON.parse(JSON.stringify(item.fields));
		}
	});
	if (contentfulContentObject.responsiveImageSet) {
		contentfulContentObject.responsiveImageSet.forEach(imageSet => {
			imageSet.images.forEach(imageObj => {
				// eslint-disable-next-line no-param-reassign
				imageObj.responsiveSize = determineResponsiveSizeFromFileName(imageObj.fields.file.fileName);
			});
		});
	}
	return contentfulContentObject;
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
 * Format Carousel (contentful type id: webCarousel)
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
	};
}

/**
 * Format StoryCard (contentful type id: storyCard)
 * Takes raw contentful content object and returns an object with targeted keys/values
 *
 * @param {array} contentfulContent data
 * @returns {object}
 */
export function formatStoryCard(contentfulContent) {
	return {
		backgroundMedia: contentfulContent.fields?.backgroundMedia?.fields,
		cardContent: contentfulContent.fields?.cardContent,
		footer: contentfulContent.fields?.footer,
		key: contentfulContent.fields?.key,
		kickerHeadline: contentfulContent.fields?.kickerHeadline,
		theme: contentfulContent.fields?.theme,
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
		images: []
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
		case 'webCarousel':
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
			headerTheme: entryItem.fields?.pageLayout?.fields?.headerTheme,
			footerTheme: entryItem.fields?.pageLayout?.fields?.footerTheme,
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
			headerTheme: entryItem.fields?.pageLayout?.fields?.headerTheme,
			footerTheme: entryItem.fields?.pageLayout?.fields?.footerTheme,
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

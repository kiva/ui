import _get from 'lodash/get';

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
	if (filename.match(/xl/g)) {
		size = 'xga';
	}
	if (filename.match(/xxl/g)) {
		size = 'wxga';
	}

	return `${size}${density}`;
}

/**
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
		// TODO: Add other GCB fields
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
	rawImages.forEach(image => {
		const imageEntry = {
			title: image.fields?.title,
			description: image.fields?.description,
			file: image.fields?.file,
		};
		imageSet.images.push(imageEntry);
	});
	return imageSet;
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
			return formatGenericContentBlock(contentfulContent);
		case 'uiSetting':
			return formatUiSetting(contentfulContent);
		case 'globalPromoBanner':
			return formatGlobalPromoBanner(contentfulContent);
		case 'responsiveImageSet':
			return formatResponsiveImageSet(contentfulContent);
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
	const contents = contentfulContent.length ? contentfulContent : [];
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

	// extract top level items in the Page, initialtize pageLayout and settings
	contentfulContentObject.page = {
		key: entryItem.fields?.key,
		path: entryItem.fields?.path,
		pageType: entryItem.fields?.pageType,
		pageLayout: {
			name: entryItem.fields?.pageLayout?.fields?.name
		},
		settings: entryItem.fields?.settings.length
			? formatContentTypes(entryItem.fields?.settings) : []
	};

	// TODO: Create Isolated Page Layout processor
	// TODO: Create Isolated Content Group processor
	// extract content groups for parsing
	const contentGroups = entryItem.fields?.pageLayout?.fields?.contentGroups;
	const cleanedContentGroups = [];

	if (contentGroups.length <= 0) {
		contentfulContentObject.page.pageLayout.contentGroups = {
			error: 'Non-Page Type Contentful Response'
		};
	} else {
		contentGroups.forEach(item => {
			// console.log('content group item', item);
			const contentGroupFields = {
				key: item.fields?.key,
				name: item.fields?.name,
				contents: formatContentTypes(item.fields?.contents)
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

	// extract top level items in the Page, initialtize pageLayout and settings
	contentfulContentObject.page = {
		key: entryItem.fields?.key,
		path: entryItem.fields?.path,
		pageType: entryItem.fields?.pageType,
		pageLayout: {
			name: entryItem.fields?.pageLayout?.fields?.name
		},
		settings: entryItem.fields?.settings.length
			? formatContentTypes(entryItem.fields?.settings) : []
	};

	// TODO: Create Isolated Page Layout processor
	// TODO: Create Isolated Content Group processor
	// extract content groups for parsing
	const contentGroups = entryItem.fields?.pageLayout?.fields?.contentGroups;
	const cleanedContentGroups = [];

	if (contentGroups.length <= 0) {
		contentfulContentObject.page.pageLayout.contentGroups = {
			error: 'Non-Page Type Contentful Response'
		};
	} else {
		const contentGroupsFlat = {};

		contentGroups.forEach((item, index) => {
			// console.log('content group item', item);
			// const contents = formatContentTypes(item.fields?.contents);
			const contentGroupFields = {
				key: item.fields?.key,
				name: item.fields?.name,
				contents: formatContentTypes(item.fields?.contents)
			};
			cleanedContentGroups.push(contentGroupFields);
			// TODO: Camelcase
			const cgName = item.fields?.key.replace(/-/g, '_');
			contentGroupsFlat[cgName || `cg-${index}`] = contentGroupFields;
		});
		// , index

		// contentfulContentObject.page.pageLayout.contentGroups = cleanedContentGroups;
		contentfulContentObject.page.contentGroups = contentGroupsFlat;
	}

	return contentfulContentObject;
}

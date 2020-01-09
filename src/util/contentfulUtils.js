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
// eslint-disable-next-line import/prefer-default-export
export function processContent(contentfulContent) {
	const contentfulContentObject = {};
	contentfulContent.forEach(item => {
		const itemKey = _get(item, 'sys.contentType.sys.id');
		if (itemKey === 'responsiveImageSet') {
			if (!contentfulContentObject.responsiveImageSet) {
				contentfulContentObject.responsiveImageSet = [];
			}
			contentfulContentObject.responsiveImageSet.push(item.fields);
		} else {
			contentfulContentObject[itemKey] = item.fields;
		}
	});

	contentfulContentObject.responsiveImageSet.forEach(imageSet => {
		imageSet.images.forEach((image, index) => {
			// eslint-disable-next-line no-param-reassign
			imageSet.images[index].responsiveSize = determineResponsiveSizeFromFileName(image.fields.file.fileName);
		});
	});
	return contentfulContentObject;
}
